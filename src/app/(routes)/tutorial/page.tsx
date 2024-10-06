"use client";

import React from "react";
import { Play, Pause, Maximize, Minimize } from "lucide-react";
import { MdOutlineForward10, MdOutlineReplay10 } from "react-icons/md";

const TutorialPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkipBack = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10; // Skip back 10 seconds
    }
  };

  const handleSkipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10; // Skip forward 10 seconds
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8  text-white min-h-screen">
      <h1 className="text-4xl font-bold mt-16 mb-8 text-center">
        How to Use Our Site
      </h1>

      <div className="relative aspect-video mb-8 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          src="/tutorial.mp4"
          className="w-full h-full object-cover"
          onEnded={() => setIsPlaying(false)}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 flex justify-between items-center">
          <button
            onClick={togglePlay}
            className="text-white hover:text-gray-300"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <div className="flex space-x-4">
            <button
              onClick={handleSkipBack}
              className="text-white hover:text-gray-300"
            >
              <MdOutlineReplay10 size={24} />
            </button>
            <button
              onClick={handleSkipForward}
              className="text-white hover:text-gray-300"
            >
              <MdOutlineForward10 size={24} />
            </button>
            <button
              onClick={handleFullscreen}
              className="text-white hover:text-gray-300"
            >
              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 text-lg">
        <p className="leading-relaxed">
          Welcome to our site! This tutorial will guide you through the main
          features and help you get started quickly. Follow along with the video
          above, and use the text below for quick reference.
        </p>
        <ol className="list-decimal list-inside space-y-4">
          <li>
            Use the main search bar to search for a class (e.g. &quot;CS
            374&quot;) or a subject (e.g. &quot;CS&quot;)
          </li>
          <li>
            On each class page, each professor links to their Rate my Professor
            information
          </li>
          <li>
            On each class page, each section&apos;s location is linked to Google
            Maps
          </li>
          <li>
            You&apos;ll find that we have a page called &quot;gen-eds,&quot; on
            this page, you can select a category of gen-ed that you have to
            fill, and the classes in that category are given to you and are
            sorted by average GPA
          </li>
          <li>
            We also have a feedback page so that you can submit things
            you&apos;d like to see on the site/any issues that you notice
          </li>
        </ol>
        <p className="leading-relaxed">
          Remember, you can always access this tutorial from the navigation menu
          if you need a refresher. Enjoy using our site!
        </p>
      </div>
    </div>
  );
};

export default TutorialPage;
