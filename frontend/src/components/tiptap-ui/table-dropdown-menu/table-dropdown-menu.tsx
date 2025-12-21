import { Button } from "@/components/shadcnUI/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu"
import { useEffect, useState } from "react"

export const TableMenu  = ({ editor }: { editor: any }) => {
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (!editor) return
    editor.on("selectionUpdate", () => {
      setShowMenu(editor.isActive("table"))
    })
  }, [editor])

  if (!showMenu) return null

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Table
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel>Columns</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
            Add column before
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
            Add column after
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>
            Delete column
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Rows</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
            Add row before
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
            Add row after
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>
            Delete row
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Table</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()}>
            Delete table
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().fixTables().run()}>
            Fix tables
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}
