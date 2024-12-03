import type { MultiassetStoryblok } from "@/component-types";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";

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

  const goToPreviousSlide = useCallback(() => {
    setPrevIndex(currentIndex);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1,
    );
  }, [currentIndex, slides.length, setPrevIndex, setCurrentIndex]);

  const goToNextSlide = useCallback(() => {
    setPrevIndex(currentIndex);
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1,
    );
  }, [currentIndex, slides.length, setPrevIndex, setCurrentIndex]);

  const goToSlide = useCallback(
    (index: number) => {
      setPrevIndex(currentIndex);
      setCurrentIndex(index);
    },
    [setPrevIndex, setCurrentIndex, currentIndex],
  );

  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  if (currentSlide.filename === null) {
    return <></>;
  }

  return (
    <div className="group w-full relative overflow-hidden h-full min-h-96 flex items-center justify-center">
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
                playsInline
                className="w-full h-auto rounded-xl"
                src={slide.filename}
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget as HTMLVideoElement;
                  video.volume = 0.5;
                }}
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

      {/* Navigation Arrows */}
      <button
        onClick={goToPreviousSlide}
        className="sm:invisible sm:group-hover:visible absolute left-2 top-1/2 transform -translate-y-1/2 bg-foreground bg-opacity-50 text-background p-2 rounded-full"
      >
        <ChevronLeftIcon />
      </button>
      <button
        onClick={goToNextSlide}
        className="sm:invisible sm:group-hover:visible absolute right-2 top-1/2 transform -translate-y-1/2 bg-foreground bg-opacity-50 text-background p-2 rounded-full"
      >
        <ChevronRightIcon />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full scale-100 transition-all duration-200 hover:scale-150 ${
              index === currentIndex ? "bg-background" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
