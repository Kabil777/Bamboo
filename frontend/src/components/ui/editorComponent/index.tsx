import * as React from "react";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { BubbleMenu } from "@tiptap/react/menus";
import { marked } from "marked";

// --- UI Primitives ---
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
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
import "highlight.js/styles/tokyo-night-dark.css";

// --- Styles ---
import { Button } from "@/components/shadcnUI/button";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { setContent } from "@/store/reducers/PostContent";
import { MenuBar } from "./customBlock";
import "./syntax.css";
import "./tiptapstyles.scss";
import Popup from "./Popup";
import { TableMenu } from "@/components/tiptap-ui/table-dropdown-menu";

import { renderToMarkdown } from "@tiptap/static-renderer";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import extensions from "@/lib/extensions";
import { getHocuspocusProvider } from "@/lib/hocuspocus";
interface MainToolbarContentProp {
    onSave: () => void;
    editor: ReturnType<typeof useEditor> | null;
}

//syntax highlighting
const MainToolbarContent = ({ onSave, editor }: MainToolbarContentProp) => {
    const [open, setOpen] = React.useState<boolean>(false);
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
                <ListDropdownMenu
                    types={["bulletList", "orderedList", "taskList"]}
                />
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
            {/* <TableDropdownMenu editor={editor} /> */}

            <ToolbarSeparator />

            <ToolbarGroup>
                <TextAlignButton align="left" />
                <TextAlignButton align="center" />
                <TextAlignButton align="right" />
                <TextAlignButton align="justify" />
            </ToolbarGroup>

            <ToolbarSeparator />
            <ToolbarGroup>
                <ImageUploadButton text="Add" />
            </ToolbarGroup>
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
            <Button onClick={onSave}>Save</Button>
            <Spacer />
        </>
    );
};

export default function Editor() {
    const provider = getHocuspocusProvider();
    const user = useAppState((s) => s.userReducer.user?.name);
    React.useEffect(() => {
        if (!provider || !user) return;

        if (provider) {
            provider.setAwarenessField("user", {
                name: user,
                color: "#ffcc00",
            });
        }
    }, [provider, user]);

    const toolbarRef = React.useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
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
        extensions: [
            ...extensions,
            Collaboration.configure({
                field: "content",
                document: provider.document,
            }),
            CollaborationCaret.configure({
                provider: provider,
                user: {
                    name: user,
                },
            }),
        ],
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
        dispatch(
            setContent({
                content: renderToMarkdown({
                    extensions,
                    content: editor?.getJSON() || {},
                }),
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
                        role="presentation"
                        className="simple-editor-content w-full container max-w-5xl"
                    />
                </div>
                <div className="fixed bottom-5 right-6 text-xs bg-border p-2 rounded-lg ">
                    {" "}
                    {word ?? 0} characters
                </div>
            </div>
        </EditorContext.Provider>
    );
}
