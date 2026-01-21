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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import { setTitleAndDescription } from "@/store/reducers/DocsEditor";
import { Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";

export const EditorModel = () => {
  const params = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [type, setType] = useState<"blog" | "docs">("blog");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [tags, setTags] = useState<string>(""); // raw string for input
  const [loading, setLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setOpen(false);
    if (params === "/editor") {
      setLoading(false);
      setOpen(false);
    }
  }, [params]);

  interface TitleAndDescriptionPayload {
    type: "blog" | "docs";
    title: string;
    description: string;
    tags: string[];
  }

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!type) errors.type = "Please select a content type.";
    if (!title.trim()) errors.title = "Title is required.";
    if (!(title.length >= 5)) errors.title = "Title must be at least 5 characters long.";
    if (!(title.length <= 100)) errors.title = "Title must be less than 100 characters long.";
    if (!description.trim()) errors.description = "Description is required.";
    if (!(description.length >= 10)) errors.description = "Description must be at least 10 characters long.";
    if (!(description.length <= 300)) errors.description = "Description must be less than 300 characters long.";
    if (tags.trim().length==0) {
      errors.tags = "At least one tag is required.";
    } else {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0 );

      if (tagsArray.length === 0) {
        errors.tags = "Please enter valid tags (comma separated).";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSummit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault();

    if (!validateForm()) return;

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    dispatch(
      setTitleAndDescription({
        type,
        title: title.trim(),
        description: description.trim(),
        tags: tagsArray,
      } as TitleAndDescriptionPayload)
    );

    setLoading(true);
    router.push("/editor"+ (type === "blog" ? "/blog/new" : "/docs/new"));
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
          <DialogTitle>New Blog/Docs</DialogTitle>
          <DialogDescription>
            Make new post and share your thoughts with the world.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="type">
              Type of Content<span className="text-red-500">*</span>
            </Label>
            <Select onValueChange={(value) => setType(value as "blog" | "docs")} defaultValue={type}>
              <SelectTrigger id="type" className="w-44">
                <SelectValue placeholder="Type of Content" defaultValue={type} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem  value="blog">Blog</SelectItem>
                <SelectItem value="docs">Docs</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.type && <p className="text-sm text-red-500">{formErrors.type}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">
              Title<span className="text-red-500">*</span>
            </Label>
            <Input onChange={(e) => setTitle(e.target.value)} id="title" name="title" />
            {formErrors.title && <p className="text-sm text-red-500">{formErrors.title}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">
              Description<span className="text-red-500">*</span>
            </Label>
            <Input onChange={(e) => setDescription(e.target.value)} id="description" name="description" />
            {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="thumbnail">
              Thumbnail<span className="text-red-500">*</span>
            </Label>
            <Input type="file" id="thumbnail" name="thumbnail" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">
              Tags (comma separated)<span className="text-red-500">*</span>
            </Label>
            <Input
              onChange={(e) => setTags(e.target.value)}
              id="tags"
              name="tags"
              placeholder="e.g. react, nextjs, typescript"
            />
            {formErrors.tags && <p className="text-sm text-red-500">{formErrors.tags}</p>}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onSummit} type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
