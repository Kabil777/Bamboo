'use client';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { Card, CardContent, CardTitle, CardDescription } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { ProfileTag } from '@/components/atomsComponents';
interface BlogCardProps {
    id?: string;
    title?: string;
    description?: string;
    imageUrl?: string | StaticImport;
    profileId?: string;

}

export const BlogCard: React.FC<BlogCardProps> = ({
    id = '1',
    title = '8 Psychology-Based Design Hacks',
    description = `If the first too, now that we're on the same page, let's end this article here. Cheers!`,
    imageUrl = 'https://im.indiatimes.in/content/2024/Jul/sergey-zolkin-_UeY8aTI6d0-unsplash_66a4c01462fc8.jpg',
    profileId = 'author1',

}) => {


    return (
        <div key={id} >
            <Card className="shadow-none rounded-none overflow-hidden items-center p-2 sm:p-4 gap-2 border-none transition duration-200 ease-in-out" >
                <CardContent className="p-0 w-full grid grid-cols-5 items-center gap-2 md:gap-5 justify-between">
                    <div className="p-0 col-span-full sm:row-start-1 sm:col-span-3 flex flex-col gap-0 md:gap-2">
                        <CardTitle className="text-base md:text-2xl font-semibold line-clamp-2">{title}</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 text-xs md:text-sm">
                            {description}
                        </CardDescription>
                        <ProfileTag profileId={profileId} />
                        <div className="flex flex-wrap gap-2 mt-3">
                            <Badge className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200">Design</Badge>
                            <Badge className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200">UI</Badge>
                            <Badge className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200">Shadcn</Badge>
                        </div>
                    </div>
                    <Image
                        src={imageUrl}
                        alt="Card Image"
                        width={300}
                        height={300}
                        className="sm:col-span-2 row-start-1 sm: col-span-full w-full max-h-[160px] rounded-lg m-auto"
                        style={{ aspectRatio: "300/300", objectFit: "cover" }}
                        
                    />
                </CardContent>
            </Card >
            <br />
            <hr />
            <br />
        </div >
    );
};
