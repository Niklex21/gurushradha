import { useEffect, useRef, useState } from "react";

const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [divHeight, setDivHeight] = useState("auto");
  const [divTop, setDivTop] = useState<number>(0);

  const videoSource =
    "https://a-us.storyblok.com/f/1021919/x/a0c458242c/homepage.mp4";

  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        const currentDivTop = divRef.current.getBoundingClientRect().top;
        setDivTop(currentDivTop);
        const isMobile = window.innerWidth < 640;

        const video = videoRef.current;
        if (!video) return;

        const scale = window.innerWidth / video.videoWidth;
        const height = video.videoHeight * scale;

        setDivHeight(
          isMobile
            ? height.toString() + "px"
            : `calc(100vh - ${currentDivTop}px)`,
        );
      }
    };

    // wait for the page to load so that the videoRef.current is available
    setTimeout(() => {
      handleResize();
    }, 100);

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
        video.style.zIndex = "20";
        if (divRef.current) divRef.current.style.zIndex = "20";
        video.controls = true;
        video.play();
      } else {
        video.style.zIndex = "-20";
        video.controls = false;
        if (divRef.current) divRef.current.style.zIndex = "-20";
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
      className="flex relative w-full h-auto sm:h-full bg-black"
      style={{
        height: divHeight,
      }}
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
        className="w-full object-contain fixed"
        style={{
          top: divTop,
          height: divHeight,
        }}
      >
        <source src={videoSource} type="video/mp4" />
      </video>
    </div>
  );
};

export default HeroVideo;
