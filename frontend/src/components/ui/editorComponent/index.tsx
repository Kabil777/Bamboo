/** biome-ignore-all lint/a11y/useAriaPropsSupportedByRole: <explanation> */

"use client";

import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

import "highlight.js/styles/tokyo-night-dark.css";
import "./syntax.css";
import "./tiptapstyles.scss";

import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { EditorContext, useEditor } from "@tiptap/react";
import { renderToMarkdown } from "@tiptap/static-renderer";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Doc } from "yjs";
import { BubbleMenuEditor } from "@/components/atomsComponents/bubbleMenuEditor";
import { EditorContiner } from "@/components/atomsComponents/editorcontiner";
import MainToolbarContent from "@/components/atomsComponents/ToolBarEditor";
import { ToolBarBottom } from "@/components/atomsComponents/toolBarBottom";
import { Toolbar } from "@/components/tiptap-ui-primitive/toolbar";
import { useCollaborativeAwareness } from "@/hooks/useCollabrationAwareness";
import { useCollabUser } from "@/hooks/useCollabUser";
import extensions from "@/lib/extensions";
import { useHocuspocusProvider } from "@/lib/hocuspocus";

export default function Editor({
	idContent,
	save,
}: {
	idContent: string;
	save: (content: string) => void;
}) {
	type InvitedUser = { email: string; role: string };

	const provider = useHocuspocusProvider(idContent, "blog");

	const collabUser = useCollabUser();

	// Add null check before accessing provider.document
	console.log("Docu :", provider?.document);

	const { onlineUsers, totalUsers, editorUsers } = useCollaborativeAwareness(
		provider,
		{
			userId: collabUser.id,
			name: collabUser.name,
			color: collabUser.color,
		},
		"editor",
	);

	const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
	const [word, setWord] = useState(0);
	const [synced, setSynced] = useState(false);

	useEffect(() => {
		if (!provider) return;

		const meta = provider.document.getMap("meta");

		const observer = () => {
			const status = meta.get("saveStatus");
			if (status === "SAVED") {
				toast.success("Saved successfully");
			}
			if (status === "FAILED") {
				toast.error("Save failed. Try again.");
			}
		};
		meta.observe(observer);
		return () => {
			meta.unobserve(observer);
		};
	}, [provider]);

	// Track previous online users to detect new joins
	const prevOnlineUsersRef = useRef<string[]>([]);

	useEffect(() => {
		// Only run if onlineUsers is available
		if (!onlineUsers) return;
		const prevOnlineUsers = prevOnlineUsersRef.current;
		// Find new users who joined
		const newUsers = onlineUsers.filter(
			(user: any) => !prevOnlineUsers.includes(user.id),
		);
		if (newUsers.length > 0) {
			newUsers.forEach((user: any) => {
				if (user.name && user.id !== collabUser.id) {
					toast.info(`${user.name} joined the editor`);
				}
			});
		}
		// Update ref for next comparison
		prevOnlineUsersRef.current = onlineUsers.map((user: any) => user.id);
	}, [onlineUsers, collabUser.id]);

	console.log(onlineUsers, " ", totalUsers);
	const toolbarRef = useRef<HTMLDivElement>(null);

	const editor = useEditor(
		{
			immediatelyRender: false,
			autofocus: "end",
			editorProps: {
				attributes: {
					autocomplete: "on",
					autocorrect: "on",
					autocapitalize: "on",
					"aria-label": "Start typing...",
				},
			},
			extensions: provider
				? [
						...extensions,
						Collaboration.configure({
							provider,
							document: provider.document as Doc,
						}),
						CollaborationCaret.configure({
							provider,
							user: {
								name: collabUser.name,
								color: collabUser.color,
							},
						}),
					]
				: extensions, // Only add collaboration extensions when provider is ready
			onCreate({ editor }) {
				setWord(editor.storage.characterCount.characters());
			},
			onUpdate({ editor }) {
				setWord(editor.storage.characterCount.characters());
			},
		},
		[provider],
	); // Add provider as dependency

	// Wait for provider sync before rendering editor content
	useEffect(() => {
		if (!provider) return;
		const handleSynced = () => setSynced(true);
		provider.on("synced", handleSynced);
		return () => {
			provider.off("synced", handleSynced);
		};
	}, [provider]);

	const onSave = () => {
		if (!editor) return;
		if (!provider) {
			toast.error("Collaboration provider not ready");
			return;
		}
		save(
			renderToMarkdown({
				extensions,
				content: editor.getJSON() || {},
			}),
		);
		const yDoc = provider.document;
		const meta = yDoc.getMap("meta");
		meta.set("saveRequestedAt", Date.now());
	};

	return (
		<EditorContext.Provider value={{ editor }}>
			{provider && (
				<div className="content-wrapper">
					<Toolbar ref={toolbarRef}>
						<MainToolbarContent
							onSave={onSave}
							usersOnline={onlineUsers}
							totalUsers={totalUsers}
							editor={editor}
						/>
					</Toolbar>

					{editor && <BubbleMenuEditor editor={editor} />}

					{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
					<div
						className="flex justify-center p-5 min-h-[calc(100vh-7rem)]"
						onClick={() => editor?.chain().focus().run()}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								editor?.chain().focus().run();
							}
						}}
					>
						{editor && synced && <EditorContiner editor={editor} />}

						<div className="fixed bottom-16 right-16 flex flex-col gap-2 z-10">
							<ToolBarBottom
								editor={editor}
								onSave={onSave}
								collabUser={collabUser}
								invitedUsers={invitedUsers}
								setInvitedUsers={setInvitedUsers}
							/>
						</div>
					</div>
					<div className="fixed bottom-5 right-6 text-xs bg-border p-2 rounded-lg ">
						{" "}
						{word ?? 0} characters
					</div>
				</div>
			)}
		</EditorContext.Provider>
	);
}
