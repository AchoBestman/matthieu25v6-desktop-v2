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
    <div className="relative shadow-md">
      <div className="rounded-lg overflow-hidden relative">
        <div
          className="h-60 relative cursor-pointer"
          onClick={() => setImageModalOpen(true)}
        >
          <img
            src={url}
            alt="background"
            className="w-full h-auto object-contain"
          />
        </div>

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
      <div className="p-2 mb-10">
        {title ? (
          <p className="text-customPrimary">{title}</p>
        ) : (
          <p>{description}</p>
        )}
      </div>
      {description && (
        <Button
          onClick={onOpenChange}
          className="bg-pkp-ocean dark:bg-black text-white border-2 dark:border-white"
        >
          {tr("button.see_more")}
        </Button>
      )}
    </div>
  );
}
