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
import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, X } from "lucide-react";
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
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Réinitialiser le zoom et la position quand le modal s'ouvre
  useEffect(() => {
    if (open) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [open]);

  // Fonctions de zoom
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 5));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 1));
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Gestion du drag pour déplacer l'image zoomée
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Gestion du zoom avec la molette de la souris
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // Zoom in
      setScale((prev) => Math.min(prev + 0.1, 5));
    } else {
      // Zoom out
      setScale((prev) => Math.max(prev - 0.1, 1));
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        style={{
          // Forcer les dimensions et la position
          width: "100vw",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
        }}
        className="p-0 bg-black border-none max-w-none w-screen h-screen rounded-none"
      >
        <AlertDialogHeader className="sr-only">
          <AlertDialogTitle>Image en plein écran</AlertDialogTitle>
        </AlertDialogHeader>

        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          ref={containerRef}
        >
          <button
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <img
              ref={imageRef}
              src={url}
              alt="fullscreen"
              className="object-contain cursor-move select-none"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? "none" : "transform 0.2s ease",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          </button>
        </div>

        <AlertDialogFooter className="absolute bottom-8 right-4 flex gap-2 bg-black/50 p-2 rounded-lg">
          <Button
            variant="outline"
            size="icon"
            onClick={zoomIn}
            className="text-white bg-transparent border-white/20 hover:bg-white/10"
            title={tr("button.zoom_in")}
          >
            <ZoomIn size={20} />
          </Button>

          <Button
            title={tr("button.zoom_out")}
            variant="outline"
            size="icon"
            onClick={zoomOut}
            className="text-white bg-transparent border-white/20 hover:bg-white/10"
            disabled={scale <= 1}
          >
            <ZoomOut size={20} />
          </Button>

          <Button
            title={tr("button.reset_zoom")}
            variant="outline"
            size="icon"
            onClick={resetZoom}
            className="text-white bg-transparent border-white/20 hover:bg-white/10"
            disabled={scale === 1 && position.x === 0 && position.y === 0}
          >
            <RotateCcw size={20} />
          </Button>
          <AlertDialogCancel className="outline-none">
            <Button
              title={tr("button.close")}
              variant="outline"
              size="icon"
              className="text-white bg-transparent border-white/20 hover:bg-white/10"
            >
              <X size={20} />
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
