"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  className?: string;
}

export function ImageCarousel({ images, alt = "Project image", className }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const isMultiple = images.length > 1;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main Image Viewport */}
      <div className="relative aspect-video w-full rounded-lg border border-border/70 bg-card overflow-hidden group select-none">
        <img
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          className="w-full h-full object-cover object-center transition-all duration-300"
        />

        {/* Carousel Prev/Next Controls */}
        {isMultiple && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 backdrop-blur-xs border border-border/60 text-foreground opacity-80 hover:opacity-100 hover:bg-background transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 backdrop-blur-xs border border-border/60 text-foreground opacity-80 hover:opacity-100 hover:bg-background transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Slide Counter Badge */}
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[11px] font-mono bg-background/80 backdrop-blur-xs border border-border/60 text-muted-foreground">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails row if multiple images */}
      {isMultiple && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative h-14 w-20 rounded-md border overflow-hidden shrink-0 transition-all duration-150 cursor-pointer",
                currentIndex === idx
                  ? "border-foreground ring-1 ring-ring opacity-100"
                  : "border-border/60 opacity-60 hover:opacity-90 hover:border-border"
              )}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
