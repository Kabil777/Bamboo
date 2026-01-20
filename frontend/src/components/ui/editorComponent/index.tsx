"use client";

import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

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
import { Plus, Save, Table2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu";

//syntax highlighting

export default function Editor({
  intialContent,
  save,
}: {
  intialContent: string;
  save: (content: string) => void;
}) {
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const raw = marked.parse(intialContent ?? "");

  const [word, setWord] = React.useState(0);

  const editor = useEditor({
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
    extensions: extensions,
    content: raw,
    onCreate({ editor }) {
      setWord(editor.storage.characterCount.characters());
    },
    onUpdate({ editor }) {
      setWord(editor.storage.characterCount.characters());
    },
  });

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
            placeholder="Type Here"
            role="presentation"
            className="simple-editor-content w-full container max-w-5xl"
          />
        <div className="fixed bottom-16 right-16">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="icon" className="rounded-full">
                <Plus size={24} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" align="end" className="!min-w-fit !bg-transparent border-none !shadow-none p-0" sideOffset={10}>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" size="icon" className="rounded-full" >
                  <Save onClick={onSave}>Save</Save>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full" >
                  <Save onClick={onSave}>Save</Save>
                </Button>
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
