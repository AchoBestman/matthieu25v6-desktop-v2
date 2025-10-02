"use client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const ListenButton = ({
  audioUrl,
  lightColor,
  darkColor,
  autoPlay,
}: {
  audioUrl: string;
  lightColor?: string;
  darkColor?: string;
  autoPlay?: boolean;
}) => {
  const color: { [key: string]: string } = {
    light: lightColor ?? "#e9d8a6",
    dark: lightColor ?? "white",
    system: darkColor ?? "#e9d8a6",
  };

  return (
    <div className="small-content">
      <AudioPlayer
        autoPlay={autoPlay}
        src={audioUrl}
        onPlay={(e) => console.log(e)}
        showSkipControls={false}
        showJumpControls={false}
        showDownloadProgress={true}
        showFilledVolume={true}
        layout="horizontal-reverse"
        style={{ backgroundColor: color.dark }}
      />
    </div>
  );
};

export default ListenButton;
