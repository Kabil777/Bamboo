'use client';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { Card, CardContent, CardTitle, CardDescription } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
    import { ProfileTag } from '@/components/atomsComponents';
interface BlogCardProps {
    title?: string;
    description?: string;
    imageUrl?: string | StaticImport;
}

export const BlogCard: React.FC<BlogCardProps> = ({
    title = '8 Psychology-Based Design Hacks That Will Make You A Better UX Designer',
    description = `If the first thought that crossed your mind when you read the title of the article was "What does Psychology has to do with UX Design?" then, yes, that's what we thought too, now that we're on the same page, let's end this article here. Cheers!`,
    imageUrl = 'https://im.indiatimes.in/content/2024/Jul/sergey-zolkin-_UeY8aTI6d0-unsplash_66a4c01462fc8.jpg',
}) => {



    return (
        <div >
            <Card className="shadow-none rounded-none overflow-hidden items-center p-2 sm:p-4 gap-2 border-none transition duration-200 ease-in-out" >
                <ProfileTag />

                <CardContent className="p-0 w-full grid grid-cols-5 items-center gap-2 md:gap-5 justify-between">
                    <div className="p-0 col-span-full sm:row-start-1 sm:col-span-3 flex flex-col gap-0 md:gap-2">
                        <CardTitle className="text-base md:text-2xl font-semibold line-clamp-2">{title}</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 text-xs md:text-sm">
                            {description}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2 mt-4">
                            <Badge className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200">Design</Badge>
                            <Badge className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200">UI</Badge>
                            <Badge className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200">Shadcn</Badge>
                        </div>

                    </div>
                    <Image
                        src={imageUrl}
                        alt="Card Image"
                        width={300}
                        height={200}
                        className="sm:col-span-2 row-start-1 sm: col-span-full w-full max-h-[160px] rounded-lg m-auto"
                        style={{ aspectRatio: "300/200", objectFit: "cover" }}
                    />
                </CardContent>
            </Card >
            <br />
            <hr />
            <br />
        </div >
    );
};
