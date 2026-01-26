"use client";

import Editor from "@/components/ui/editorComponent";
import { useParams } from "next/navigation";

export default function BlogEditor() {
    const save = (content: string) => {
        console.log(content);
    };
    const { id } = useParams<{ id: string }>();

    if (!id) return null;

    return (
        <div className="w-full">
            <Editor idContent={id} save={save} />
        </div>
    );
}
