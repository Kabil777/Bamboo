import {
	Check,
	ChevronRight,
	Globe,
	Link2,
	Upload,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/shadcnUI/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/shadcnUI/dialog";
import { Input } from "@/components/shadcnUI/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/shadcnUI/select";
import Popup from "@/components/ui/editorComponent/Popup";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/shadcnUI/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/shadcnUI/alert-dialog";

export const ToolBarBottom = ({
	editor,
	onSave,
	collabUser,
	invitedUsers,
	setInvitedUsers,
}: {
	editor: any;
	onSave: () => void;
	collabUser: any;
	invitedUsers: any[];
	setInvitedUsers: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
	const [openMd, setOpenMd] = useState(false);
	const [openUpload, setOpenUpload] = useState(false);
	const [openColab, setOpenColab] = useState(false);
	const [linkCopied, setLinkCopied] = useState(false);

	const handleCopyLink = () => {
		// Copy the current URL to clipboard
		navigator.clipboard.writeText(window.location.href);
		setLinkCopied(true);
		setTimeout(() => setLinkCopied(false), 2000);
	};
	return (
		<>
			{editor && (
				<Popup
					open={openMd}
					setOpen={setOpenMd}
					onClick={() => {
						setOpenMd(true);
					}}
					editor={editor}
				/>
			)}
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button size="icon" className="rounded-full">
						<Upload size={24} />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Upload the blog</AlertDialogTitle>
						<AlertDialogDescription>
							Upload the current content as a blog post.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={onSave}>Upload</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Dialog open={openColab} onOpenChange={setOpenColab}>
				<DialogTrigger asChild>
					<Button size="icon" className="rounded-full">
						<Users size={24} />
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[480px] pt-0 overflow-hidden">
					{/* Header with title and copy link */}
					<DialogHeader>
						<div className="flex items-center justify-between border-b py-3 mr-3">
							<DialogTitle className="text-base font-semibold">
								Share this file
							</DialogTitle>
							<Button
								variant="ghost"
								size="sm"
								className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 px-2"
								onClick={handleCopyLink}
							>
								{linkCopied ? (
									<>
										<Check className="w-3.5 h-3.5" />
										Copied!
									</>
								) : (
									<>
										<Link2 className="w-3.5 h-3.5" />
										Copy link
									</>
								)}
							</Button>
						</div>
					</DialogHeader>

					<div className="space-y-3">
						{/* Invite Input */}
						<form
							className="flex gap-2"
							onSubmit={(e) => {
								e.preventDefault();
								const email = e.currentTarget.email.value.trim();
								if (email && !invitedUsers.some((u) => u.email === email)) {
									setInvitedUsers((prev) => [
										...prev,
										{ email, role: "can edit" },
									]);
									e.currentTarget.reset();
								}
							}}
						>
							<Input
								name="email"
								type="email"
								placeholder="Add comma separated emails to invite"
								className="h-9 flex-1 text-sm bg-muted/50"
							/>
							<Button
								type="submit"
								variant="outline"
								className="h-9 px-4 text-sm"
							>
								Invite
							</Button>
						</form>

						{/* Who has access */}
						<div className="space-y-2 pt-3">
							<h3 className="text-xs font-medium mb-2 text-foreground/80">
								Who has access
							</h3>

							{/* Anyone with link */}
							<div className="flex items-center gap-2.5 py-1 -mx-1 px-1 hover:bg-accent/50 rounded">
								<div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
									<Globe className="w-3.5 h-3.5 text-muted-foreground" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="text-[13px] leading-tight">Anyone</div>
								</div>
								<Select defaultValue="can view">
									<SelectTrigger className="text-xs gap-1 p-0 !h-fit border-0 text-muted-foreground !bg-transparent hover:bg-transparent focus:ring-0 shadow-none">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="can edit" className="text-xs">
											can edit
										</SelectItem>
										<SelectItem value="can view" className="text-xs">
											can view
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Owner */}
							<div className="flex items-center gap-2.5 py-1 -mx-1 px-1 hover:bg-accent/50 rounded">
								<Avatar className="w-7 h-7">
									<AvatarImage
										src="https://github.com/evilrabbit.png"
										alt="@evilrabbit"
									/>
									<AvatarFallback>
										{collabUser.name?.[0]?.toUpperCase() || "Y"}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<div className="text-[13px] leading-tight truncate">
										{collabUser.name || "You"}{" "}
										<span className="text-muted-foreground">(you)</span>
									</div>
								</div>
								<span className="text-[11px] text-muted-foreground px-2">
									owner
								</span>
							</div>

							{/* Invited users */}
							{invitedUsers.map(({ email, role }) => (
								<div
									key={email}
									className="flex items-center gap-1 py-1 -mx-1 px-1 hover:bg-accent/50 rounded group"
								>
									<div className="w-7 h-7 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center flex-shrink-0">
										<div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold text-[10px]">
											{email[0]?.toUpperCase()}
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<div className="text-[13px] leading-tight truncate">
											{email}{" "}
											<span className="text-muted-foreground text-[11px]">
												(Invite sent)
											</span>
										</div>
									</div>
									<Button
										size="sm"
										variant="link"
										className="h-7 w-fit p-0"
										onClick={() =>
											setInvitedUsers((prev) =>
												prev.filter((u) => u.email !== email),
											)
										}
									>
										<X className="w-3.5 h-3.5" />
									</Button>
									<Select
										defaultValue={role}
										onValueChange={(newRole) => {
											setInvitedUsers((prev) =>
												prev.map((u) =>
													u.email === email ? { ...u, role: newRole } : u,
												),
											);
										}}
									>
										<SelectTrigger className="text-xs gap-1 p-0 !h-fit border-0 text-muted-foreground !bg-transparent hover:bg-transparent focus:ring-0 shadow-none">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="can edit" className="text-xs">
												can edit
											</SelectItem>
											<SelectItem value="can view" className="text-xs">
												can view
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							))}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
