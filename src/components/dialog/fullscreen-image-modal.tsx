"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import {
  AlertDialogCancel,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";
import { tr } from "@/translation";

interface FullscreenImageModalProps {
  url: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FullscreenImageModal({
  url,
  open,
  onOpenChange,
}: Readonly<FullscreenImageModalProps>) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="p-0 bg-black max-w-full w-full h-full flex items-center justify-center">
        <AlertDialogHeader>
          <AlertDialogTitle></AlertDialogTitle>
        </AlertDialogHeader>
        <div className="relative w-full h-full">
          <img src={url} alt="fullscreen" className="object-contain" />
        </div>
        <AlertDialogFooter className="">
          <AlertDialogCancel className="capitalize outline-none pr-2">
            <Button className="text-white">{tr("button.close")}</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
