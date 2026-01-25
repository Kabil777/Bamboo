"use client";
import Editor from "@/components/ui/editorComponent";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogEditor() {
  const { id } = useParams<{ id: string }>();
  const save = (content: string) => {
    console.log("Saving content:", content);
    ``;
  };
const [idContent, setIdContent] = useState(id);

  useEffect(() => {
    setIdContent(id);
  }, [id]);

  return (
    <div className="w-full">
      {idContent && <Editor idContent={idContent} save={save} />}
    </div>
  );
}
