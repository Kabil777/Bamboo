"use client";

import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

import "highlight.js/styles/tokyo-night-dark.css";
import "@/styles/syntax.css";
import "@/styles/tiptapstyles.scss";

import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { EditorContext, useEditor } from "@tiptap/react";
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
import { useDocsMetaProvider } from "@/hooks/useDocsMetaProvider";
import type { CollabRoomType } from "@/lib/collabRoomName";
import extensions from "@/lib/extensions";
import { handleImageUpload, uploadImageFromUrl } from "@/lib/tiptap-utils";
import { useHocuspocusProvider } from "@/lib/hocuspocus";
import { motion } from "framer-motion";
import { Placeholder } from "@tiptap/extensions/placeholder";

type InvitedUser = {
    userId?: string;
    email?: string | null;
    name?: string | null;
    handle?: string | null;
    coverUrl?: string | null;
    role: "owner" | "can edit" | "can view";
};

type PublishVisibility = "PUBLIC" | "PRIVATE";
type PublishStatus = "PUBLISHED";

const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuidLike(value: string | null | undefined): value is string {
    return typeof value === "string" && UUID_PATTERN.test(value.trim());
}

function markSaveRequested(
    document: Doc,
    requestedAt: number,
    visibility: PublishVisibility,
    status: PublishStatus,
) {
    const meta = document.getMap("meta");
    document.transact(() => {
        meta.set("saveRequestedAt", requestedAt);
        meta.set("publishVisibility", visibility);
        meta.set("publishStatus", status);
    });
}

