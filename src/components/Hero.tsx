import { useEffect, useRef } from 'react';

const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSource = "https://a-us.storyblok.com/f/1021919/x/a0c458242c/homepage.mp4";

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

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex relative w-full h-[80dvh] overflow-hidden bg-fixed">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="fixed bottom-0 left-0 w-full h-[80dvh] object-cover -z-10"
      >
        <source src={videoSource} type="video/mp4" />
      </video>
    </div>
  );
};

export default HeroVideo;