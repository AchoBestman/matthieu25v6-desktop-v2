"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShowPhotoModal } from "../dialog/show-photo";
import { tr } from "@/translation";
import { FullscreenImageModal } from "@/components/dialog/fullscreen-image-modal";

interface PhotoCardProps {
  title: string;
  description?: string;
  url: string;
}

export default function PhotoCard({
  title,
  description,
  url,
}: Readonly<PhotoCardProps>) {
  const [open, setOpen] = useState<boolean>(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const onOpenChange = () => {
    setOpen(!open);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-md relative">
      <div
        className="h-60 relative cursor-pointer"
        onClick={() => setImageModalOpen(true)}
      >
        <img src={url} alt="background" className="object-cover" />
      </div>
      <div className="p-2 mb-10">
        <h3 className="text-customPrimary">{title}</h3>
        <p>{description}</p>
      </div>
      <Button
        onClick={onOpenChange}
        className="text-white border-2 dark:border-white"
      >
        {tr("button.see_more")}
      </Button>

      <ShowPhotoModal
        title={description as string}
        url={url}
        open={open}
        onOpenChange={onOpenChange}
      />

      {/* Fullscreen Image Modal */}
      <FullscreenImageModal
        url={url}
        open={imageModalOpen}
        onOpenChange={setImageModalOpen}
      />
    </div>
  );
}
