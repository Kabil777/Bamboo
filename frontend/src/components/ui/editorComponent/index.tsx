"use client";

import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
// --- Tiptap Core Extensions ---
import { BubbleMenu } from "@tiptap/react/menus";
import { marked } from "marked";

// --- UI Primitives ---
import { Toolbar } from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Lib ---
import "highlight.js/styles/tokyo-night-dark.css";

// --- Styles ---
import { Button } from "@/components/shadcnUI/button";
import "./syntax.css";
import "./tiptapstyles.scss";

import { renderToMarkdown } from "@tiptap/static-renderer";
import extensions from "@/lib/extensions";
import MainToolbarContent from "@/components/atomsComponents/ToolBarEditor";
import { FaToolbox } from "react-icons/fa";
import { Group, Plus, Save, Table2, Upload, Users } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu";
import { MenuBar } from "./customBlock";
import { TableMenu } from "@/components/tiptap-ui/table-dropdown-menu/table-dropdown-menu";
import Popup from "./Popup";
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
import { useHocuspocusProvider } from "@/lib/hocuspocus";
import { useCollaborativeAwareness } from "@/hooks/useCollabrationAwareness";
import { useCollabUser } from "@/hooks/useCollabUser";
import { toast } from "sonner";
//syntax highlighting

export default function Editor({
    intialContent,
    save,
}: {
    intialContent: string;
    save: (content: string) => void;
}) {
    const provider = useHocuspocusProvider("123", "blog");

    const collabUser = useCollabUser();

    const { onlineUsers, totalUsers, editorUsers } = useCollaborativeAwareness(
        provider,
        {
            userId: collabUser.id,
            name: collabUser.name,
            color: collabUser.color,
        },
        "editor",
    );

    React.useEffect(() => {
        console.log("=== Awareness Debug ===");
        console.log("My user:", collabUser);
        console.log("Online users:", onlineUsers);
        console.log("Total users:", totalUsers);
        console.log("Editor users:", editorUsers);
    }, [collabUser, onlineUsers, totalUsers, editorUsers]);

    React.useEffect(() => {
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
        return () => meta.unobserve(observer);
    }, [provider]);

    console.log(onlineUsers, " ", totalUsers);
    const toolbarRef = React.useRef<HTMLDivElement>(null);
    const raw = marked.parse(intialContent ?? "");
    const [open, setOpen] = React.useState<boolean>(false);
    const [word, setWord] = React.useState(0);

    const editor = useEditor(
        provider?.document
            ? {
                  immediatelyRender: false,
                  editorProps: {
                      attributes: {
                          autocomplete: "on",
                          autocorrect: "on",
                          autocapitalize: "on",
                          "aria-label": "Start typing...",
                      },
                  },
                  autofocus: "end",
                  extensions: [
                      ...extensions,
                      Collaboration.configure({
                          field: "content",
                          document: provider.document,
                      }),
                      CollaborationCaret.configure({
                          provider: provider,
                          user: {
                              name: collabUser.name,
                              color: collabUser.color,
                          },
                      }),
                  ],
                  onCreate({ editor }) {
                      setWord(editor.storage.characterCount.characters());
                  },
                  onUpdate({ editor }) {
                      setWord(editor.storage.characterCount.characters());
                  },
              }
            : null,
    );

    const onSave = () => {
        console.log(
            renderToMarkdown({ extensions, content: editor?.getJSON() || {} }),
        );
        save(
            renderToMarkdown({
                extensions,
                content: editor?.getJSON() || {},
            }),
        );
        if (!editor) return;

        if (!provider) return;
        const yDoc = provider.document;
        const meta = yDoc.getMap("meta");
        meta.set("saveRequestedAt", Date.now());
    };

    return (
        <EditorContext.Provider value={{ editor }}>
            <div className="content-wrapper">
                <Toolbar ref={toolbarRef}>
                    <MainToolbarContent onSave={onSave} editor={editor} />
                </Toolbar>
                {editor && (
                    <>
                        <BubbleMenu
                            editor={editor}
                            className="!z-20 absolute"
                            options={{ placement: "bottom-start", offset: 5 }}
                            shouldShow={({ from, to }) => {
                                return from !== to;
                            }}
                        >
                            <div className="bubble-menu bg-background px-1 py-0.5 border-1 border-border/50 text-sm rounded-xl flex shadow-2xl">
                                <Button
                                    variant={"ghost"}
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleBold()
                                            .run()
                                    }
                                    className="transition-all delay-75 py-1 px-2 rounded-xl font-semibold text-sm text-muted-foreground bg-background hover:bg-accent hover:text-foreground"
                                >
                                    Bold
                                </Button>
                                <Button
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleItalic()
                                            .run()
                                    }
                                    className="transition-all delay-75 py-1 px-2 font-semibold  rounded-xl text-sm text-muted-foreground bg-background hover:bg-accent hover:text-foreground"
                                >
                                    Italic
                                </Button>
                                <Button
                                    onClick={() => {
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleStrike()
                                            .run();
                                    }}
                                    className="transition-all delay-75 py-1 px-2 font-semibold  rounded-xl text-sm text-muted-foreground bg-background hover:bg-accent hover:text-foreground"
                                >
                                    Strike
                                </Button>
                            </div>
                        </BubbleMenu>
                    </>
                )}

                <div
                    className="flex justify-center p-5 min-h-[calc(100vh-7rem)]"
                    onClick={() => editor?.chain().focus().run()}
                >
                    <EditorContent
                        editor={editor}
                        placeholder="Type Here"
                        role="presentation"
                        className="simple-editor-content w-full container max-w-5xl"
                    />

                    <div className="fixed bottom-16 right-16 flex flex-col gap-2 z-10">
                        {editor && (
                            <Popup
                                open={open}
                                setOpen={setOpen}
                                onClick={() => {
                                    setOpen(true);
                                }}
                                editor={editor}
                            />
                        )}
                        <Dialog open={open} onOpenChange={setOpen}>
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
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button onClick={onSave}>Upload</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button size="icon" className="rounded-full">
                                    <Users size={24} />
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
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button onClick={onSave}>Upload</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="default"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <Plus size={24} />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                side="top"
                                align="end"
                                className="!min-w-fit !bg-transparent border-none !shadow-none p-0 mr-10"
                                sideOffset={10}
                            >
                                <div className="flex flex-col space-y-2 z-50">
                                    <Button
                                        variant="outline"
                                        className="rounded-full"
                                    >
                                        <Save onClick={onSave} />
                                        Save
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="rounded-full"
                                    >
                                        <Save onClick={onSave} />
                                        Save
                                    </Button>

                                    <MenuBar editor={editor} />
                                    <TableMenu editor={editor} />
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="fixed bottom-5 right-6 text-xs bg-border p-2 rounded-lg ">
                    {" "}
                    {word ?? 0} characters
                </div>
            </div>
        </EditorContext.Provider>
    );
}
