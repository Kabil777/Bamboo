const languages = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Go", value: "go" },
  { label: "Auto", value: "auto" },
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
      .insertContent({
        type: "codeBlock",
        attrs: { language: language === "auto" ? null : language },
      })
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
