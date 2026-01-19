"use client"
import Editor from "@/components/ui/editorComponent";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { setContent } from "@/store/reducers/BlogEditor";

export default function BlogEditor() {

    const dispatch = useAppDispatch();
    const intialContent = useAppState((s) => s.blogReducer.content);
    const save = (content: string) => {
        dispatch(
            setContent({
                content: content,
            }),
        );
    };
    return (
        <div className="w-full">
            <Editor intialContent={intialContent} save={save} />
        </div>
    )
}