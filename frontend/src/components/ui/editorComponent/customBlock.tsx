import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/shadcnUI/select";
import { useEditor } from "@tiptap/react";

const languages = [
    { label: "Plain Text", value: "plaintext" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Go", value: "go" },
  { label: "cpp", value: "cpp" },
  { label: "java", value: "java" },
  { label: "xml", value: "xml" },
  { label: "yaml", value: "yaml" },
  { label: "c", value: "c" },

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
      <Select>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue
            defaultValue="plaintext"
            onChange={(e) => {
              insertCodeBlock((e.target as HTMLSelectElement).value);
            }}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Languages</SelectLabel>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
