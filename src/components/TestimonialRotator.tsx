import type { HomeTestimonialStoryblok } from "@/component-types";
import { useEffect, useState, useRef } from "react";

function TestimonialRotator({
  testimonials,
}: {
  testimonials: HomeTestimonialStoryblok[];
}) {
  const [current, setCurrent] = useState(0);
  const [position, setPosition] = useState<{ top: string; left: string }>({
    top: "0px",
    left: "0px",
  });
  const [fadeIn, setFadeIn] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });

  // Calculate display duration based on word count
  function getDisplayDuration(text: string) {
    const words = text.trim().split(/\s+/).length;
    const timePerWord = 300; // milliseconds per word
    const minDuration = 5000; // minimum duration in milliseconds
    return Math.max(words * timePerWord, minDuration);
  }

  // Get random position within container bounds
  function getRandomPosition() {
    const maxTop = containerSize.height - textSize.height;
    const maxLeft = containerSize.width - textSize.width;
    return {
      top: `${Math.random() * maxTop}px`,
      left: `${Math.random() * maxLeft}px`,
    };
  }

  // Measure dimensions after render
  useEffect(() => {
    if (containerRef.current && textBlockRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const textRect = textBlockRef.current.getBoundingClientRect();

      setContainerSize({
        width: containerRect.width,
        height: containerRect.height,
      });
      setTextSize({
        width: textRect.width,
        height: textRect.height,
      });
    }
  }, [current, testimonials]);

  // Update position when sizes are available
  useEffect(() => {
    if (containerSize.width > 0 && textSize.width > 0) {
      setPosition(getRandomPosition());
    }
  }, [containerSize, textSize]);

  useEffect(() => {
    const currentTestimonial = testimonials[current];
    const displayDuration = getDisplayDuration(currentTestimonial.text);
    const fadeDuration = 1000; // Duration of fade-out animation in milliseconds

    const timer = setTimeout(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
        setFadeIn(true);
      }, fadeDuration);
    }, displayDuration);

    return () => clearTimeout(timer);
  }, [current, testimonials]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#FEFCF5] p-8 overflow-hidden"
    >
      <div
        ref={textBlockRef}
        className={`absolute transition-opacity duration-1000 max-w-prose ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
        style={position}
      >
        <blockquote className="text-xl">
          “{testimonials[current].text}”
        </blockquote>
        <p className="text-sm mt-2">
          - {testimonials[current].person_name}
          {testimonials[current].relation_to_gs
            ? `, ${testimonials[current].relation_to_gs}`
            : ""}
        </p>
      </div>
    </div>
  );
}

export default TestimonialRotator;