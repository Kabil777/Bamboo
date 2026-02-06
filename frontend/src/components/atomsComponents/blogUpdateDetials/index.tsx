"use client";
import {
	AlertCircle,
	Archive,
	CheckCircle,
	Eye,
	EyeOff,
	FileText,
	Loader2,
	Plus,
	X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/shadcnUI/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/shadcnUI/dialog";
import { Input } from "@/components/shadcnUI/input";
import { Label } from "@/components/shadcnUI/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/shadcnUI/select";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import {
	CreateNewBlog,
	CreateNewDocs,
} from "@/store/reducers/CreateCoverDetialsBlogDocs";
import { SharePopover } from "../sharePopover";

interface CreateContentProps {
	title: string;
	coverUrl: string;
	description: string;
	tags: string[];
	visibility?: "public" | "private";
	status?: "draft" | "publish" | "archived";
}

interface BlogUpdateDetailsProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export const BlogUpdateDetails = ({
	open,
	setOpen,
}: BlogUpdateDetailsProps) => {
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");

	const [showTagSuggestions, setShowTagSuggestions] = useState(false);

	const predefinedTags = [
		"Developer",
		"Designer",
		"Writer",
		"Photographer",
		"Creator",
		"Artist",
		"Engineer",
		"Entrepreneur",
		"Student",
		"Teacher",
		"Manager",
		"Freelancer",
	];

	const filteredTags = tagInput.trim()
		? predefinedTags.filter(
				(tag) =>
					tag.toLowerCase().includes(tagInput.toLowerCase()) &&
					!tags.includes(tag),
			)
		: predefinedTags.filter((tag) => !tags.includes(tag));

	const addTag = (tag: string) => {
		const trimmedTag = tag.trim();
		if (trimmedTag && !tags.includes(trimmedTag)) {
			setTags([...tags, trimmedTag]);
			setTagInput("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addTag(tagInput);
			setShowTagSuggestions(false);
		} else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
			removeTag(tags[tags.length - 1]);
		} else if (e.key === "Escape") {
			setShowTagSuggestions(false);
		} else if (
			e.key === "ArrowDown" &&
			showTagSuggestions &&
			filteredTags.length > 0
		) {
			e.preventDefault();
		}
	};

	const router = useRouter();
	const dispatch = useAppDispatch();

	const [type, setType] = useState<"blog" | "docs">("blog");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [visibility, setVisibility] = useState<"public" | "private">("public");
	const [status, setStatus] = useState<"draft" | "publish" | "archived">(
		"draft",
	);
	const coverUrl =
		"https://images.prismic.io/techloset/Z1_3cpbqstJ98iN__a-complete-guide-to-next-js-a-react-js-framework.webp";
	const [loading, setLoading] = useState<boolean>(false);
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});

	// Reset form when dialog closes
	useEffect(() => {
		if (!open) {
			const timer = setTimeout(() => {
				setTitle("");
				setDescription("");
				setTags([]);
				setTagInput("");
				setVisibility("public");
				setStatus("draft");
				setFormErrors({});
				setLoading(false);
			}, 150);
			return () => clearTimeout(timer);
		}
	}, [open]);

	// Reset visibility to public when status changes from publish
	useEffect(() => {
		if (status !== "publish") {
			setVisibility("public");
		}
	}, [status]);

	const validateForm = () => {
		const errors: Record<string, string> = {};

		if (!type) errors.type = "Please select a content type.";
		if (!title.trim()) errors.title = "Title is required.";
		if (!(title.length >= 5))
			errors.title = "Title must be at least 5 characters long.";
		if (!(title.length <= 100))
			errors.title = "Title must be less than 100 characters long.";
		if (!description.trim()) errors.description = "Description is required.";
		if (!(description.length >= 10))
			errors.description = "Description must be at least 10 characters long.";
		if (!(description.length <= 300))
			errors.description = "Description must be less than 300 characters long.";
		if (tags.length === 0) {
			errors.tags = "At least one tag is required.";
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleClose = () => {
		if (!loading) {
			setOpen(false);
		}
	};

	const onSummit = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): Promise<void> => {
		e.preventDefault();

		if (!validateForm()) return;

		setLoading(true);
		const cover: CreateContentProps = {
			title: title.trim(),
			coverUrl: coverUrl,
			description: description.trim(),
			tags: tags,
			visibility: status === "publish" ? visibility : undefined,
			status: status,
		};
		console.log("Creating content with details:", cover);
		try {
			let created;
			if (type === "blog") {
				created = await dispatch(
					CreateNewBlog(cover as CreateContentProps),
				).unwrap();
				if (created?.id) {
					handleClose();
					setTimeout(() => {
						router.push(`/editor/blog/${created.id}`);
					}, 100);
				} else {
					toast.error("Failed to create blog. Please try again.");
					setLoading(false);
				}
			} else if (type === "docs") {
				created = await dispatch(
					CreateNewDocs(cover as CreateContentProps),
				).unwrap();
				if (created?.id) {
					handleClose();
					setTimeout(() => {
						router.push(`/editor/docs/${created.id}`);
					}, 100);
				} else {
					toast.error("Failed to create docs. Please try again.");
					setLoading(false);
				}
			}
		} catch (error) {
			toast.error("Failed to create content. Please try again.");
			setLoading(false);
		}
	};

	if (!open) return null;

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] ">
				<DialogHeader>
					<DialogTitle>Update Blog</DialogTitle>
					<DialogDescription>
						Fill in the details to update your blog post.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 custom-scroll -mx-4 max-h-[70vh] overflow-y-auto px-4">
					<div className="grid gap-2">
						<Label htmlFor="title">
							Title<span className="text-red-500">*</span>
						</Label>
						<Input
							onChange={(e) => setTitle(e.target.value)}
							id="title"
							name="title"
							value={title}
							disabled={loading}
						/>
						{formErrors.title && (
							<p className="text-sm text-red-500">{formErrors.title}</p>
						)}
					</div>

					<div className="grid gap-2">
						<Label htmlFor="description">
							Description<span className="text-red-500">*</span>
						</Label>
						<Input
							onChange={(e) => setDescription(e.target.value)}
							id="description"
							name="description"
							value={description}
							disabled={loading}
						/>
						{formErrors.description && (
							<p className="text-sm text-red-500">{formErrors.description}</p>
						)}
					</div>

					<div className="grid gap-2">
						<Label htmlFor="thumbnail">
							Thumbnail<span className="text-red-500">*</span>
						</Label>
						<div
							className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 relative"
							onDragOver={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
							onDrop={async (e) => {
								e.preventDefault();
								e.stopPropagation();
								const file = e.dataTransfer.files?.[0];
								if (!file) return;
								const formData = new FormData();
								formData.append("file", file);
								const res = await fetch("/api/upload", {
									method: "POST",
									body: formData,
								});
								const data = await res.json();
								if (data.url) return;
							}}
							onClick={() =>
								document.getElementById("thumbnail-input")?.click()
							}
						>
							<input
								id="thumbnail-input"
								type="file"
								accept="image/*"
								className="hidden"
								disabled={loading}
								onChange={async (e) => {
									const file = e.target.files?.[0];
									if (!file) return;
									const formData = new FormData();
									formData.append("file", file);
									const res = await fetch("/api/upload", {
										method: "POST",
										body: formData,
									});
									const data = await res.json();
									if (data.url) return;
								}}
							/>
							{coverUrl ? (
								<Image
									width={128}
									height={128}
									src={coverUrl}
									alt="cover preview"
									className="object-cover w-full h-full rounded mb-2 border"
								/>
							) : (
								<span className="text-gray-400">
									Drag & drop or click to upload
								</span>
							)}
						</div>
					</div>

					<div className="grid flex-1 gap-3">
						<Label htmlFor="tags" className="text-sm font-medium">
							Tags <span className="text-red-500">*</span>
						</Label>
						<div className="relative">
							<div className="flex items-center gap-2 min-h-[44px] p-2 border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
								<div className="flex flex-wrap gap-1.5 flex-1">
									{tags.map((tag, index) => (
										<span
											key={index}
											className="inline-flex items-center gap-1 px-2.5 py-1 bg-foreground text-background rounded-md text-sm font-medium"
										>
											{tag}
											<button
												type="button"
												onClick={() => removeTag(tag)}
												className="hover:bg-primary/20 rounded-sm transition-colors"
												disabled={loading}
											>
												<X className="h-3 w-3" />
											</button>
										</span>
									))}
									<input
										type="text"
										id="tags"
										value={tagInput}
										onChange={(e) => {
											setTagInput(e.target.value);
											setShowTagSuggestions(true);
										}}
										onFocus={() => setShowTagSuggestions(true)}
										onBlur={() =>
											setTimeout(() => setShowTagSuggestions(false), 200)
										}
										onKeyDown={handleTagInputKeyDown}
										placeholder={
											tags.length === 0 ? "Type to search or add tags..." : ""
										}
										className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
										disabled={loading}
									/>
								</div>
							</div>

							{/* Autocomplete Dropdown */}
							{showTagSuggestions && filteredTags.length > 0 && (
								<div className="absolute z-[999] w-full mt-3 bg-background border rounded-lg shadow-lg max-h-[200px] overflow-y-auto custom-scroll">
									{filteredTags.map((tag) => (
										<button
											key={tag}
											type="button"
											onMouseDown={(e) => {
												e.preventDefault();
												addTag(tag);
												setShowTagSuggestions(false);
											}}
											className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
										>
											<Plus className="h-3 w-3 text-muted-foreground" />
											{tag}
										</button>
									))}
								</div>
							)}
						</div>
						{formErrors.tags && (
							<p className="text-sm text-red-500">{formErrors.tags}</p>
						)}
						<span className="text-xs text-muted-foreground">
							Press Enter or comma to add. Start typing for suggestions.
						</span>
					</div>
				</div>
				<DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
					{/* Left side - Status and Visibility */}
					<div className="flex items-center gap-2 order-1">
						<Select
							value={status}
							onValueChange={(value: "draft" | "publish" | "archived") =>
								setStatus(value)
							}
							disabled={loading}
						>
							<SelectTrigger id="status" className="w-[130px]">
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="draft">
									<div className="flex items-center">
										<FileText className="mr-2 h-4 w-4 text-yellow-600" />
										<span>Draft</span>
									</div>
								</SelectItem>
								<SelectItem value="publish">
									<div className="flex items-center">
										<CheckCircle className="mr-2 h-4 w-4 text-green-600" />
										<span>Publish</span>
									</div>
								</SelectItem>
								<SelectItem value="archived">
									<div className="flex items-center">
										<Archive className="mr-2 h-4 w-4 text-gray-600" />
										<span>Archived</span>
									</div>
								</SelectItem>
							</SelectContent>
						</Select>

						{status === "publish" && (
							<Select
								value={visibility}
								onValueChange={(value: "public" | "private") =>
									setVisibility(value)
								}
								disabled={loading}
							>
								<SelectTrigger id="visibility" className="w-[120px]">
									<SelectValue placeholder="Visibility" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="public">
										<div className="flex items-center">
											<Eye className="mr-2 h-4 w-4 text-blue-600" />
											<span>Public</span>
										</div>
									</SelectItem>
									<SelectItem value="private">
										<div className="flex items-center">
											<EyeOff className="mr-2 h-4 w-4 text-gray-600" />
											<span>Private</span>
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						)}
					</div>

					{/* Right side - Action Buttons */}
					<div className="flex gap-2 order-2 justify-end">
						<Button variant="outline" onClick={handleClose} disabled={loading}>
							Cancel
						</Button>
						<Button
							onClick={onSummit}
							variant="default"
							type="submit"
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Updating...
								</>
							) : (
								"Update"
							)}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export const VisibilityPopover = ({
	open,
	setOpen,
}: {
	open?: boolean;
	setOpen?: (open: boolean) => void;
}) => {
	// State declarations
	const [status, setStatus] = useState<"draft" | "publish" | "archived">(
		"draft",
	);
	const [visibility, setVisibility] = useState<"public" | "private">("public");
	const [loading, setLoading] = useState<boolean>(false);

	// Handler functions
	const handleClose = () => {
		setOpen?.(false);
	};

	const handleSubmit = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): Promise<void> => {
		e.preventDefault();
		setLoading(true);

		// TODO: Add your API call here
		// try {
		//   await updateBlogVisibility({ status, visibility });
		//   handleClose();
		// } catch (error) {
		//   console.error(error);
		// } finally {
		//   setLoading(false);
		// }
	};

	const handleStatusChange = (value: "draft" | "publish" | "archived") => {
		setStatus(value);
	};

	const handleVisibilityChange = (value: "public" | "private") => {
		setVisibility(value);
	};

	// Effects
	useEffect(() => {
		if (!open) {
			const timer = setTimeout(() => {
				setVisibility("public");
				setStatus("draft");
				setLoading(false);
			}, 150);
			return () => clearTimeout(timer);
		}
	}, [open]);

	useEffect(() => {
		if (status !== "publish") {
			setVisibility("public");
		}
	}, [status]);

	// Status configuration
	const statusConfig = {
		draft: {
			icon: FileText,
			label: "Draft",
			color: "text-yellow-600",
			bgColor: "bg-yellow-50",
			description: "Save as draft for later",
		},
		publish: {
			icon: CheckCircle,
			label: "Publish",
			color: "text-green-600",
			bgColor: "bg-green-50",
			description: "Make post live",
		},
		archived: {
			icon: Archive,
			label: "Archived",
			color: "text-gray-600",
			bgColor: "bg-gray-50",
			description: "Move to archive",
		},
	};

	// Visibility configuration
	const visibilityConfig = {
		public: {
			icon: Eye,
			label: "Public",
			color: "text-blue-600",
			bgColor: "bg-blue-50",
			description: "Anyone can view",
		},
		private: {
			icon: EyeOff,
			label: "Private",
			color: "text-purple-600",
			bgColor: "bg-purple-50",
			description: "Only you can view",
		},
	};

	// Render helpers
	const renderStatusOptions = () => (
		<>
			{Object.entries(statusConfig).map(([key, config]) => {
				const Icon = config.icon;
				return (
					<SelectItem key={key} value={key} className="cursor-pointer">
						<div className="flex items-center gap-2 py-1">
							<div className={`p-1.5 rounded ${config.bgColor}`}>
								<Icon className={`h-4 w-4 ${config.color}`} />
							</div>
							<div className="flex flex-col">
								<span className="font-medium">{config.label}</span>
								<span className="text-xs text-muted-foreground">
									{config.description}
								</span>
							</div>
						</div>
					</SelectItem>
				);
			})}
		</>
	);

	const renderVisibilityOptions = () => (
		<>
			{Object.entries(visibilityConfig).map(([key, config]) => {
				const Icon = config.icon;
				return (
					<SelectItem key={key} value={key} className="cursor-pointer">
						<div className="flex items-center gap-2 py-1">
							<div className={`p-1.5 rounded ${config.bgColor}`}>
								<Icon className={`h-4 w-4 ${config.color}`} />
							</div>
							<div className="flex flex-col">
								<span className="font-medium">{config.label}</span>
								<span className="text-xs text-muted-foreground">
									{config.description}
								</span>
							</div>
						</div>
					</SelectItem>
				);
			})}
		</>
	);

	// Get current selections for display
	const currentStatus = statusConfig[status];
	const currentVisibility = visibilityConfig[visibility];
	const StatusIcon = currentStatus.icon;
	const VisibilityIcon = currentVisibility.icon;

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[550px] w-full h-fit">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">
						Update Blog Visibility
					</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground">
						Control who can see your blog post and its publication status.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-2 h-fit">
					{/* Status Section */}
					<div className="space-y-4 h-fit">
						<label
							htmlFor="status"
							className="text-sm font-medium !pb-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Publication Status
						</label>
						<Select
							value={status}
							onValueChange={handleStatusChange}
							disabled={loading}
						>
							<SelectTrigger id="status" className="w-full !h-fit py-2">
								<div className="flex items-center gap-2 h-fit">
									<div className={`p-1.5 rounded ${currentStatus.bgColor}`}>
										<StatusIcon className={`h-4 w-4 ${currentStatus.color}`} />
									</div>
									<div className="flex flex-col items-start">
										<span className="font-medium">{currentStatus.label}</span>
										<span className="text-xs text-muted-foreground">
											{currentStatus.description}
										</span>
									</div>
								</div>
							</SelectTrigger>
							<SelectContent className="w-[--radix-select-trigger-width]">
								{renderStatusOptions()}
							</SelectContent>
						</Select>
					</div>

					{/* Visibility Section - Only shown when published */}
					{status === "publish" && (
						<div className="space-y-2 animate-in fade-in-50 duration-200">
							
							<Select
								value={visibility}
								onValueChange={handleVisibilityChange}
								disabled={loading}
							>
								<SelectTrigger className="w-full !h-fit py-2">
									<div className="flex items-center gap-2">
										<div
											className={`p-1.5 rounded ${currentVisibility.bgColor}`}
										>
											<VisibilityIcon
												className={`h-4 w-4 ${currentVisibility.color}`}
											/>
										</div>
										<div className="flex flex-col items-start">
											<span className="font-medium">
												{currentVisibility.label}
											</span>
											<span className="text-xs text-muted-foreground">
												{currentVisibility.description}
											</span>
										</div>
									</div>
								</SelectTrigger>
								<SelectContent className="w-[--radix-select-trigger-width]">
									{renderVisibilityOptions()}
								</SelectContent>
							</Select>
						</div>
					)}

					{/* Info message */}
					{status === "draft" && (
						<div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200 animate-in fade-in-50 duration-200">
							<AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
							<p className="text-xs text-yellow-800">
								Draft posts are only visible to you and won't appear publicly.
							</p>
						</div>
					)}

					{status === "archived" && (
						<div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 border border-gray-200 animate-in fade-in-50 duration-200">
							<AlertCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
							<p className="text-xs text-gray-800">
								Archived posts are hidden from your blog but can be restored
								anytime.
							</p>
						</div>
					)}
				</div>

				<DialogFooter className="gap-2 pt-2">
					<Button
						variant="outline"
						onClick={handleClose}
						disabled={loading}
						className="min-w-[100px]"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						variant="default"
						type="submit"
						disabled={loading}
						className="min-w-[100px]"
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Updating...
							</>
						) : (
							<>Update</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