export default function Editor({
    idContent,
    save,
    resourceType,
    resourceId,
}: {
    idContent: string;
    save: (visibility: "PUBLIC" | "PRIVATE") => void | Promise<void>;
    resourceType: "blog" | "docs";
    resourceId: string;
}) {
    const roomType: CollabRoomType =
        resourceType === "blog" ? "blog" : "docs-page";
    const collabUser = useCollabUser();
    const isCollabReady =
        typeof collabUser.name === "string" &&
        collabUser.name.trim().length > 0;
    const provider = useHocuspocusProvider(
        idContent,
        roomType,
        resourceType === "docs" ? resourceId : undefined,
    );
    const sidebarProvider =
        resourceType === "docs" ? useDocsMetaProvider(resourceId) : null;

    const awarenessProvider =
        resourceType === "docs" ? sidebarProvider : provider;
    const awarenessLocation = resourceType === "docs" ? "sidebar" : "editor";

    const { onlineUsers, totalUsers } = useCollaborativeAwareness(
        awarenessProvider,
        {
            userId: collabUser.id,
            name: collabUser.name,
            color: collabUser.color,
        },
        awarenessLocation,
        { suppressNotifications: true },
    );

    const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
    const [word, setWord] = useState(0);
    const [synced, setSynced] = useState(false);
    const lastSaveStatusRef = useRef<string | null>(null);
    const pendingSaveRequestRef = useRef<number | null>(null);
    const lastHandledPersistedAtRef = useRef<number | null>(null);

    useEffect(() => {
        if (!provider) return;

        const meta = provider.document.getMap("meta");
        lastSaveStatusRef.current =
            typeof meta.get("saveStatus") === "string"
                ? String(meta.get("saveStatus"))
                : null;

        const observer = () => {
            const nextStatusRaw = meta.get("saveStatus");
            const nextStatus =
                typeof nextStatusRaw === "string" ? nextStatusRaw : null;
            const previousStatus = lastSaveStatusRef.current;
            lastSaveStatusRef.current = nextStatus;
            const persistedAtRaw = meta.get("lastPersistedAt");
            const persistedAt =
                typeof persistedAtRaw === "number" ? persistedAtRaw : null;

            if (nextStatus === previousStatus) {
                return;
            }

            if (
                nextStatus === "SAVED" &&
                pendingSaveRequestRef.current != null &&
                persistedAt != null &&
                persistedAt >= pendingSaveRequestRef.current &&
                persistedAt !== lastHandledPersistedAtRef.current
            ) {
                lastHandledPersistedAtRef.current = persistedAt;
                pendingSaveRequestRef.current = null;
                toast.success("Saved successfully");
            }
            if (nextStatus === "FAILED") {
                pendingSaveRequestRef.current = null;
                toast.error("Save failed. Try again.");
            }
        };
        meta.observe(observer);
        return () => {
            meta.unobserve(observer);
            lastSaveStatusRef.current = null;
            pendingSaveRequestRef.current = null;
            lastHandledPersistedAtRef.current = null;
        };
    }, [provider]);

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
                handlePaste: (view, event) => {
                    const items = Array.from(event.clipboardData?.items || []);
                    const imageItem = items.find((item) =>
                        item.type.startsWith("image/"),
                    );
                    const insertImage = (url: string) => {
                        const { schema } = view.state;
                        const imageNode = schema.nodes.image?.create({
                            src: url,
                        });
                        if (!imageNode) return false;
                        const transaction = view.state.tr
                            .replaceSelectionWith(imageNode)
                            .scrollIntoView();
                        view.dispatch(transaction);
                        return true;
                    };

                    if (imageItem) {
                        const file = imageItem.getAsFile();
                        if (!file) return false;
                        event.preventDefault();
                        (async () => {
                            try {
                                const url = await handleImageUpload(file);
                                insertImage(url);
                            } catch {
                                toast.error("Image upload failed");
                            }
                        })();
                        return true;
                    }

                    const text = event.clipboardData?.getData("text")?.trim();
                    if (
                        text &&
                        /^https?:\/\//i.test(text) &&
                        /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(text)
                    ) {
                        event.preventDefault();
                        (async () => {
                            try {
                                const url = await uploadImageFromUrl(text);
                                insertImage(url);
                            } catch {
                                toast.error("Image upload failed");
                            }
                        })();
                        return true;
                    }

                    return false;
                },
            },

            extensions: provider
                ? [
                      ...extensions,
                      Placeholder.configure({
                          placeholder: "Start Writing here...",
                      }),
                      Collaboration.configure({
                          provider,
                          document: provider.document as Doc,
                      }),
                      ...(isCollabReady
                          ? [
                                CollaborationCaret.configure({
                                    provider,
                                    user: {
                                        name: collabUser.name,
                                        color: collabUser.color,
                                    },
                                }),
                            ]
                          : []),
                  ]
                : extensions, // Only add collaboration extensions when provider is ready
            onCreate({ editor }) {
                setWord(editor.storage.characterCount.characters());
            },
            onUpdate({ editor }) {
                setWord(editor.storage.characterCount.characters());
            },
        },
        [provider, collabUser.name, collabUser.color, isCollabReady],
    ); // Add provider as dependency

    // Wait for provider sync before rendering editor content
    useEffect(() => {
        if (!provider) {
            setSynced(false);
            return;
        }
        if (provider.synced) {
            setSynced(true);
            return;
        }
        setSynced(false);
        const handleSynced = () => setSynced(true);
        provider.on("synced", handleSynced);
        return () => {
            provider.off("synced", handleSynced);
        };
    }, [provider]);

    const onSave = (visibility: PublishVisibility) => {
        if (!editor) return;
        if (!provider || !provider.document) {
            toast.warning("Service unavailable");
            return;
        }
        if (!synced) {
            toast.warning("Document is still syncing");
            return;
        }
        if (!isUuidLike(resourceId) || !isUuidLike(idContent)) {
            toast.error("Invalid editor state");
            return;
        }
        if (pendingSaveRequestRef.current != null) {
            toast.info("Save already in progress");
            return;
        }

        const saveRequestedAt = Date.now();
        pendingSaveRequestRef.current = saveRequestedAt;
        markSaveRequested(
            provider.document as Doc,
            saveRequestedAt,
            visibility,
            "PUBLISHED",
        );

        if (resourceType === "docs" && sidebarProvider?.document) {
            markSaveRequested(
                sidebarProvider.document as Doc,
                saveRequestedAt,
                visibility,
                "PUBLISHED",
            );
        }
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

                        <ToolBarBottom
                            editor={editor}
                            onSave={onSave}
                            collabUser={collabUser}
                            invitedUsers={invitedUsers}
                            setInvitedUsers={setInvitedUsers}
                            resourceType={resourceType}
                            resourceId={resourceId}
                            onlineUsers={onlineUsers}
                            word={word}
                        />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            delay: 0.8,
                            duration: 0.35,
                            ease: "easeOut",
                        }}
                        className="fixed bottom-10 left-6 z-50 flex flex-col items-center rounded-2xl border border-border bg-background/70 backdrop-blur-2xl shadow-xl shadow-black/5 dark:shadow-black/20 text-xs px-3 py-1.5 text-foreground"
                    >
                        <span className="inline-flex items-center gap-2 ">
                            <span className="h-2 w-2 rounded-full bg-green-500 " />
                            Live · {totalUsers} online
                        </span>
                    </motion.div>
                </div>
            )}
        </EditorContext.Provider>
    );
}
