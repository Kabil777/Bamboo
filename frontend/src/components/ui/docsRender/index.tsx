"use client";

import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

import "highlight.js/styles/tokyo-night-dark.css";

import { motion, AnimatePresence } from "framer-motion";
import {
	FileQuestion,
	Copy,
	Check,
	FileText,
	Clock,
	CalendarDays,
	Hash,
	ArrowLeft,
	Search,
	Github,
	Sparkles,
	ChevronLeft,
	ChevronRight,
	MessageCircle,
	Send,
	User,
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	ArticleRender,
	ArticleSidebar,
	ArticleTableContent,
	ProfileTag,
} from "@/components/atomsComponents";
import { BlogPageSkeleton } from "@/components/atomsComponents/skleton/BlogPageSkleton";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/shadcnUI/accordion";
import { Button } from "@/components/shadcnUI/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/shadcnUI/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/shadcnUI/tooltip";
import { SidebarTrigger } from "@/components/shadcnUI/sidebar";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { useApiLoading } from "@/hooks/useApiLoading";
import { usePathResolver } from "@/hooks/usePathResolver";
import { extractToc } from "@/lib/utils";
import { DocsRTK } from "@/store/reducers/DocsReducer";
import { toast } from "sonner";
import type { DocsTreeNode } from "@/types/docs/docs-base";

// ─── Helpers ─────────────────────────────────────────

function estimateReadingTime(text: string | null | undefined): number {
	if (!text) return 1;
	const words = text.trim().split(/\s+/).length;
	return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

function formatCommentDate(date: Date) {
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	const days = Math.floor(hrs / 24);
	if (days < 7) return `${days}d ago`;
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Flatten a docs tree into an ordered list of {id, title} for prev/next nav */
function flattenTree(
	nodes: DocsTreeNode[],
): { id: string; title: string }[] {
	const result: { id: string; title: string }[] = [];
	for (const node of nodes) {
		result.push({ id: node.id, title: node.title });
		if (node.subTree?.length) {
			result.push(...flattenTree(node.subTree));
		}
	}
	return result;
}

// ─── Types ───────────────────────────────────────────

interface Comment {
	id: string;
	name: string;
	text: string;
	timestamp: Date;
}

// ─── Animations ──────────────────────────────────────

const stagger = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.08, delayChildren: 0.1 },
	},
};

const fadeUp = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
	},
};

// ─── Gradient Colors for Avatars ─────────────────────

const avatarGradients = [
	"from-rose-400 to-pink-500",
	"from-violet-400 to-purple-500",
	"from-blue-400 to-indigo-500",
	"from-emerald-400 to-teal-500",
	"from-amber-400 to-orange-500",
	"from-cyan-400 to-sky-500",
];

function getAvatarGradient(name: string) {
	const idx = name.charCodeAt(0) % avatarGradients.length;
	return avatarGradients[idx];
}

// ─── Component ───────────────────────────────────────

