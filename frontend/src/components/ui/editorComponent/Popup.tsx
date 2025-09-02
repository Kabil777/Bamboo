import { Button } from "@/components/shadcnUI/button";
import { Textarea } from "@/components/shadcnUI/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcnUI/dialog";
import { useState } from "react";
import { IoLogoMarkdown } from "react-icons/io";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEditor } from "@tiptap/react";
import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcnUI/select";
import Image from "next/image";
import { Input } from "@/components/shadcnUI/input";
import { setContent } from "@/store/reducers/PostContent";
import { string } from "zod";
type Setter<T> = React.Dispatch<React.SetStateAction<T>>;
interface props {
  open: boolean;
  setOpen: Setter<boolean>;
  onClick: () => void;
  editor: ReturnType<typeof useEditor>;
}

const handleupload = (
  e: React.ChangeEvent<HTMLInputElement>,
  saveContent: Setter<string>,
) => {
  const file = e.target.files?.[0];
  console.log(file);
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    console.log(e.target?.result as string);
    saveContent(e.target?.result as string);
  };
  reader.readAsText(file);
};

const setEditorContent = async (
  editor: ReturnType<typeof useEditor>,
  content: string,
) => {
  try {
    const tree = await remark()
      .use(remarkParse)
      .use(remarkHtml)
      .process(content);

    const data = String(tree);
    if (editor) {
      console.log(data);
      editor.commands.setContent(data);
    }
  } catch (error) {
    console.log("error");
  }
};
function Popup({ open, setOpen, onClick, editor }: props) {
  const [content, saveContent] = useState("");
  const [uploadType, setUploadType] = useState("file");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="flex items-center transition-all delay-75 justify-between text-sm text-muted-foreground border border-input bg-accent rounded-md hover:bg-accent hover:text-foreground"
        >
          <IoLogoMarkdown className="pointer-events-none" />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Enter your MD file content </DialogTitle>
          <DialogDescription>Feed your md data to editor</DialogDescription>
        </DialogHeader>
        <Select
          onValueChange={(value) => {
            setUploadType(value);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Type of upload" />
            <SelectContent>
              <SelectItem value="file">File Upload</SelectItem>
              <SelectItem value="content">Content upload</SelectItem>
            </SelectContent>
          </SelectTrigger>
        </Select>
        <div className="flex items-center justify-center border-1  flex-col gap-2">
          {uploadType == "file" ? (
            <>
              <img
                src="/upload.jpg" // must be in public folder
                className=" h-66 object-contain rounded-full mt-2"
                alt="Upload icon"
              />

              <Input
                id="picture"
                type="file"
                accept=".md"
                className="w-60 mb-2"
                about="md"
                aria-description=".md files"
                onChange={(e) => {
                  handleupload(e, saveContent);
                }}
              />
            </>
          ) : (
            <Textarea
              className="w-[100%] h-80 justify-center focus:border-black "
              onChange={(e) => {
                saveContent(e.target.value);
              }}
            />
          )}
        </div>
        <DialogFooter>
          <DialogClose>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose>
            <Button
              variant="default"
              onClick={async () => {
                setOpen(false);
                await setEditorContent(editor, content);
              }}
            >
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Popup;
