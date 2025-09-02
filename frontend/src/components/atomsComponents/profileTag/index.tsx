"use client";
import React, { useState } from "react";
import { Avatar, AvatarImage } from "@/components/shadcnUI/avatar";
import { BsThreeDots } from "react-icons/bs";
import { IoIosShareAlt, IoMdBookmark } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/shadcnUI/button";
import { Separator } from "@/components/shadcnUI/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcnUI/dialog";
import { Input } from "@/components/shadcnUI/input";
import { Label } from "@/components/shadcnUI/label";
import { Check, Copy } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcnUI/popover";
import { BiSolidLike } from "react-icons/bi";
export const ProfileTag = () => {
  const [like, setLike] = useState(false);
  const [bookmark, setBookmark] = useState(false);

  const [copied, setCopied] = useState(false);
  const [follow, setFollow] = useState(false);
  const handleCopy = () => {
    const input = document.getElementById("link") as HTMLInputElement | null;
    if (!input) return;

    const textToCopy = input.value;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      input.select();
      input.setSelectionRange(0, 99999);
      try {
        const success = document.execCommand("copy");
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  return (
    <>
      <div className="w-full flex sm:gap-3 items-center justify-between">
        <div className="flex gap-1.5 sm:gap-3 items-center justify-between">
          <Avatar className="sm:h-[40px] sm:w-[40px] h-[35px] w-[35px]">
            <AvatarImage src="https://github.com/shadcn.png" alt="profile" />
          </Avatar>
          <div>
            <div className="flex h-5 items-center space-x-1 sm:space-x-2 text-[10px] sm:text-xs font-medium text-accent-foreground">
              <h3 className="text-xs sm:text-sm font-semibold tracking-wider space-x-2">
                Example
              </h3>
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: follow
                    ? "hsl(var(--accent-foreground))"
                    : "hsl(var(--foreground))",
                  scale: 1,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button
                  onClick={() => setFollow(!follow)}
                  className="p-1 py-0.5 h-fit text-[10px] sm:text-xs font-normal "
                >
                  <motion.span
                    key={follow ? "followed" : "follow"}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {follow ? "Followed" : "Follow"}
                  </motion.span>
                </Button>
              </motion.div>
            </div>
            <div className="flex h-5 items-center space-x-1 sm:space-x-2 text-[8px] sm:text-xs font-medium text-accent-foreground">
              <div>React - Spring Boot </div>
              <Separator orientation="vertical" />
              <div >23 Jan 2025</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <motion.div whileTap={{ scale: 1.1 }} className="w-fit">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLike(!like)}
              className={`h-[25px] sm:h-[30px] w-fit shadow-none rounded-md flex items-center gap-1 px-1 sm:px-2 text-[10px] sm:text-xs transition-all duration-300 ease-in-out ${
                like ? "text-foreground" : "text-accent-foreground/50"
              }`}
            >
              <motion.span
                key={like ? "liked" : "unliked"}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <BiSolidLike
                  className={`size-[14px] sm:size-[18px] transition duration-200 ${
                    like ? "text-foreground" : "text-accent-foreground/50"
                  }`}
                />
              </motion.span>
              <span>109M</span>
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 1.1 }} className="w-fit h-fit">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setBookmark(!bookmark)}
              className="w-[25px] h-[25px] sm:w-[30px] sm:h-[30px] shadow-none rounded-md transition-all"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={bookmark ? "bookmarked" : "unbookmarked"}
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  exit={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <IoMdBookmark
                    className={`size-[14px] sm:size-[18px] transition-colors duration-300 ${
                      bookmark ? "text-foreground" : "text-accent-foreground/50"
                    }`}
                  />
                </motion.span>
              </AnimatePresence>
            </Button>
          </motion.div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-[25px] h-[25px] sm:w-[30px] sm:h-[30px] shadow-none rounded-md hover:scale-110"
              >
                <BsThreeDots />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1 w-fit z-5 mr-3">
              <div className="hover:bg-accent data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                <IoIosShareAlt />
                Share
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="hover:bg-accent data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                    <IoIosShareAlt />
                    Share
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                      Anyone who has this link will be able to view this.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="link" className="sr-only">
                        Link
                      </Label>
                      <Input id="link" defaultValue="copy here" readOnly />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="px-3 relative flex items-center justify-center transition-all"
                      onClick={handleCopy}
                    >
                      <span className="sr-only">Copy</span>
                      <span
                        className={`absolute transition-all duration-300 ease-in-out ${
                          copied
                            ? "opacity-0 scale-90"
                            : "opacity-100 scale-110"
                        }`}
                      >
                        <Copy />
                      </span>

                      <span
                        className={`transition-all duration-300 ease-in-out ${
                          copied
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-90"
                        }`}
                      >
                        <Check className="text-green-500" />
                      </span>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
};
