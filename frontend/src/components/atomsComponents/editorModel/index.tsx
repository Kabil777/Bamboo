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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcnUI/select";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import {
  CreateNewBlog,
  CreateNewDocs,
} from "@/store/reducers/CreateCoverDetialsBlogDocs";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { toast } from "sonner";

interface CreateContentProps {
  title: string;
  coverUrl: string;
  description: string;
  tags: string[];
}

export const EditorModel = () => {
  const params = usePathname();

  // Disable button for /editor, /editor/blog, /editor/docs, or /editor/docs/<id>
  const disableCreate = (() => {
    if (
      params === "/editor" ||
      params === "/editor/blog" ||
      params === "/editor/docs"
    )
      return true;
    const docsIdMatch = params.match(/^\/editor\/docs\/[^/]+$/);
    return !!docsIdMatch;
  })();

  const router = useRouter();

  const dispatch = useAppDispatch();

  const [type, setType] = useState<"blog" | "docs">("blog");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [tags, setTags] = useState<string>("");
  const coverUrl =
    "https://images.prismic.io/techloset/Z1_3cpbqstJ98iN__a-complete-guide-to-next-js-a-react-js-framework.webp";
  const [loading, setLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setOpen(false);
    if (params === "/editor") {
      setLoading(false);
      setOpen(false);
    }
  }, [params]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!type) errors.type = "Please select a content type.";
    if (!title.trim()) errors.title = "Title is required.";
    if (!(title.length >= 5))
      errors.title = "Title must be at least 5 characters long.";
    if (!(title.length <= 100))
      errors.title = "Title must be less than 100 characters long.";
    if (!description.trim()) errors.description = "Description is required.";
    if (!(description.length >= 10))
      errors.description = "Description must be at least 10 characters long.";
    if (!(description.length <= 300))
      errors.description = "Description must be less than 300 characters long.";
    if (tags.trim().length == 0) {
      errors.tags = "At least one tag is required.";
    } else {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      if (tagsArray.length === 0) {
        errors.tags = "Please enter valid tags (comma separated).";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSummit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    const cover: CreateContentProps = {
      title: title.trim(),
      coverUrl: coverUrl,
      description: description.trim(),
      tags: tagsArray,
    };
    console.log("Creating content with details:", cover);
    try {
      let created;
      if (type === "blog") {
        created = await dispatch(
          CreateNewBlog(cover as CreateContentProps),
        ).unwrap();
        if (created && created.id) {
          router.push(`/editor/blog/${created.id}`);
        } else {
          toast.error("Failed to create blog. Please try again.");
        }
      } else if (type === "docs") {
        created = await dispatch(
          CreateNewDocs(cover as CreateContentProps),
        ).unwrap();
        if (created && created.id) {
          router.push(`/editor/docs/${created.id}`);
        } else {
          toast.error("Failed to create docs. Please try again.");
        }
      }
    } catch (error) {
      toast.error("Failed to create content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disableCreate}>
        <Button
          variant="outline"
          className="flex items-center transition-all delay-75 justify-between text-sm text-muted-foreground border border-input bg-accent rounded-md hover:bg-accent hover:text-foreground"
          disabled={disableCreate}
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
            <Select
              onValueChange={(value) => setType(value as "blog" | "docs")}
              defaultValue={type}
            >
              <SelectTrigger id="type" className="w-44">
                <SelectValue
                  placeholder="Type of Content"
                  defaultValue={type}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="docs">Docs</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.type && (
              <p className="text-sm text-red-500">{formErrors.type}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">
              Title<span className="text-red-500">*</span>
            </Label>
            <Input
              onChange={(e) => setTitle(e.target.value)}
              id="title"
              name="title"
            />
            {formErrors.title && (
              <p className="text-sm text-red-500">{formErrors.title}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">
              Description<span className="text-red-500">*</span>
            </Label>
            <Input
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              name="description"
            />
            {formErrors.description && (
              <p className="text-sm text-red-500">{formErrors.description}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="thumbnail">
              Thumbnail<span className="text-red-500">*</span>
            </Label>
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 relative"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("file", file);
                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });
                const data = await res.json();
                if (data.url) return;
              }}
              onClick={() =>
                document.getElementById("thumbnail-input")?.click()
              }
            >
              <input
                id="thumbnail-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("file", file);
                  // Example: POST to your API endpoint
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });
                  const data = await res.json();
                  if (data.url) return;
                }}
              />
              {coverUrl ? (
                <Image
                  width={128}
                  height={128}
                  src={coverUrl}
                  alt="cover preview"
                  className="object-cover w-full h-full rounded mb-2 border"
                />
              ) : (
                <span className="text-gray-400">
                  Drag & drop or click to upload
                </span>
              )}
            </div>
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
            {formErrors.tags && (
              <p className="text-sm text-red-500">{formErrors.tags}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onSummit}
            variant="default"
            type="submit"
            disabled={loading}
          >
            Create {loading && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
