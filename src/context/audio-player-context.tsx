"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
  useEffect,
} from "react";
import { findNextSong, findPreviousSong } from "@/lib/resources/song";
import { AudioFolder, getLocalFilePath } from "@/lib/utils";
import { tr } from "@/translation";
import { useLangue } from "./langue-context";
import { handleConfirmAlert } from "@/lib/alert-confirm-options";

type AudioContextType = {
  audioUrl: string | null;
  audioTitle: string;
  autoPlay: boolean;
  audioId?: number;
  albumId?: number;
  play?: boolean;
  playedAudioUrl?: string;
  isDownloaded?: boolean;
  setAudio: (
    url: string,
    audioTitle: string,
    audioId: number,
    albumId?: number,
    autoPlay?: boolean
  ) => void;
  playNext?: (lng: string, subFolder: AudioFolder) => void;
  setPlay?: (play: boolean, subFolder: AudioFolder) => void;
  playPrevious?: (lng: string, subFolder: AudioFolder) => void;
  togglePlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
};

const AudioPlayerContext = createContext<AudioContextType | null>(null);

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx)
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
};

export function AudioPlayerProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { lng } = useLangue();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [audioTitle, setAudioTitle] = useState<string>("");
  const [audioId, setAudioId] = useState<number | undefined>();
  const [albumId, setAlbumId] = useState<number | undefined>();
  const [playedAudioUrl, setPlayedAudioUrl] = useState<string>("");
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [play, setPlay] = useState<boolean>(false);

  useEffect(() => {
    if (audioId && audioTitle && audioUrl) {
      if (albumId) {
        fileUrl(audioUrl, audioTitle, lng, "Hymns");
      } else {
        fileUrl(
          audioUrl,
          audioTitle,
          lng,
          audioTitle.includes(" : ") ? "Sermons" : "Others"
        );
      }
    }
    return () => {};
  }, [audioUrl, audioTitle, audioId, albumId, autoPlay]);

  const setAudio = (
    url: string,
    title: string,
    audioId: number,
    albumId?: number,
    autoPlay = false
  ) => {
    setAudioUrl(url);
    setAutoPlay(autoPlay);
    setAudioTitle(title);
    setAlbumId(albumId);
    setAudioId(audioId);
  };

  const playNext = async (lng: string, subFolder: AudioFolder) => {
    if (audioId) {
      const response = await findNextSong(lng, audioId, albumId);
      const [song] = response as { [key: string]: string | number }[];
      const title = song.album_id
        ? song.title.toString()
        : `${song.chapter.toString()} : ${song.title.toString()}`;
      const canPlay = await getCanPlay(title, subFolder).catch(() => {
        handleConfirmAlert(tr("alert.cannot_download"))
      });

      if (song && canPlay) {
        setAudioUrl(song.audio.toString());
        setAutoPlay(true);
        setAudioTitle(title);
        setAlbumId(song.album_id as number);
        setAudioId(song.id as number);
      }
    }
  };

  const playPrevious = async (lng: string, subFolder: AudioFolder) => {
    if (audioId) {
      const response = await findPreviousSong(lng, audioId, albumId);
      const [song] = response as { [key: string]: string | number }[];
      const title = song.album_id
        ? song.title.toString()
        : `${song.chapter.toString()} : ${song.title.toString()}`;
      const canPlay = await getCanPlay(title, subFolder).catch(() => {
        handleConfirmAlert(tr("alert.cannot_download"))
      });

      if (song && canPlay) {
        setAudioUrl(song.audio.toString());
        setAutoPlay(true);
        setAudioTitle(title);
        setAlbumId(song.album_id as number);
        setAudioId(song.id as number);
      }
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const getCanPlay = async (audioFileName: string, subFolder: AudioFolder) => {
    if (!navigator.onLine) {
      await getLocalFilePath(lng, subFolder, audioFileName.replace(" : ", "_"));

      return true;
    }

    return true;
  };

  const fileUrl = async (
    audio: string,
    audioFileName: string,
    lng: string,
    subFolder: AudioFolder
  ) => {
    // Custom char map

    try {
      // Read all entries in Downloads directory
      const fileName = await getLocalFilePath(
        lng,
        subFolder,
        audioFileName.replace(" : ", "_")
      );

      setPlayedAudioUrl(fileName);
      setIsDownloaded(true);
    } catch (error) {
      if (!navigator.onLine) {
        handleConfirmAlert(tr("alert.cannot_download"))
        audioRef.current?.pause();
        setAudio("", "", 0);
        return;
      }
      console.log(error, "error file");
      setPlayedAudioUrl(audio);
      setIsDownloaded(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      audioUrl,
      audioTitle,
      autoPlay,
      audioId,
      albumId,
      play,
      audioRef,
      playedAudioUrl,
      isDownloaded,
      setAudio,
      playNext,
      playPrevious,
      togglePlayPause,
      setPlay,
    }),
    [
      audioUrl,
      audioTitle,
      autoPlay,
      audioId,
      albumId,
      play,
      playedAudioUrl,
      isDownloaded,
    ]
  );

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
}
