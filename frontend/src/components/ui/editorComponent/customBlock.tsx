import { useEditor } from "@tiptap/react";

const languages = [
  { label: "Any", value: "any" },
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Go", value: "go" }
];
export function MenuBar({
  editor,
}: {
  editor: ReturnType<typeof useEditor> | null;
}) {
  if (!editor) return null;

  const insertCodeBlock = (language: string) => {
    editor
      .chain()
      .focus()
      .insertContent({ type: "codeBlock", attrs: { language } })
      .run();
  };

  return (
    <div className="menu-bar">
      <select
        defaultValue="plaintext"
        onChange={(e) => {
          insertCodeBlock(e.target.value);
        }}
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
