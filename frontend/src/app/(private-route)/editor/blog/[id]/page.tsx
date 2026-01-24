"use client";
import Editor from "@/components/ui/editorComponent";
import { useParams } from "next/navigation";

export default function BlogEditor() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const save = (content: string) => {
    console.log("Saving content:", content);
    ``;
  };

  return (
    <div className="w-full">
      <Editor id={id} save={save} />
    </div>
  );
}
