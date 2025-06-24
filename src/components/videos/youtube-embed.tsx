// pages/index.js

import YouTube, { YouTubeEvent } from "react-youtube";

export default function YoutubeVideo({
  videoId,
  height = "400px",
  width = "100%",
}: Readonly<{
  videoId: string;
  height?: number | string;
  width?: number | string;
}>) {
  const opts = {
    height,
    width,
    playerVars: {
      autoplay: 0,
    },
  };
  console.log(opts);
  function onReady(event: YouTubeEvent) {
    event.target.pauseVideo();
  }

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      className="w-full"
      onReady={onReady}
    />
  );
}
