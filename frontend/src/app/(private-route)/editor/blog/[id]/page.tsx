"use client";

import Editor from "@/components/ui/editorComponent";
import { CollabProvider } from "@/lib/hocuspocus";
import { useParams } from "next/navigation";

export default function BlogEditor() {
    const { id } = useParams<{ id: string }>();

    if (!id) return null;

    return (
        <div className="w-full">
            <CollabProvider documentId={id}>
                <Editor />
            </CollabProvider>
        </div>
    );
}
