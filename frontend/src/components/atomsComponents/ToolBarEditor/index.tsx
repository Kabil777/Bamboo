"use client";

import * as React from "react";
import { useEditor } from "@tiptap/react";

// --- UI Primitives ---
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover";
import { LinkPopover } from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

import { MenuBar } from "@/components/ui/editorComponent/customBlock";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/shadcnUI/avatar";
import { userAwareness } from "@/hooks/useCollabrationAwareness";
import { Button as ShanBtn } from "@/components/shadcnUI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/shadcnUI/hover-card";

interface MainToolbarContentProp {
  usersOnline?: userAwareness[];
  totalUsers?: number;
  onSave: () => void;
  editor: ReturnType<typeof useEditor> | null;
}

const MainToolbarContent = ({
  onSave,
  editor,
  usersOnline,
  totalUsers,
}: MainToolbarContentProp) => {
  const [open, setOpen] = React.useState<boolean>(false);
  console.log("usersOnline", usersOnline);
  console.log("totalUsers", totalUsers);
  return (
    <>
      <Spacer />
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>
      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
        <BlockquoteButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
      </ToolbarGroup>
      <ToolbarSeparator />

      <ToolbarGroup>
        <MenuBar editor={editor} />
        <ColorHighlightPopover />
        <LinkPopover />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <AvatarGroup className="flex items-center">
        {usersOnline?.slice(0, 2).map((user) => (
          <HoverCard key={user.userId} openDelay={10} closeDelay={100}>
            <HoverCardTrigger asChild>
              <ShanBtn variant="ghost" size="icon" className="rounded-full">
                <Avatar className="overflow-visible">
                  {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                  <AvatarFallback>
                    {user.name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                  <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                </Avatar>
              </ShanBtn>
            </HoverCardTrigger>
            <HoverCardContent className="flex w-fit flex-col gap-0.5">
              <div className="flex items-center gap-3">
              <Avatar className="overflow-visible">
                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                <AvatarFallback>
                  {user.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
              </Avatar>
              <div className="flex flex-col">
              <div className="text-sm font-medium leading-none">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                {user.userId}
              </div>
              </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
        {usersOnline && usersOnline.length > 2 && (
          <HoverCard key={usersOnline[2].userId} openDelay={10} closeDelay={100}>
            <HoverCardTrigger asChild>
              <ShanBtn variant="ghost" size="icon" className="rounded-full">
                <Avatar className="overflow-visible">
                  <AvatarFallback>+{usersOnline.length - 2}</AvatarFallback>
                </Avatar>
              </ShanBtn>
            </HoverCardTrigger>
            <HoverCardContent className="flex w-fit flex-col gap-0.5">
              {usersOnline.slice(2).map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center gap-3 pb-2"
                >
                  <Avatar className="overflow-visible">
                    {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                    <AvatarFallback>
                      {user.name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                    <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="text-sm font-medium leading-none">
                      {user.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.clientId}
                    </div>
                  </div>
                </div>
              ))}
            </HoverCardContent>
          </HoverCard>
        )}
      </AvatarGroup>
      {/* <TableDropdownMenu editor={editor} /> */}

      {/* <ToolbarSeparator /> */}

      {/* <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup> */}

      {/* <ToolbarSeparator /> */}

      <Spacer />
    </>
  );
};

export default MainToolbarContent;
