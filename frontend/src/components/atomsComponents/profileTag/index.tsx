"use client";
import { motion } from "framer-motion";
import { Bookmark, BookOpen } from "lucide-react";
import { useState } from "react";
import { ProfileHoverTag } from "../profileHoverTag";


export const ProfileTag = ({ profileId }:{profileId?: string}) => {


  const [bookmark, setBookmark] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2 items-center justify-start gap-x-3">
       <ProfileHoverTag profileId={profileId} />
        <p className="text-sm text-muted-foreground italic">~ a month ago</p>

        <p className='text-sm text-muted-foreground italic flex items-center gap-1 font-medium '><BookOpen size={14} />165k</p>
        {/* <p className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium cursor-pointer"><ThumbsUpIcon size={16} className='//fill-muted-foreground' />165k</p> */}

        <p onClick={() => setBookmark(!bookmark)} className='text-sm text-muted-foreground italic flex items-center gap-1 font-medium cursor-pointer'>
          <motion.span
            key={bookmark ? "bookmark" : "unbookmark"}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className='text-sm text-muted-foreground italic flex items-center gap-1 font-medium cursor-pointer'
          >
            <Bookmark className={`text-muted-foreground ${bookmark && "fill-muted-foreground"}`} size={14} />
          </motion.span>165k
        </p>
      </div>
    </>
  );
};
