import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
import { BubbleMenu } from "@tiptap/react/menus";
import { CharacterCount } from "@tiptap/extensions";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { TableKit } from '@tiptap/extension-table'


// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension";
import { all, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import java from "highlight.js/lib/languages/java";
import yaml from "highlight.js/lib/languages/yaml";
import xml from "highlight.js/lib/languages/xml";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";

// --- UI Primitives ---
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover";
import { LinkPopover } from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import "highlight.js/styles/tokyo-night-dark.css";

// --- Styles ---
import { Button } from "@/components/shadcnUI/button";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { setContent } from "@/store/reducers/PostContent";
import { MenuBar } from "./customBlock";
import "./syntax.css";
import "./tiptapstyles.scss"
import Popup from "./Popup";
import { TableDropdownMenu, TableMenu } from "@/components/tiptap-ui/table-dropdown-menu";
interface MainToolbarContentProp {
  onSave: () => void;
  editor: ReturnType<typeof useEditor> | null;
}

//syntax highlighting
const MainToolbarContent = ({ onSave, editor }: MainToolbarContentProp) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [content, saveContent] = React.useState<string>("");
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />

        <ColorHighlightPopover />

        <LinkPopover />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <MenuBar editor={editor} />
      <TableMenu editor={editor} />
      <ToolbarSeparator />

      <ToolbarGroup>
        {/* <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" /> */}
      </ToolbarGroup>

      <ToolbarSeparator />
      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Popup
        open={open}
        setOpen={setOpen}
        saveContent={saveContent}
        onClick={() => {
          setOpen(true);
        }}
        editor={editor}
      />
      <Button onClick={onSave}>Save</Button>
      <Spacer />
    </>
  );
};

export default function Editor() {
  const [word, setWord] = React.useState(0);
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  //limit
  const limit = 20000;
  const lowlight = createLowlight(all);
  lowlight.register("js", js);
  lowlight.register("ts", ts);
  lowlight.register("html", html);
  lowlight.register("css", css);
  lowlight.register("java", java);
  lowlight.register("yaml", yaml);
  lowlight.register("xml", xml);
  lowlight.register("c", c);
  lowlight.register("cpp", cpp);
  const content = useAppState((s) => s.postReducer.content);
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
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      TableKit,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      CharacterCount.configure({
        limit,
      }),
      TrailingNode,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        shouldAutoLink: (url) => {
          try {
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);
            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
      }),

      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content,
    onUpdate({ editor }) {
      const count = editor.storage.characterCount.characters();
      setWord(count);
    },

  });
  const onSave = () => {
    dispatch(
      setContent({
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
                <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                  Insert table
                </button>
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

        <div className="flex justify-center p-5 min-h-[calc(100vh-7rem)]" onClick={() => editor?.chain().focus().run()}>
          <EditorContent
            editor={editor}
            role="presentation"
            className="simple-editor-content w-full container max-w-5xl"

          />
        </div>
        <div className="fixed bottom-5 right-6 text-xs bg-border p-2 rounded-lg ">
          {" "}
          {word ?? 0} / {limit} characters
        </div>
      </div>
    </EditorContext.Provider>
  );
}