export default function DocsRenderPage() {
	const params = useParams();
	const id = params.id as string[];
	const dispatch = useAppDispatch();
	const docId = id[0];

	useEffect(() => {
		if (!docId) return;
		dispatch(DocsRTK(docId));
	}, [docId, dispatch]);

	const [accordionValue, setAccordionValue] = useState<string | undefined>(
		undefined,
	);
	const [copied, setCopied] = useState(false);
	const [viewMarkdownOpen, setViewMarkdownOpen] = useState(false);
	const [dialogCopied, setDialogCopied] = useState(false);

	// ─── Ask with LLM State ──────────────────────
	const [askLlmOpen, setAskLlmOpen] = useState(false);
	const [llmQuestion, setLlmQuestion] = useState("");
	const [llmPromptCopied, setLlmPromptCopied] = useState(false);

	// ─── Comments State ──────────────────────────
	const [comments, setComments] = useState<Comment[]>([]);
	const [commentName, setCommentName] = useState("");
	const [commentText, setCommentText] = useState("");
	const [showComments, setShowComments] = useState(true);

	const { entities, loadingById, errorById } = useAppState(
		(s) => s.docsReducer,
	);
	const isDocsLoading = useApiLoading(loadingById[docId]);
	const doc = entities[docId];

	// ─── Loading ─────────────────────────────────
	if (isDocsLoading) {
		return <BlogPageSkeleton />;
	}

	// ─── Not Found ───────────────────────────────
	if (errorById[docId] || !doc) {
		return (
			<div className="flex items-center justify-center w-full min-h-[60vh]">
				<motion.div
					initial={{ opacity: 0, y: 30, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="flex flex-col items-center justify-center space-y-6 p-6 sm:p-10 max-w-md text-center"
				>
					<div className="relative">
						<div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 blur-2xl scale-[2]" />
						<div className="relative rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 border border-border/50 p-8 backdrop-blur-sm">
							<FileQuestion className="w-12 h-12 text-muted-foreground" />
						</div>
					</div>
					<div className="space-y-2">
						<h2 className="text-2xl font-bold text-foreground">
							Document not found
						</h2>
						<p className="text-sm text-muted-foreground leading-relaxed">
							This document doesn&apos;t exist or may have been removed.
						</p>
					</div>
					<div className="flex gap-3 pt-2">
						<Link href="/">
							<Button variant="default" size="sm" className="gap-2 rounded-xl">
								<ArrowLeft className="w-3.5 h-3.5" />
								Home
							</Button>
						</Link>
						<Link href="/search">
							<Button variant="outline" size="sm" className="gap-2 rounded-xl">
								<Search className="w-3.5 h-3.5" />
								Search
							</Button>
						</Link>
					</div>
				</motion.div>
			</div>
		);
	}

	const { title, content: md, isOverview } = usePathResolver(doc, id);
	const { description, tags, tree } = doc;
	const toc = extractToc(md);
	const readingTime = estimateReadingTime(md);

	// ─── Prev/Next from Docs Tree ────────────────
	const flatPages = flattenTree(tree || []);
	const currentPageId = id.length === 1 ? tree?.[0]?.id : id[id.length - 1];
	const currentIdx = flatPages.findIndex((p) => p.id === currentPageId);
	const prevPage = currentIdx > 0 ? flatPages[currentIdx - 1] : null;
	const nextPage =
		currentIdx >= 0 && currentIdx < flatPages.length - 1
			? flatPages[currentIdx + 1]
			: null;

	const handleCopyMarkdown = async () => {
		if (!md) return;
		try {
			await navigator.clipboard.writeText(md);
			setCopied(true);
			toast.success("Markdown copied to clipboard!");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Failed to copy to clipboard");
		}
	};

	const handleDialogCopy = async () => {
		if (!md) return;
		try {
			await navigator.clipboard.writeText(md);
			setDialogCopied(true);
			toast.success("Markdown copied to clipboard!");
			setTimeout(() => setDialogCopied(false), 2000);
		} catch {
			toast.error("Failed to copy to clipboard");
		}
	};

	// ─── Ask with LLM ───────────────────────────
	const generatedPrompt = `I'm reading a document titled "${title}". Here is the content:\n\n---\n${md}\n---\n\nMy question: ${llmQuestion}`;

	const handleCopyLlmPrompt = async () => {
		if (!llmQuestion.trim()) {
			toast.error("Please enter a question first");
			return;
		}
		try {
			await navigator.clipboard.writeText(generatedPrompt);
			setLlmPromptCopied(true);
			toast.success("Prompt copied! Paste it into your favorite LLM.");
			setTimeout(() => setLlmPromptCopied(false), 2000);
		} catch {
			toast.error("Failed to copy prompt");
		}
	};

	// ─── Comment Handlers ────────────────────────
	const handleAddComment = () => {
		const trimmedName = commentName.trim() || "Anonymous";
		const trimmedText = commentText.trim();
		if (!trimmedText) {
			toast.error("Please write a comment");
			return;
		}
		const newComment: Comment = {
			id: crypto.randomUUID(),
			name: trimmedName,
			text: trimmedText,
			timestamp: new Date(),
		};
		setComments((prev) => [newComment, ...prev]);
		setCommentText("");
		toast.success("Comment added!");
	};

	return (
		<div className="flex flex-1 flex-col w-full">
			{/* ─── Mobile TOC Toggle ─── */}
			<div className="sticky top-[var(--header-height)] w-full z-20 lg:hidden border-b border-border/30 bg-background/80 backdrop-blur-xl">
				<Accordion
					type="single"
					collapsible
					className="w-full"
					value={accordionValue}
					onValueChange={setAccordionValue}
				>
					<AccordionItem value="item-1">
						<div className="flex items-center gap-2 px-4 justify-between">
							<SidebarTrigger className="-ml-1" />
							<AccordionTrigger>
								<span className="text-sm font-medium text-muted-foreground">
									On This Page
								</span>
							</AccordionTrigger>
						</div>
						<AccordionContent className="overflow-hidden absolute w-full border-b border-border/30 bg-background/95 backdrop-blur-xl">
							<motion.div
								initial={false}
								animate={{
									height: accordionValue === "item-1" ? "auto" : 0,
									opacity: accordionValue === "item-1" ? 1 : 0,
								}}
								transition={{ duration: 0.3, ease: "easeInOut" }}
								className="overflow-y-auto max-h-[60vh] px-4 pb-4"
							>
								{toc.length > 0 ? (
									<ArticleTableContent toc={toc} />
								) : (
									<p className="text-xs text-muted-foreground italic mt-2 mx-auto">
										No headings available
									</p>
								)}
							</motion.div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>

			{/* ─── Main Layout ─── */}
			<div className="flex justify-center relative w-full gap-6 lg:gap-10">
				<ArticleSidebar
					className="border-none !sticky !top-18 max-h-[calc(100vh-7rem)] gap-4"
					navData={tree}
					activeId={id.length === 1 ? tree?.[0]?.id : id[id.length - 1]}
				/>

				{/* ─── Article ─── */}
				<article className="flex-1 min-w-0 w-full max-w-3xl px-4 sm:px-6 lg:px-2">
					<motion.div
						className="flex w-full min-w-0 flex-1 flex-col py-6 lg:py-10 text-neutral-800 dark:text-neutral-300"
						initial="hidden"
						animate="visible"
						variants={stagger}
					>
						{/* ── Hero Cover ── */}
						{isOverview && (
							<motion.figure className="w-full mb-8 lg:mb-10" variants={fadeUp}>
								<div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
									<NextImage
										width={1200}
										height={400}
										src={doc.coverUrl}
										alt={title || "Document cover"}
										className="max-h-[280px] sm:max-h-[380px] md:max-h-[420px] w-full object-cover"
										loading="eager"
										decoding="async"
									/>
								</div>
							</motion.figure>
						)}

						{/* ── Title ── */}
						<motion.h1
							className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-foreground leading-[1.15] mb-3"
							variants={fadeUp}
						>
							{title || "Untitled Document"}
						</motion.h1>

						{/* ── ProfileTag ── */}
						<motion.div variants={fadeUp}>
							<ProfileTag
								idBlog={docId}
								profileId={doc.authorId}
								createdAt={doc.createdAt}
								variant="view"
								contentType="docs"
							/>
						</motion.div>

						{/* ── Tags · Reading Time · Date ── */}
						<motion.div
							className="flex flex-wrap items-center gap-x-2.5 gap-y-2 mb-6"
							variants={fadeUp}
						>
							{tags && tags.length > 0 &&
								tags.map((tag, index) => (
									<span
										key={index}
										className="inline-flex items-center gap-1 capitalize px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/15 hover:border-primary/30 hover:shadow-sm hover:shadow-primary/5 transition-all duration-200 cursor-default"
									>
										<Hash className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-60" />
										{tag}
									</span>
								))}

							{tags && tags.length > 0 && (
								<span className="w-1 h-1 rounded-full bg-muted-foreground/30 hidden sm:block" />
							)}

							<span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground/80">
								<Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
								{readingTime} min read
							</span>

							<span className="w-1 h-1 rounded-full bg-muted-foreground/30" />

							<span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground/80">
								<CalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
								{formatDate(doc.createdAt)}
							</span>
						</motion.div>

						{/* ── Top Action Bar ── */}
						<motion.div
							className="flex flex-wrap items-center gap-0.5 mb-8 p-1 rounded-2xl border border-border/30 bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40 backdrop-blur-sm w-fit shadow-sm"
							variants={fadeUp}
						>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 gap-1.5 rounded-xl text-xs font-medium hover:bg-foreground/5 transition-all duration-300 px-3"
										onClick={() =>
											window.open(
												"https://github.com",
												"_blank",
												"noopener,noreferrer",
											)
										}
									>
										<Github className="w-3.5 h-3.5" />
										<span className="hidden sm:inline">GitHub</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="bottom" className="rounded-xl">View on GitHub</TooltipContent>
							</Tooltip>

							<div className="w-px h-4 bg-border/30 mx-0.5" />

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 gap-1.5 rounded-xl text-xs font-medium hover:bg-foreground/5 transition-all duration-300 px-3"
										onClick={handleCopyMarkdown}
									>
										<AnimatePresence mode="wait" initial={false}>
											{copied ? (
												<motion.span
													key="check"
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													exit={{ scale: 0 }}
													className="flex items-center gap-1.5"
												>
													<Check className="w-3.5 h-3.5 text-emerald-500" />
													<span className="hidden sm:inline text-emerald-500">Copied!</span>
												</motion.span>
											) : (
												<motion.span
													key="copy"
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													exit={{ scale: 0 }}
													className="flex items-center gap-1.5"
												>
													<Copy className="w-3.5 h-3.5" />
													<span className="hidden sm:inline">Copy</span>
												</motion.span>
											)}
										</AnimatePresence>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="bottom" className="rounded-xl">Copy Markdown</TooltipContent>
							</Tooltip>

							<div className="w-px h-4 bg-border/30 mx-0.5" />

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 gap-1.5 rounded-xl text-xs font-medium hover:bg-foreground/5 transition-all duration-300 px-3"
										onClick={() => setViewMarkdownOpen(true)}
									>
										<FileText className="w-3.5 h-3.5" />
										<span className="hidden sm:inline">Markdown</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="bottom" className="rounded-xl">View Markdown Source</TooltipContent>
							</Tooltip>

							<div className="w-px h-4 bg-border/30 mx-0.5" />

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 gap-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-violet-500/0 to-violet-500/0 hover:from-violet-500/10 hover:to-purple-500/10 text-violet-600 dark:text-violet-400 transition-all duration-300 px-3"
										onClick={() => setAskLlmOpen(true)}
									>
										<Sparkles className="w-3.5 h-3.5" />
										<span className="hidden sm:inline">Ask AI</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="bottom" className="rounded-xl">Ask with LLM</TooltipContent>
							</Tooltip>
						</motion.div>

						{/* ── Description ── */}
						{isOverview && description && (
							<motion.div
								className="relative mb-8 rounded-2xl overflow-hidden"
								variants={fadeUp}
							>
								<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-violet-500 to-primary/50 rounded-full" />
								<div className="bg-gradient-to-r from-muted/60 to-muted/20 border border-border/30 rounded-2xl p-5 sm:p-6 pl-5 sm:pl-7">
									<svg
										className="absolute top-4 right-4 w-7 h-7 text-primary/8"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
									</svg>
									<p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed italic relative z-10">
										{description}
									</p>
								</div>
							</motion.div>
						)}

						{/* ── Article Content ── */}
						<motion.div variants={fadeUp} className="min-w-0">
							<ArticleRender content={md} />
						</motion.div>

						{/* ── Next / Previous Navigation ── */}
						<motion.div
							className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 mt-12 pt-8 border-t border-border/30"
							variants={fadeUp}
						>
							{prevPage ? (
								<Link
									href={`/docs/${docId}/${prevPage.id}`}
									className="group relative flex-1 flex items-center gap-3 p-4 sm:p-5 rounded-2xl border border-border/30 bg-gradient-to-br from-muted/30 to-transparent hover:from-muted/50 hover:to-muted/20 hover:border-border/50 hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20 transition-all duration-300"
								>
									<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-muted/80 to-muted/40 flex items-center justify-center shrink-0 group-hover:from-primary/15 group-hover:to-primary/5 transition-all duration-300 shadow-sm">
										<ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
									</div>
									<div className="min-w-0">
										<span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
											Previous
										</span>
										<p className="text-sm font-semibold text-foreground truncate mt-0.5 group-hover:text-primary transition-colors duration-300">
											{prevPage.title}
										</p>
									</div>
								</Link>
							) : (
								<div className="flex-1 hidden sm:block" />
							)}
							{nextPage ? (
								<Link
									href={`/docs/${docId}/${nextPage.id}`}
									className="group relative flex-1 flex items-center justify-end gap-3 p-4 sm:p-5 rounded-2xl border border-border/30 bg-gradient-to-bl from-muted/30 to-transparent hover:from-muted/50 hover:to-muted/20 hover:border-border/50 hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20 transition-all duration-300 text-right"
								>
									<div className="min-w-0">
										<span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
											Next
										</span>
										<p className="text-sm font-semibold text-foreground truncate mt-0.5 group-hover:text-primary transition-colors duration-300">
											{nextPage.title}
										</p>
									</div>
									<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-muted/80 to-muted/40 flex items-center justify-center shrink-0 group-hover:from-primary/15 group-hover:to-primary/5 transition-all duration-300 shadow-sm">
										<ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
									</div>
								</Link>
							) : (
								<div className="flex-1 hidden sm:block" />
							)}
						</motion.div>

						{/* ── Comments Section ── */}
						<motion.div className="mt-14" variants={fadeUp}>
							{/* Section Divider */}
							<div className="flex items-center gap-4 mb-8">
								<div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
								<button
									onClick={() => setShowComments(!showComments)}
									className="flex items-center gap-2.5 group cursor-pointer px-4 py-2 rounded-full border border-border/30 bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/30 transition-all duration-300 shadow-sm"
								>
									<MessageCircle className="w-4 h-4 text-primary" />
									<span className="text-sm font-semibold text-foreground">
										Discussion
									</span>
									<span className="text-[10px] text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
										{comments.length}
									</span>
									<ChevronRight
										className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 ${showComments ? "rotate-90" : ""}`}
									/>
								</button>
								<div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
							</div>

							<AnimatePresence>
								{showComments && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.4, ease: "easeInOut" }}
										className="overflow-hidden"
									>
										{/* Comment Input */}
										<div className="relative rounded-2xl border border-border/30 bg-gradient-to-br from-muted/30 via-background to-muted/10 p-4 sm:p-5 mb-6 shadow-sm">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 border border-primary/10 flex items-center justify-center shrink-0 shadow-sm shadow-primary/5">
													<User className="w-4 h-4 text-primary" />
												</div>
												<input
													type="text"
													placeholder="Your name (optional)"
													value={commentName}
													onChange={(e) =>
														setCommentName(e.target.value)
													}
													className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none font-medium"
												/>
											</div>
											<textarea
												placeholder="Share your thoughts..."
												value={commentText}
												onChange={(e) =>
													setCommentText(e.target.value)
												}
												rows={3}
												className="w-full bg-background/60 rounded-xl border border-border/30 p-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all duration-300 resize-none backdrop-blur-sm"
											/>
											<div className="flex items-center justify-between mt-3">
												<span className="text-[10px] text-muted-foreground/50">
													{commentText.length > 0 && `${commentText.length} characters`}
												</span>
												<Button
													size="sm"
													className="gap-1.5 rounded-xl text-xs h-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 transition-all duration-300"
													onClick={handleAddComment}
													disabled={!commentText.trim()}
												>
													<Send className="w-3.5 h-3.5" />
													Post Comment
												</Button>
											</div>
										</div>

										{/* Comments List */}
										{comments.length === 0 ? (
											<motion.div
												initial={{ opacity: 0, scale: 0.95 }}
												animate={{ opacity: 1, scale: 1 }}
												className="text-center py-12"
											>
												<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted/60 to-muted/20 border border-border/30 flex items-center justify-center mx-auto mb-4 shadow-sm">
													<MessageCircle className="w-7 h-7 text-muted-foreground/30" />
												</div>
												<p className="text-sm text-muted-foreground/60 font-medium">
													No comments yet
												</p>
												<p className="text-xs text-muted-foreground/40 mt-1">
													Be the first to share your thoughts!
												</p>
											</motion.div>
										) : (
											<div className="space-y-3">
												<AnimatePresence>
													{comments.map((comment) => (
														<motion.div
															key={comment.id}
															initial={{ opacity: 0, y: 12, scale: 0.98 }}
															animate={{ opacity: 1, y: 0, scale: 1 }}
															exit={{ opacity: 0, y: -12, scale: 0.98 }}
															transition={{ duration: 0.3, ease: "easeOut" }}
															className="group flex gap-3 p-4 rounded-2xl border border-border/20 bg-gradient-to-br from-muted/20 to-transparent hover:from-muted/30 hover:to-muted/10 hover:border-border/40 hover:shadow-sm transition-all duration-300"
														>
															<div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarGradient(comment.name)} flex items-center justify-center shrink-0 shadow-sm`}>
																<span className="text-xs font-bold text-white uppercase drop-shadow-sm">
																	{comment.name.charAt(0)}
																</span>
															</div>
															<div className="flex-1 min-w-0">
																<div className="flex items-center gap-2 mb-1">
																	<span className="text-sm font-semibold text-foreground">
																		{comment.name}
																	</span>
																	<span className="text-[10px] text-muted-foreground/50 font-medium">
																		{formatCommentDate(comment.timestamp)}
																	</span>
																</div>
																<p className="text-[13px] text-foreground/75 leading-relaxed break-words">
																	{comment.text}
																</p>
															</div>
														</motion.div>
													))}
												</AnimatePresence>
											</div>
										)}
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					</motion.div>
				</article>

				{/* ─── Right Sidebar: TOC ─── */}
				<aside className="hidden lg:block shrink-0 w-56 xl:w-64 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pb-8 custom-scroll">
					<div className="px-4 py-0">
						<div className="flex items-center gap-2 sticky top-0 bg-background pt-2 pb-3 z-10">
							<div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
								<svg
									className="w-3 h-3 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2.5}
										d="M4 6h16M4 12h16M4 18h7"
									/>
								</svg>
							</div>
							<h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
								On This Page
							</h2>
						</div>
						{toc.length > 0 ? (
							<ArticleTableContent toc={toc} />
						) : (
							<p className="text-xs text-muted-foreground/50 italic mt-2 pr-2">
								No headings available
							</p>
						)}
					</div>
					<div className="from-background via-background/80 to-background/50 sticky -bottom-10 z-10 h-15 shrink-0 bg-gradient-to-t" />
				</aside>
			</div>

			{/* ─── Floating Action Bar ─── */}
			<motion.div
				initial={{ opacity: 0, y: 20, scale: 0.9 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ delay: 0.8, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
				className="fixed bottom-5 sm:bottom-6 right-5 sm:right-6 z-50 flex items-center gap-0.5 rounded-2xl border border-border/30 bg-background/60 backdrop-blur-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 px-1.5 py-1.5 ring-1 ring-white/5"
			>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 rounded-xl hover:bg-foreground/5 transition-all duration-300"
							onClick={handleCopyMarkdown}
						>
							<AnimatePresence mode="wait" initial={false}>
								{copied ? (
									<motion.span
										key="check"
										initial={{ scale: 0, rotate: -90 }}
										animate={{ scale: 1, rotate: 0 }}
										exit={{ scale: 0, rotate: 90 }}
										transition={{ duration: 0.2, ease: "easeOut" }}
									>
										<Check className="w-4 h-4 text-emerald-500" />
									</motion.span>
								) : (
									<motion.span
										key="copy"
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										exit={{ scale: 0 }}
										transition={{ duration: 0.15 }}
									>
										<Copy className="w-4 h-4" />
									</motion.span>
								)}
							</AnimatePresence>
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top" className="rounded-xl">Copy as Markdown</TooltipContent>
				</Tooltip>

				<div className="w-px h-5 bg-border/20 mx-0.5" />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 rounded-xl hover:bg-foreground/5 transition-all duration-300"
							onClick={() => setViewMarkdownOpen(true)}
						>
							<FileText className="w-4 h-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top" className="rounded-xl">View as Markdown</TooltipContent>
				</Tooltip>

				<div className="w-px h-5 bg-border/20 mx-0.5" />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 rounded-xl hover:bg-violet-500/10 transition-all duration-300"
							onClick={() => setAskLlmOpen(true)}
						>
							<Sparkles className="w-4 h-4 text-violet-500" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top" className="rounded-xl">Ask with AI</TooltipContent>
				</Tooltip>
			</motion.div>

			{/* ─── View Markdown Dialog ─── */}
			<Dialog open={viewMarkdownOpen} onOpenChange={setViewMarkdownOpen}>
				<DialogContent className="max-w-4xl w-[95vw] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl">
					<DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-border/30 flex-shrink-0 bg-gradient-to-r from-muted/30 to-transparent">
						<div className="flex items-center justify-between gap-4">
							<div className="min-w-0">
								<DialogTitle className="text-base font-bold flex items-center gap-2">
									<div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
										<FileText className="w-3.5 h-3.5 text-primary" />
									</div>
									<span className="truncate">Markdown Source</span>
								</DialogTitle>
								<DialogDescription className="text-xs text-muted-foreground/70 mt-1 truncate">
									{title}
								</DialogDescription>
							</div>
							<Button
								variant="outline"
								size="sm"
								className="gap-1.5 text-xs flex-shrink-0 rounded-xl h-8 border-border/30"
								onClick={handleDialogCopy}
							>
								<AnimatePresence mode="wait" initial={false}>
									{dialogCopied ? (
										<motion.span
											key="copied"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="flex items-center gap-1.5"
										>
											<Check className="w-3.5 h-3.5 text-emerald-500" />
											Copied!
										</motion.span>
									) : (
										<motion.span
											key="copy"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="flex items-center gap-1.5"
										>
											<Copy className="w-3.5 h-3.5" />
											Copy
										</motion.span>
									)}
								</AnimatePresence>
							</Button>
						</div>
					</DialogHeader>
					<div className="flex-1 overflow-auto custom-scroll bg-muted/20">
						<pre className="p-6 text-[13px] leading-relaxed font-mono text-foreground/80 whitespace-pre-wrap break-words selection:bg-primary/20">
							{md}
						</pre>
					</div>
				</DialogContent>
			</Dialog>

			{/* ─── Ask with LLM Dialog ─── */}
			<Dialog open={askLlmOpen} onOpenChange={setAskLlmOpen}>
				<DialogContent className="max-w-2xl w-[95vw] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl">
					<DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-border/30 flex-shrink-0 bg-gradient-to-r from-violet-500/5 to-transparent">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/15 flex items-center justify-center shadow-sm shadow-violet-500/10">
								<Sparkles className="w-4.5 h-4.5 text-violet-500" />
							</div>
							<div className="min-w-0">
								<DialogTitle className="text-base font-bold">
									Ask AI about this document
								</DialogTitle>
								<DialogDescription className="text-xs text-muted-foreground/60 mt-0.5">
									Generate a prompt to paste into ChatGPT, Claude, etc.
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>
					<div className="p-5 sm:p-6 space-y-4">
						<div>
							<label className="text-xs font-semibold text-muted-foreground/70 mb-2 block uppercase tracking-wider">
								Your Question
							</label>
							<textarea
								placeholder="e.g., Summarize the key points, Explain this concept in simpler terms..."
								value={llmQuestion}
								onChange={(e) => setLlmQuestion(e.target.value)}
								rows={3}
								className="w-full bg-muted/20 rounded-xl border border-border/30 p-4 text-sm text-foreground placeholder:text-muted-foreground/35 outline-none focus:border-violet-500/30 focus:ring-2 focus:ring-violet-500/10 transition-all duration-300 resize-none"
							/>
						</div>
						{llmQuestion.trim() && (
							<motion.div
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								className="rounded-xl border border-violet-500/10 bg-gradient-to-br from-violet-500/5 to-purple-500/5 p-4"
							>
								<div className="flex items-center justify-between mb-2">
									<span className="text-[10px] font-semibold text-violet-500/70 uppercase tracking-wider">
										Prompt Preview
									</span>
									<span className="text-[10px] text-muted-foreground/40 font-mono">
										{generatedPrompt.length} chars
									</span>
								</div>
								<pre className="text-xs text-foreground/60 whitespace-pre-wrap break-words max-h-32 overflow-y-auto custom-scroll leading-relaxed">
									{generatedPrompt.substring(0, 500)}
									{generatedPrompt.length > 500 && "..."}
								</pre>
							</motion.div>
						)}
						<div className="flex items-center justify-end gap-2 pt-2">
							<Button
								variant="outline"
								size="sm"
								className="rounded-xl text-xs border-border/30"
								onClick={() => {
									setAskLlmOpen(false);
									setLlmQuestion("");
								}}
							>
								Cancel
							</Button>
							<Button
								size="sm"
								className="gap-1.5 rounded-xl text-xs bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-sm shadow-violet-500/20 hover:shadow-md hover:shadow-violet-500/25 transition-all duration-300"
								onClick={handleCopyLlmPrompt}
								disabled={!llmQuestion.trim()}
							>
								<AnimatePresence mode="wait" initial={false}>
									{llmPromptCopied ? (
										<motion.span
											key="copied"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="flex items-center gap-1.5"
										>
											<Check className="w-3.5 h-3.5" />
											Copied!
										</motion.span>
									) : (
										<motion.span
											key="copy"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="flex items-center gap-1.5"
										>
											<Copy className="w-3.5 h-3.5" />
											Copy Prompt
										</motion.span>
									)}
								</AnimatePresence>
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
