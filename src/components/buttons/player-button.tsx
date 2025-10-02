"use client";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useLangue } from "@/context/langue-context";
import { tr } from "@/translation";
import { XCircle } from "lucide-react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { handleConfirmAlert } from "@/lib/alert-confirm-options";

const SongPlayer = ({
  lightColor,
  darkColor,
}: {
  lightColor?: string;
  darkColor?: string;
}) => {
  const color: { [key: string]: string } = {
    light: lightColor ?? "#a0a83b",
    dark: lightColor ?? "#a0a83b",
    system: darkColor ?? "#a0a83b",
  };
  const { lng } = useLangue();
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
    albumId,
    playedAudioUrl,
  } = useAudioPlayer();
  if (!audioUrl) return null;

  const handleRemovePlayer = () => {
    handleConfirmAlert(
      tr("alert.stop_playing"),
      false,
      handleRemovePlayerConfirm
    );
  };

  const handleRemovePlayerConfirm = () => {
    audioRef.current?.pause();
    setAudio("", "", 0);
  };

  return (
    <div
      className={`audio-player-wrapper ${play ? "playing" : ""} ${
        playedAudioUrl ? "" : "hidden"
      }`}
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        zIndex: "10",
        width: "72.3%",
        border: "2px solid #a0a83b",
      }}
    >
      {playedAudioUrl && (
        <AudioPlayer
          ref={(element) => {
            if (element?.audio?.current) {
              (audioRef as any).current = element.audio.current;
            }
          }}
          autoPlay={autoPlay}
          src={playedAudioUrl}
          showSkipControls={true}
          showJumpControls={false}
          showDownloadProgress={true}
          showFilledVolume={true}
          layout="horizontal-reverse"
          onListen={() => {
            if (audioRef.current) {
              if (albumId) {
                setPlay?.(true, "Hymns");
              } else {
                setPlay?.(
                  true,
                  audioTitle.includes(" : ") ? "Sermons" : "Others"
                );
              }
            }
          }}
          onPause={() => {
            if (audioRef.current) {
              if (albumId) {
                setPlay?.(false, "Hymns");
              } else {
                setPlay?.(
                  false,
                  audioTitle.includes(" : ") ? "Sermons" : "Others"
                );
              }
            }
          }}
          onEnded={() => {
            if (albumId) {
              playNext?.(lng, "Hymns");
            } else {
              playNext?.(
                lng,
                audioTitle.includes(" : ") ? "Sermons" : "Others"
              );
            }
          }}
          onPlay={(e) => console.log(e, "onPlay")}
          onClickPrevious={() => {
            if (albumId) {
              playPrevious?.(lng, "Hymns");
            } else {
              playPrevious?.(
                lng,
                audioTitle.includes(" : ") ? "Sermons" : "Others"
              );
            }
          }}
          onClickNext={() => {
            if (albumId) {
              playNext?.(lng, "Hymns");
            } else {
              playNext?.(
                lng,
                audioTitle.includes(" : ") ? "Sermons" : "Others"
              );
            }
          }}
          customAdditionalControls={[
            <div
              key="title"
              style={{
                fontWeight: "bold",
                fontStyle: "italic",
                color: "dark",
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
                className="h-9 w-9 text-pkp-ocean cursor-pointer"
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
