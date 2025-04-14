"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
let Editor = dynamic(() => import("@/components/ui/editorComponent"), {
	ssr: false,
});

const CreateNewBlog = () => {
	const [content, setContent] = useState(null);
	return (
		<Editor
			data={content}
			onChange={(e: any) => {
				setContent(e);
				console.log(content);
			}}
			holder="editor_create"
		/>
	);
};
export default CreateNewBlog;
