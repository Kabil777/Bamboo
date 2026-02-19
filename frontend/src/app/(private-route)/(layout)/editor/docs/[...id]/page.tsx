"use client";

import Editor from "@/components/ui/editorComponent";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

function assertUUID(id: unknown, router) {
    if (typeof id !== "string" || id.includes(",")) {
        toast.warning("Check your document state ");
        router.push("/");
    }
}
export default function DocsEditor() {
    const router = useRouter();
    const params = useParams<{ id: string[] }>();
    // assertUUID(params.id, router);

    const docsId = params.id[0];
    const currentPageId = params.id.at(-1)!;

    function getCollabHttpBaseUrl() {
        const wsUrl =
            process.env.NEXT_PUBLIC_COLLAB_WS_URL || "ws://localhost:1234/collab";
        const normalized = wsUrl.replace(/\/+$/, "");
        const withoutPath = normalized.replace(/\/collab$/, "");

        if (withoutPath.startsWith("wss://")) {
            return withoutPath.replace("wss://", "https://");
        }
        if (withoutPath.startsWith("ws://")) {
            return withoutPath.replace("ws://", "http://");
        }
        return withoutPath;
    }

    const save = async (_content: string) => {
        if (!docsId) return;
        try {
            const baseUrl = getCollabHttpBaseUrl();
            const response = await fetch(`${baseUrl}/api/docs/save/${docsId}`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                const message =
                    (data as { message?: string } | null)?.message ||
                    "Failed to save docs";
                throw new Error(message);
            }

            toast.success("Docs saved");
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Failed to save docs";
            toast.error(message);
        }
    };

    return (
        <div className="w-full">
            <Editor
                idContent={currentPageId}
                save={save}
                resourceType="docs"
                resourceId={docsId}
            />
        </div>
    );
}
