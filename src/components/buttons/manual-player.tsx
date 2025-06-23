"use client";
import { Download, PauseCircle, PlayCircle } from "lucide-react";
import { fileUrlFormat, getLocalFilePath } from "@/lib/utils";
import { Sermon } from "@/schemas/sermon";
import { SingList } from "@/schemas/song";
import { useAudioPlayer } from "@/context/audio-player-context";
import { tr } from "@/translation";
import { DownloadButton } from "./download-button";

export type SongPlayerManualButtonType = {
  data: Sermon | SingList;
  type: "Sermon" | "SingList";
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

  const lng = "en-en";

  const title =
    type === "Sermon"
      ? `${(data as Sermon).chapter} : ${data.title}`
      : data.title;

  const subFolder = type === "Sermon" ? "Sermons" : "Hymns";

  const putsongInPlayer = async () => {
    let canPlay = true;
    if (!navigator.onLine) {
      await getLocalFilePath(
        lng,
        type === "Sermon" ? "Sermons" : "Hymns",
        title.replace(" : ", "_")
      ).catch(() => {
        alert(tr("alert.cannot_download"));
        canPlay = false;
      });
    }
    if (canPlay && data.audio) {
      setAudio(
        data.audio,
        title,
        data.id,
        type === "Sermon" ? undefined : (data as SingList).album_id,
        true
      );
    }
  };

  console.log(audioUrl, playedAudioUrl, data, play);
  return (
    <div className="flex justify-start items-center">
      <div>
        {(data.audio !== audioUrl ||
          (!playedAudioUrl && data.audio === audioUrl)) && (
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
            subFolder={subFolder}
            setFinishedDownload={setFinishedDownload}
          >
            <Download
              className={`cursor-pointer ml-2 ${fileIsDownload ? "text-orange-500" : "text-amber-800 dark:text-white"}`}
            ></Download>
          </DownloadButton>
        )}
      </div>
    </div>
  );
};

export default SongPlayerManualButton;
