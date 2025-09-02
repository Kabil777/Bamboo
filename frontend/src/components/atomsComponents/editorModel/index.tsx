"use client";
import { Button } from "@/components/shadcnUI/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcnUI/dialog";
import { Input } from "@/components/shadcnUI/input";
import { Label } from "@/components/shadcnUI/label";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import { setTitleAndDescription } from "@/store/reducers/PostContent";
import { Loader, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { FiEdit3 } from "react-icons/fi";
import { useDispatch } from "react-redux";

export const EditorModel = () => {
  const params = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setOpen(false);
    if (params === "/editor") {
      setLoading(false);
      setOpen(false);
    }
  }, [params]);
  interface OnSummitEvent extends React.MouseEvent<HTMLButtonElement, MouseEvent> {
    preventDefault: () => void;
  }

  interface TitleAndDescriptionPayload {
    title: string;
    description: string;
  }

  const onSummit = (e: OnSummitEvent): void => {
    e.preventDefault();
    if (title === "" || description === "") {
      console.log("Title empty");
    } else {
      console.log(title, description);
      dispatch(
        setTitleAndDescription({
          title: title,
          description: description,
        } as TitleAndDescriptionPayload),
      );
      setLoading(true);
      router.push("/editor");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={params === "/editor"}>
        <Button
          variant="outline"
          className="flex items-center transition-all delay-75 justify-between text-sm text-muted-foreground border border-input bg-accent rounded-md hover:bg-accent hover:text-foreground"
        >
          <FiEdit3 className="pointer-events-none" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Post</DialogTitle>
          <DialogDescription>
            Make new post and share your thoughts with the world.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="theme">Post/Blog</Label>
            <select id="theme" name="theme">
              <option value="post">Post</option>
              <option value="blog">Blog</option>
            </select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="title">Title</Label>
            <Input
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              id="title"
              name="title"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Input
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              name="description"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <Input type="file" id="thumbnail" name="thumbnail" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="snippet">Snippet</Label>
            <Input type="text" id="snippet" name="snippet" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={(e) => onSummit(e)} type="submit">
            Create {loading && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
