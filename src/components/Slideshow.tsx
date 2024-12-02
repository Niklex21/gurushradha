import type { MultiassetStoryblok } from "@/component-types";
import React, { useState, useEffect, useRef } from "react";

type SlideshowProps = {
  slides: MultiassetStoryblok;
};

const isVideo = (filename: string) => /\.(mp4|webm|ogg)$/i.test(filename);

export default function Slideshow({ slides }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const currentSlide = slides[currentIndex];

    if (currentSlide.filename === null) return;

    let timer: NodeJS.Timeout;

    const handleEnded = () => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1,
      );
    };

    if (isVideo(currentSlide.filename)) {
      const video = videoRef.current;
      if (video) {
        video.play();
        video.addEventListener("ended", handleEnded);
        return () => {
          video.pause();
          video.removeEventListener("ended", handleEnded);
        };
      }
    } else {
      timer = setTimeout(() => {
        handleEnded();
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentIndex]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  if (currentSlide.filename === null) {
    return <></>;
  }

  return (
    <div className="relative rounded-xl overflow-hidden h-full flex items-center justify-center">
      {slides.map((slide, index) => {
        const isCurrent = index === currentIndex;
        const wasCurrent = index === prevIndex;
        const isVisible = isCurrent || wasCurrent;
        if (
          !isVisible ||
          currentSlide.filename === null ||
          slide.filename === null
        )
          return null;

        return (
          <div
            key={slide.id}
            className={`absolute top-1/2 left-0 -translate-y-1/2 w-full h-auto transition-opacity duration-500 ${
              isCurrent ? "opacity-100" : "opacity-0"
            }`}
          >
            {isVideo(currentSlide.filename) ? (
              <video
                ref={isCurrent ? videoRef : undefined}
                controls
                className="w-full h-auto rounded-xl"
                src={slide.filename}
              />
            ) : (
              <img
                src={slide.filename}
                alt={slide.alt ?? ""}
                className="w-full h-auto rounded-xl"
              />
            )}
            {slide.title && (
              <div className="absolute bottom-0 left-0 bg-background bg-opacity-50 text-foreground p-4">
                <h3 className="text-lg font-bold">{slide.title}</h3>
                <p>{slide.name}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
