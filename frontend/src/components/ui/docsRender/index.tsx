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
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

// ─── Animations ──────────────────────────────────────

const stagger = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.08, delayChildren: 0.1 },
	},
};

const fadeUp = {
	hidden: { opacity: 0, y: 16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
	},
};

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

	const { entities, loadingById, errorById } = useAppState(
		(s) => s.docsReducer,
	);
	const isDocsLoading = useApiLoading(loadingById[docId]);
	const doc = entities[docId];
	const hasDocError = Boolean(errorById[docId]);
	const shouldShowSkeleton = isDocsLoading || (!doc && !hasDocError);

	// ─── Loading ─────────────────────────────────────
	if (shouldShowSkeleton) {
		return <BlogPageSkeleton />;
	}

	// ─── Not Found ───────────────────────────────────
	if (hasDocError || !doc) {
		return (
			<div className="flex items-center justify-center w-full ">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className="flex flex-col items-center justify-center space-y-6 p-10 max-w-md text-center"
				>
					<div className="relative">
						<div className="absolute inset-0 rounded-full bg-primary/10 blur-xl scale-150" />
						<div className="relative rounded-full bg-muted/80 border border-border/50 p-8">
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
							<Button variant="default" size="sm" className="gap-2">
								<ArrowLeft className="w-3.5 h-3.5" />
								Home
							</Button>
						</Link>
						<Link href="/search">
							<Button variant="outline" size="sm" className="gap-2">
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

	return (
		<div className="flex flex-1 flex-col w-full">
			{/* ─── Mobile TOC Toggle ─── */}
			<div className="sticky top-[var(--header-height)] w-full z-20 lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
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

						<AccordionContent className="overflow-hidden absolute w-full border-b border-border bg-background">
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
			<div className="flex justify-center relative w-full gap-10">
				<ArticleSidebar
					className="border-none !sticky !top-18 max-h-[calc(100vh-7rem)] gap-4"
					navData={tree}
					activeId={id.length === 1 ? tree?.[0]?.id : id[id.length - 1]}
				/>

				{/* ─── Article ─── */}
				<article className="flex-1 min-w-0 w-full max-w-3xl p-2">
					<motion.div
						className="flex w-full min-w-0 flex-1 flex-col py-6 lg:py-8 text-neutral-800 dark:text-neutral-300"
						initial="hidden"
						animate="visible"
						variants={stagger}
					>
						{/* ── Hero Cover ── */}
						{isOverview && (
							<motion.figure className="w-full mb-8 lg:mb-10" variants={fadeUp}>
								<div className="relative overflow-hidden bg-muted rounded-2xl shadow-sm">
									<NextImage
										width={1200}
										height={400}
										src={doc.coverUrl}
										alt={title || "Document cover"}
										className="max-h-[400px] max-w-[1200px] h-full w-full object-cover"
										loading="eager"
										decoding="async"
									/>
								</div>
							</motion.figure>
						)}

						{/* ── Title ── */}
						<motion.h1
							className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-foreground leading-[1.15] mb-2"
							variants={fadeUp}
						>
							{title || "Untitled Document"}
						</motion.h1>

						{/* ── ProfileTag ── */}
						<ProfileTag
							idBlog={docId}
							profileId={doc.author?.handle}
							authorName={doc.author?.name}
							authorAvatarUrl={doc.author?.avatarUrl}
							createdAt={doc.createdAt}
							variant="view"
							contentType="docs"
						/>

						{/* ── Tags · Reading Time · Date ── */}
						<motion.div
							className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5"
							variants={fadeUp}
						>
							{tags && tags.length > 0 &&
								tags.map((tag, index) => (
									<span
										key={index}
										className="inline-flex items-center gap-1 capitalize px-2.5 py-1 rounded-md text-xs font-medium bg-primary/8 text-primary border border-primary/15 hover:bg-primary/15 transition-colors"
									>
										<Hash className="w-3 h-3 opacity-60" />
										{tag}
									</span>
								))}

							{tags && tags.length > 0 && (
								<span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
							)}

							<span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
								<Clock className="w-3.5 h-3.5" />
								{readingTime} min read
							</span>

							<span className="w-1 h-1 rounded-full bg-muted-foreground/40" />

							<span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
								<CalendarDays className="w-3.5 h-3.5" />
								{formatDate(doc.createdAt)}
							</span>
						</motion.div>

						{/* ── Description ── */}
						{isOverview && description && (
							<motion.div
								className="relative mb-8 rounded-xl bg-muted/40 border border-border/40 p-5 sm:p-6"
								variants={fadeUp}
							>
								<svg
									className="absolute top-4 right-4 w-8 h-8 text-primary/10"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
								</svg>
								<p className="text-sm sm:text-base text-muted-foreground leading-relaxed italic relative z-10">
									{description}
								</p>
							</motion.div>
						)}

						{/* ── Article Content ── */}
						<motion.div variants={fadeUp}>
							<ArticleRender content={md} />
						</motion.div>
					</motion.div>
				</article>

				{/* ─── Right Sidebar: TOC ─── */}
				<aside className="hidden lg:block shrink-0 w-56 xl:w-64 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pb-8 custom-scroll">
					<div className="px-4 py-0">
						<div className="flex items-center gap-2 sticky top-0 bg-background pt-2 pb-2 z-10">
							<svg
								className="w-4 h-4 text-primary flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h7"
								/>
							</svg>
							<h2 className="text-sm font-bold text-foreground">
								On This Page
							</h2>
						</div>
						{toc.length > 0 ? (
							<ArticleTableContent toc={toc} />
						) : (
							<p className="text-xs text-muted-foreground italic mt-2 pr-2">
								No headings available
							</p>
						)}
					</div>
					<div className="from-background via-background/80 to-background/50 sticky -bottom-10 z-10 h-15 shrink-0 bg-gradient-to-t" />
				</aside>
			</div>

			{/* ─── Floating Action Bar ─── */}
			<motion.div
				initial={{ opacity: 0, y: 20, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ delay: 0.8, duration: 0.35, ease: "easeOut" }}
				className="fixed bottom-6 right-6 z-50 flex items-center gap-1 rounded-2xl border border-border/50 bg-background/70 backdrop-blur-2xl shadow-xl shadow-black/5 dark:shadow-black/20 px-1.5 py-1.5"
			>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 rounded-xl hover:bg-primary/10 transition-all duration-200"
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
					<TooltipContent side="top">Copy as Markdown</TooltipContent>
				</Tooltip>

				<div className="w-px h-5 bg-border/40 mx-0.5" />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 rounded-xl hover:bg-primary/10 transition-all duration-200"
							onClick={() => setViewMarkdownOpen(true)}
						>
							<FileText className="w-4 h-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top">View as Markdown</TooltipContent>
				</Tooltip>
			</motion.div>

			{/* ─── View Markdown Dialog ─── */}
			<Dialog open={viewMarkdownOpen} onOpenChange={setViewMarkdownOpen}>
				<DialogContent className="max-w-4xl w-[95vw] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
					<DialogHeader className="px-6 pt-5 pb-4 border-b border-border/60 flex-shrink-0">
						<div className="flex items-center justify-between gap-4">
							<div className="min-w-0">
								<DialogTitle className="text-base font-bold flex items-center gap-2">
									<FileText className="w-4 h-4 text-primary flex-shrink-0" />
									<span className="truncate">Markdown Source</span>
								</DialogTitle>
								<DialogDescription className="text-xs text-muted-foreground mt-1 truncate">
									{title}
								</DialogDescription>
							</div>
							<Button
								variant="outline"
								size="sm"
								className="gap-1.5 text-xs flex-shrink-0 rounded-lg"
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
					<div className="flex-1 overflow-auto custom-scroll bg-muted/30">
						<pre className="p-6 text-[13px] leading-relaxed font-mono text-foreground/85 whitespace-pre-wrap break-words selection:bg-primary/20">
							{md}
						</pre>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
