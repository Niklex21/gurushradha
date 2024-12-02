import { useState, useEffect } from "react";
import { type InstagramPost as InstagramPostType } from "@/types";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button";

interface InstagramPostProps {
  post: InstagramPostType;
}

export default function InstagramPost({ post }: InstagramPostProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === post.children?.length! - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? post.children?.length! - 1 : prevIndex - 1,
    );
  };

  return (
    <a
      href={post.permalink}
      target="_blank"
      className="flex-none h-80 group hover:brightness-90"
    >
      {post.media_type === "CAROUSEL_ALBUM" ? (
        <div className="relative h-full w-auto rounded-xl">
          <div className="absolute inset-0 flex z-10 top-1/2 -translate-y-1/2 items-center justify-between mx-2 sm:opacity-10 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={(e) => {
                prevSlide();
                e.preventDefault();
              }}
              variant={"ghost"}
              size="icon"
              className="bg-background rounded-xl hover:brightness-90 text-foreground"
            >
              <ChevronLeftIcon className="" />
            </Button>
            <Button
              onClick={(e) => {
                nextSlide();
                e.preventDefault();
              }}
              size="icon"
              variant={"ghost"}
              className="bg-background rounded-xl hover:brightness-90 text-foreground"
            >
              <ChevronRightIcon />
            </Button>
          </div>
          {post.children?.map((child, index) => (
            <div
              key={child.id}
              className={`${
                index === currentIndex ? "block" : "hidden"
              } h-full w-auto relative`}
            >
              {child.media_type === "VIDEO" ? (
                <video
                  src={child.media_url}
                  controls
                  className="h-full aspect-square rounded-xl object-cover"
                />
              ) : (
                <img
                  src={child.media_url}
                  alt={post.caption}
                  className="h-full aspect-square rounded-xl object-cover"
                />
              )}
            </div>
          ))}
        </div>
      ) : post.media_type === "VIDEO" ? (
        <video
          src={post.media_url}
          controls
          className="h-full aspect-square rounded-xl object-cover"
        />
      ) : (
        <img
          src={post.media_url}
          alt={post.caption}
          className="h-full aspect-square rounded-xl object-cover"
        />
      )}
      <div className="absolute top-0 rounded-t-xl left-0 w-full bg-black bg-opacity-50 text-background p-4 opacity-0 group-hover:opacity-100 sm:opacity-0 transition-opacity">
        <span className="line-clamp-2">{post.caption}</span>
      </div>
    </a>
  );
}
