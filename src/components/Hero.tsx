import { useEffect, useRef, useState } from "react";

const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [divHeight, setDivHeight] = useState("auto");

  const videoSource =
    "https://a-us.storyblok.com/f/1021919/x/a0c458242c/homepage.mp4";

  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        const divTop = divRef.current.getBoundingClientRect().top;
        setDivHeight(`calc(100vh - ${divTop}px)`);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleScroll = () => {
      if (window.scrollY === 0) {
        video.play();
      } else {
        video.pause();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={divRef}
      className="flex relative w-full overflow-hidden bg-fixed"
      style={{ height: divHeight }}
    >
      <video
        ref={videoRef}
        loop
        controls
        autoPlay
        playsInline
        onPlay={() => {
          if (videoRef.current) {
            videoRef.current.play();
          }
        }}
        className="w-full h-auto object-contain"
      >
        <source src={videoSource} type="video/mp4" />
      </video>
    </div>
  );
};

export default HeroVideo;
