"use client";

import Editor from "@/components/ui/editorComponent";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import {
    setContent,
    setPageContent,
    setSubPageContent,
} from "@/store/reducers/DocsEditor";
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
    const save = (content: string) => {
        console.log(content);
    };
    const params = useParams<{ id: string[] }>();
    // assertUUID(params.id, router);

    const docsId = params.id[0];
    const currentPageId = params.id.at(-1)!;

    return (
        <div className="w-full">
            <Editor idContent={currentPageId} save={save} />
        </div>
    );
}
