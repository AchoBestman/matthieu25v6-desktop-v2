"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import YoutubeVideo from "./youtube-embed";
import { ShowVideoModal } from "../dialog/show-video";
import { tr } from "@/translation";
interface PhotoCardProps {
  title: string;
  description?: string;
  url: string;
}

export default function VideoCard({
  title,
  description,
  url,
}: Readonly<PhotoCardProps>) {
  const [open, setOpen] = useState<boolean>(false);

  const onOpenChange = () => {
    setOpen(!open);
  };

  const videoUrl = (url: string) => {
    let videoUrl = url?.split("?list=")[1];
    if (!videoUrl) {
      videoUrl = url?.split("?v=")[1];
    }

    return videoUrl;
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-md relative -ml-2 mr-2 object-cover">
      <div className="cursor-pointer w-full">
        <YoutubeVideo videoId={videoUrl(url)} />
      </div>
      <div className="p-2 mb-10">
        <h3 className="text-customPrimary">{title}</h3>
        {/* <p>{description}</p> */}
      </div>

      {description && description.length > 10 && (
        <>
          <Button
            onClick={onOpenChange}
            className="text-white border-2 dark:border-white"
          >
            {tr("button.see_more")}
          </Button>
          <ShowVideoModal
            title={description}
            url={url}
            open={open}
            onOpenChange={onOpenChange}
          />
        </>
      )}
    </div>
  );
}
