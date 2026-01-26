import { BubbleMenu } from "@tiptap/react/menus";

import { Button } from "@/components/shadcnUI/button";
import type { Editor } from "@tiptap/react";

export const BubbleMenuEditor = ({
	editor,
}: {
	editor: Editor | undefined;
}) => {
	return (
		<BubbleMenu
			editor={editor}
			className="!z-20 absolute"
			options={{ placement: "bottom-start", offset: 5 }}
			shouldShow={({ from, to }) => {
				return from !== to;
			}}
		>
			<div className="bubble-menu bg-background px-1 py-0.5 border-1 border-border/50 text-sm rounded-xl flex shadow-2xl">
				<Button
					variant={"ghost"}
					onClick={() => editor?.chain().focus().toggleBold().run()}
					className="transition-all delay-75 py-1 px-2 rounded-xl font-semibold text-sm text-muted-foreground bg-background hover:bg-accent hover:text-foreground"
				>
					Bold
				</Button>
				<Button
					onClick={() => editor?.chain().focus().toggleItalic().run()}
					className="transition-all delay-75 py-1 px-2 font-semibold  rounded-xl text-sm text-muted-foreground bg-background hover:bg-accent hover:text-foreground"
				>
					Italic
				</Button>
				<Button
					onClick={() => {
						editor?.chain().focus().toggleStrike().run();
					}}
					className="transition-all delay-75 py-1 px-2 font-semibold  rounded-xl text-sm text-muted-foreground bg-background hover:bg-accent hover:text-foreground"
				>
					Strike
				</Button>
			</div>
		</BubbleMenu>
	);
};
