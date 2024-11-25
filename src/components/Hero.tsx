import React, { useEffect, useRef } from 'react';

const HeroVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
        className="fixed top-0 left-0 w-full h-dvh object-cover -z-10"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default HeroVideo;