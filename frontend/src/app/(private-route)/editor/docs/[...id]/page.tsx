"use client"

import Editor from "@/components/ui/editorComponent";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { setContent, setPageContent, setSubPageContent } from "@/store/reducers/DocsEditor";
import { useParams } from "next/navigation";

export default function DocsEditor() {
    const dispatch = useAppDispatch();
    const { id } = useParams() as { id: string | string[] };
    
    const mainContent = useAppState((s) => s.docsReducer?.content || "");
    const pages = useAppState((s) => s.docsReducer?.Pages || []);

    // Determine which content to edit based on the ID
    let intialContent = "";
    let saveHandler: (content: string) => void;

    if (id.length === 1) {
        // Main overview page
        intialContent = mainContent;
        saveHandler = (content: string) => {
            dispatch(setContent({ content }));
        };
    } else if (id.length === 2) {
        // Main section page
        const page = pages.find((p) => p.id === id[1]);
        intialContent = page?.content || "";
        saveHandler = (content: string) => {
            dispatch(setPageContent({ pageId: id[1], content }));
        };
    } else if (id.length === 3) {
        // Sub-page
        const page = pages.find((p) => p.id === id[1]);
        const subpage = page?.subPages?.find((sp) => sp.id === id[2]);
        intialContent = subpage?.content || "";
        saveHandler = (content: string) => {
            dispatch(setSubPageContent({ pageId: id[1], subPageId: id[2], content }));
        };
    } else {
        saveHandler = () => {};
    }

    return (
        <div className="w-full">
            <Editor intialContent={intialContent} save={saveHandler} />
        </div>
    )
}