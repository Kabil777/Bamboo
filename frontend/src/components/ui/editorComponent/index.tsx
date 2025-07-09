import React, { useEffect, useRef } from "react";
import EditorJS, { ToolConstructable } from "@editorjs/editorjs";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import editorjsCodeFlask from "@calumk/editorjs-codeflask";

const EDITOR_TOOLS: { [toolName: string]: any } = {
	code: editorjsCodeFlask,
	header: {
		class: Header as unknown as ToolConstructable,
		inlineToolbar: true,
	},
	paragraph: {
		class: Paragraph as unknown as ToolConstructable,
		// shortcut: 'CMD+P',
		inlineToolbar: true,
	},
	checklist: CheckList,
	inlineCode: InlineCode,
	table: Table,
	list: List,
	quote: Quote,
	delimiter: Delimiter,
};

interface editorProps {
	holder: string | HTMLElement | undefined;
}
function Editor({ holder }: editorProps) {
	//add a reference to editor
	const ref = useRef<EditorJS | null>(null);
	//initialize editorjs
	useEffect(() => {
		//initialize editor if we don't have a reference
		if (!ref.current) {
			const editor = new EditorJS({
				holder: holder,
				placeholder: "Start writting here..",
				tools: EDITOR_TOOLS,
				autofocus: true,
				style:{},
				async onChange(api) {
					const content = await api.saver.save();
					console.log(content);
				},
			});
			ref.current = editor;
		}

		//add a return function handle cleanup
		return () => {
			if (ref.current && ref.current.destroy) {
				ref.current.destroy();
			}
		};
	}, [holder]);

	return (
		<>
			<div
				id={holder as string}
				style={{
					minHeight: 500,
					borderRadius: " 7px",
					
				}}
			/>
		</>
	);
}

export default Editor;
