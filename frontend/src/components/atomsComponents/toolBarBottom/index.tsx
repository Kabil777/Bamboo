import { Plus, Save, Upload, Users } from "lucide-react";
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
import { TableMenu } from "@/components/tiptap-ui/table-dropdown-menu/table-dropdown-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/tiptap-ui-primitive/dropdown-menu/dropdown-menu";
import Popup from "@/components/ui/editorComponent/Popup";

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
			<Dialog open={openUpload} onOpenChange={setOpenUpload}>
				<DialogTrigger asChild>
					<Button size="icon" className="rounded-full">
						<Upload size={24} />
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader className="mt-5">
						<DialogTitle>Upload the blog</DialogTitle>
					</DialogHeader>
					<DialogDescription className="mb-5">
						Upload the current content as a blog post.
					</DialogDescription>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button onClick={onSave}>Upload</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={openColab} onOpenChange={setOpenColab}>
				<DialogTrigger asChild>
					<Button size="icon" className="rounded-full">
						<Users size={24} />
					</Button>
				</DialogTrigger>
				<DialogContent
					className="sm:max-w-[480px] !bg-transparent border-none shadow-none"
					showCloseButton={false}
				>
					<DialogHeader className="h-fit">
						<DialogTitle className="text-2xl font-bold" />
						<form
							className="flex gap-2 items-center"
							onSubmit={(e) => {
								e.preventDefault();
								const email = e.currentTarget.email.value.trim();
								if (email && !invitedUsers.some((u) => u.email === email)) {
									setInvitedUsers((prev) => [
										...prev,
										{ email, role: "Editor" },
									]);
									e.currentTarget.reset();
								}
							}}
						>
							<Input
								name="email"
								type="email"
								placeholder="Email to invite..."
								className="flex-1 bg-background px-4 py-4 rounded-lg"
							/>
							<Button type="submit" variant="default" className="px-4">
								Invite
							</Button>
						</form>
					</DialogHeader>
					<div className="space-y-6 bg-background p-4 rounded-lg">
						{/* Invite input */}

						{/* User list */}
						<div>
							<div className="font-semibold mb-2 text-sm text-muted-foreground">
								People with access
							</div>
							<ul className="space-y-2">
								{/* Owner (current user) */}
								<li className="flex items-center gap-3 bg-background rounded px-2 py-2 border">
									<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
										{collabUser.name?.[0]?.toUpperCase() || "A"}
									</div>
									<div className="flex-1">
										<div className="font-medium">
											{collabUser.name || "You"}
										</div>
										<div className="text-xs text-muted-foreground">Owner</div>
									</div>
									<span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
										You
									</span>
								</li>
								{/* Invited users */}
								{invitedUsers.length === 0 && (
									<li className="text-muted-foreground text-sm px-2">
										No invites yet.
									</li>
								)}
								{invitedUsers.map(({ email, role }) => (
									<li
										key={email}
										className="flex items-center gap-3 bg-accent rounded px-2 py-2"
									>
										<div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-700 font-bold text-lg">
											{email[0]?.toUpperCase()}
										</div>
										<div className="flex-1">
											<div className="font-medium">{email}</div>
											<div className="text-xs text-muted-foreground">
												{role}
											</div>
										</div>
										<Button
											size="sm"
											variant="ghost"
											onClick={() =>
												setInvitedUsers((prev) =>
													prev.filter((u) => u.email !== email),
												)
											}
										>
											Remove
										</Button>
									</li>
								))}
							</ul>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button">Close</Button>
							</DialogClose>
						</DialogFooter>
					</div>
				</DialogContent>
			</Dialog>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="default" size="icon" className="rounded-full">
						<Plus size={24} />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					side="top"
					align="end"
					className="!min-w-fit !bg-transparent border-none !shadow-none p-0 mr-10"
				>
					<div className="flex flex-col space-y-2 z-50">
						<Button variant="outline" className="rounded-full">
							<Save onClick={onSave} />
							Save
						</Button>

						<Button variant="outline" className="rounded-full">
							<Save onClick={onSave} />
							Save
						</Button>

						<TableMenu editor={editor} />
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
