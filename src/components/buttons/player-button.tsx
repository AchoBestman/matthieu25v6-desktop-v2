"use client";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useLangue } from "@/context/langue-context";
import { tr } from "@/translation";
import { XCircle } from "lucide-react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const SongPlayer = ({
  lightColor,
  darkColor,
}: {
  lightColor?: string;
  darkColor?: string;
}) => {
  const color: { [key: string]: string } = {
    light: lightColor ?? "#e9d8a6",
    dark: lightColor ?? "white",
    system: darkColor ?? "#e9d8a6",
  };
  const {lng} = useLangue()
  const {
    audioUrl,
    autoPlay,
    audioTitle,
    playNext,
    playPrevious,
    audioRef,
    setAudio,
    setPlay,
    play,
    playedAudioUrl,
  } = useAudioPlayer();
  if (!audioUrl) return null;

  const handleRemovePlayer = () => {
    const confirmed = confirm(tr("alert.stop_playing"));
    if (confirmed) {
      audioRef.current?.pause();
      setAudio("", "", 0, undefined, undefined);
    }
  };

  return (
    <div
      className={`audio-player-wrapper ${play ? "playing" : ""} ${playedAudioUrl ? "" : "hidden"}`}
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        zIndex: "10",
        width: "72.3%",
        border: "2px solid #7b3d1a",
      }}
    >
      {playedAudioUrl && (
        <AudioPlayer
          autoPlay={autoPlay}
          src={playedAudioUrl}
          showSkipControls={true}
          showJumpControls={false}
          showDownloadProgress={true}
          showFilledVolume={true}
          layout="horizontal-reverse"
          onListen={() => {
            if (audioRef.current) {
              setPlay?.(true);
            }
          }}
          onPause={() => {
            if (audioRef.current) setPlay?.(false);
          }}
          onEnded={() => playNext?.(lng)}
          onPlay={(e) => console.log(e)}
          onClickPrevious={() => {
            playPrevious?.(lng);
          }}
          onClickNext={() => {
            playNext?.(lng);
          }}
          customAdditionalControls={[
            <div
              key="title"
              style={{
                fontWeight: "lighter",
                fontStyle: "italic",
                color: "#7b3d1a",
                fontSize: "13px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <span>
                {audioTitle.substring(0, 50)}
                {audioTitle.length > 50 ? "..." : ""}
              </span>
              <XCircle
                onClick={handleRemovePlayer}
                className="h-9 w-9 text-red-700 cursor-pointer"
              ></XCircle>
            </div>,
          ]}
          style={{
            backgroundColor: color.dark,
          }}
        />
      )}
    </div>
  );
};

export default SongPlayer;
