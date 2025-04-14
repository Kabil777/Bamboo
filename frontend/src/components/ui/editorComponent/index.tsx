import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import CheckList from "@editorjs/checklist";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Image from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import editorjsCodeFlask from "@calumk/editorjs-codeflask";

const EDITOR_TOOLS = {
	code: editorjsCodeFlask,
	header: {
		class: Header,
		shortcut: "CMD+H",
		inlineToolbar: true,
		config: {
			placeholder: "Enter a Header",
			levels: [2, 3, 4],
			defaultLevel: 2,
		},
	},
	paragraph: {
		class: Paragraph,
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
	data: any;
	onChange: Function;
	holder: string | HTMLElement | undefined;
}
function Editor({ data, onChange, holder }: editorProps) {
	//add a reference to editor
	const ref = useRef();
	//initialize editorjs
	useEffect(() => {
		//initialize editor if we don't have a reference
		if (!ref.current) {
			const editor = new EditorJS({
				holder: holder,
				placeholder: "Start writting here..",
				tools: EDITOR_TOOLS as any,
				data,
				async onChange(api, event) {
					const content = await api.saver.save();
					console.log(content);
					onChange(content);
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
	}, []);

	return (
		<>
			<div
				id={holder as string}
				style={{
					width: "100%",
					minHeight: 500,
					borderRadius: " 7px",
					background: "fff",
				}}
			/>
		</>
	);
}

export default Editor;
