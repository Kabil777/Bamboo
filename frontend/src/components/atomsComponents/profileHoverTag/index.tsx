import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcnUI/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/shadcnUI/hover-card";

export function ProfileHoverTag({ profileId }: { profileId?: string }) {
    return (
        <HoverCard key={profileId} openDelay={50} closeDelay={50} >
            <HoverCardTrigger asChild>
                <p className="text-sm text-muted-foreground cursor-pointer italic w-fit">@Kowsik</p>
            </HoverCardTrigger>
            <HoverCardContent className="w-70 border-2 shadow-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80" side="right" align='start'>
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-sm font-bold text-foreground mb-4">About the Author</h3>

                    <Avatar className="w-20 h-20">
                        <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                        <AvatarFallback>VC</AvatarFallback>
                    </Avatar>
                    <h4 className="text-base font-bold text-foreground">Kowsik</h4>
                    <p className="text-sm text-muted-foreground mb-2">@Kowsik</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Passionate writer and developer sharing insights on technology and design.
                    </p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}