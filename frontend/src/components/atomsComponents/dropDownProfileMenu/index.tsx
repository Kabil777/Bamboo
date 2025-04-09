import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu"
import { Avatar, AvatarImage } from '@/components/shadcnUI/avatar';
interface ProfileProps {
profile?: {
  profiledetails?: {
      title?: string;
      url?: string;
    };
  };
}

export function DropDownProfileMenu({profile}:ProfileProps) {
  const { profiledetails } = profile || {};
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild >
          <Avatar >
            <AvatarImage src={profiledetails?.url} alt="@shadcn" />
          </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 md:w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
          My Wishlist
          </DropdownMenuItem>
          <DropdownMenuItem>
          Bookmarks
          </DropdownMenuItem>
          <DropdownMenuItem>Your Blogs</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger >Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Help Center</DropdownMenuItem>
        <DropdownMenuItem disabled>Add</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500 active:text-white hover:bg-red-100 hover:text-red-500 focus:bg-red-500 focus:text-white">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}
