"use client";
import { Download, PauseCircle, PlayCircle } from "lucide-react";
import { AudioFolder, fileUrlFormat, getLocalFilePath } from "@/lib/utils";
import { Sermon } from "@/schemas/sermon";
import { SingList } from "@/schemas/song";
import { useAudioPlayer } from "@/context/audio-player-context";
import { tr } from "@/translation";
import { DownloadButton } from "./download-button";
import { useLangue } from "@/context/langue-context";
import { handleConfirmAlert } from "@/lib/alert-confirm-options";

export type SongPlayerManualButtonType = {
  data: Sermon | SingList;
  type: AudioFolder;
  setFinishedDownload: (state: boolean) => void;
  fileIsDownload: boolean;
};
const SongPlayerManualButton = ({
  data,
  type,
  fileIsDownload,
  setFinishedDownload,
}: SongPlayerManualButtonType) => {
  const { setAudio, togglePlayPause, audioUrl, playedAudioUrl, play } =
    useAudioPlayer();

  const { lng } = useLangue();
  const title =
    type === "Sermons"
      ? `${(data as Sermon).chapter} : ${data.title}`
      : data.title;
  const albumId = type === "Hymns" ? (data as SingList)?.album_id : undefined
  const modelId = data.id

  const putsongInPlayer = async () => {
    let canPlay = true;
    if (!navigator.onLine) {
      await getLocalFilePath(lng, type, title.replace(" : ", "_")).catch(() => {
        handleConfirmAlert(tr("alert.cannot_download"));
        canPlay = false;
      });
    }
    if (canPlay && data.audio) {
      setAudio(
        data.audio,
        title,
        modelId,
        albumId,
        true
      );
    }
  };

  return (
    <div className="flex justify-start items-center">
      <div>
        {(data.audio !== audioUrl ||
          (!playedAudioUrl && data.audio === audioUrl && data.audio)) && (
          <PlayCircle
            className={`cursor-pointer h-6 w-6 text-amber-800 dark:text-white`}
            onClick={() => putsongInPlayer()}
          ></PlayCircle>
        )}
        {playedAudioUrl && data.audio === audioUrl && !play && (
          <PlayCircle
            className={`cursor-pointer h-6 w-6 text-orange-500`}
            onClick={() => togglePlayPause()}
          ></PlayCircle>
        )}

        {playedAudioUrl && data.audio === audioUrl && play && (
          <PauseCircle
            className={`cursor-pointer h-6 w-6 text-orange-500`}
            onClick={() => togglePlayPause()}
          ></PauseCircle>
        )}
      </div>
      <div>
        {data.audio && (
          <DownloadButton
            audioUrl={data.audio}
            fileName={fileUrlFormat(title.replace(" : ", "_"))}
            subFolder={type}
            setFinishedDownload={setFinishedDownload}
            fileOriginalName={title}
            modelId={modelId}
            albumId={albumId}
          >
            <Download
              className={`cursor-pointer ml-2 ${
                fileIsDownload
                  ? "text-orange-500"
                  : "text-amber-800 dark:text-white"
              }`}
            ></Download>
          </DownloadButton>
        )}
      </div>
    </div>
  );
};

export default SongPlayerManualButton;
