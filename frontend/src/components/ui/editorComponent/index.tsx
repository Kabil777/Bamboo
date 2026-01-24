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
import { Input } from "@/components/shadcnUI/input";
import { toast } from "sonner";
//syntax highlighting

export default function Editor({
  //   intialContent,
  id,
  save,
}: {
  //   intialContent: string;
  id: string;
  save: (content: string) => void;
}) {
  const provider = useHocuspocusProvider(id, "blog");

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

  // Collab invite state (now with role)
  type InvitedUser = { email: string; role: string };
  const [invitedUsers, setInvitedUsers] = React.useState<InvitedUser[]>([]);

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
  const raw = marked.parse("");
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
          content: raw,
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
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className="transition-all delay-75 py-1 px-2 rounded-xl font-semibold text-sm text-muted-foreground bg-background hover:bg-accent hover:text-foreground"
                >
                  Bold
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className="transition-all delay-75 py-1 px-2 font-semibold  rounded-xl text-sm text-muted-foreground bg-background hover:bg-accent hover:text-foreground"
                >
                  Italic
                </Button>
                <Button
                  onClick={() => {
                    editor.chain().focus().toggleStrike().run();
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
                    <Button variant="outline">Cancel</Button>
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
              <DialogContent className="sm:max-w-[480px]">
                <div className="space-y-6 mt-4">
                  {/* Invite input */}
                  <form
                    className="flex gap-2 items-center"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const email = e.currentTarget.email.value.trim();
                      if (
                        email &&
                        !invitedUsers.some((u) => u.email === email)
                      ) {
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
                      placeholder="Email to invite..."
                      autoComplete="off"
                      className="flex-1"
                    />
                    <Button type="submit" variant="default" className="px-4">
                      Invite
                    </Button>
                  </form>
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
                          <div className="text-xs text-muted-foreground">
                            Owner
                          </div>
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
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
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
                sideOffset={10}
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
