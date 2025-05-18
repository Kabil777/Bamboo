"use client";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@/components/ui/editorComponent"), {
	ssr: false,
});

const CreateNewBlog = () => {
	return (
		<Editor
			holder="editor_create"
		/>
	);
};
export default CreateNewBlog;
