"use client";
import Editor from "@/components/ui/editorComponent";
import { useAppState } from "@/hooks/ReduxHooks";

export default function BlogEditor() {
  const save = (content: string) => {
    console.log("Saving content:", content);
    ``;
  };

  return (
    <div className="w-full">
      <Editor save={save} />
    </div>
  );
}
