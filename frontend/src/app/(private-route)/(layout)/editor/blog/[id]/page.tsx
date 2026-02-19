"use client";

import { useParams } from "next/navigation";
import { saveBlogContent } from "@/api/blogApi";
import Editor from "@/components/ui/editorComponent";
import { toast } from "sonner";

export default function BlogEditor() {
	const { id } = useParams<{ id: string }>();

	const save = async () => {
		if (!id) return;
		try {
			await saveBlogContent(id);
            toast.success("Blog saved successfully!");
		} catch (err) {
			toast.error("Failed to save blog. Please try again.");
			console.error("Failed to save blog:", err);
		}
	};

	if (!id) return null;

	return (
		<div className="w-full">
			<Editor idContent={id} save={save} />
		</div>
	);
}
