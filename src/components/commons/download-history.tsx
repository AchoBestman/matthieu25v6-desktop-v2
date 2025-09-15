import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  CloudDownload,
  File,
  FileAudio2,
  PlayCircle,
  Trash,
} from "lucide-react";
import {
  DownloadHistoryItem,
} from "@/lib/download-history";
import { useAudioPlayer } from "@/context/audio-player-context";
import { handleConfirmAlert } from "@/lib/alert-confirm-options";
import { tr } from "@/translation";
import { useDebounce } from "use-debounce";
import { cancelDownload, createPaths, openFile } from "@/lib/utils";
import { useDownloadHistory } from "@/context/download-history-context";
import { useLangue } from "@/context/langue-context";

const DonwloadHistoryDropdown = () => {
  const { history, clearHistory, clearHistories } = useDownloadHistory();
  const [downloads, setDownloads] = useState<DownloadHistoryItem[]>(history);

  const [isOpen, setIsOpen] = useState(false);
  const { setAudio } = useAudioPlayer();
  const [search, setSearch] = useState("");
  const [searchDebounce] = useDebounce(search, 300);
  const  { lng } = useLangue();

  useEffect(() => {
  if (searchDebounce) {
    const filtered = history.filter(item =>
      item.fileOriginalName.toLowerCase().includes(searchDebounce.toLowerCase())
    );
    setDownloads(filtered);
  } else {
    setDownloads(history);
  }
}, [searchDebounce, history]);


  const putAudioInPlayer = async (item: DownloadHistoryItem) => {
    // specially audioTitle and must have the same value. i can't pass item.fileName because it is slug with _

    if(item.fileName.endsWith('pdf') || item.fileName.endsWith('.m4a') || item.fileName.endsWith('.wav') || item.fileName.endsWith('.flac') ){
      const filePath = await createPaths(lng, "Others", item.fileName, "pdf");
      await openFile(filePath);
      
    }else{
      setAudio(
        item.url,
        item.fileOriginalName, // i pass here for display in the player
        item.modelId,
        item.albumId,
        true,
        item.fileOriginalName // i pass here to check if current audio has fileOriginalName,if it has, the next and previous audio be taken from local storage
      );
    }
  };

  const stopDownloaded = async (modelId: number) => {
    await cancelDownload(modelId)// clear before from the client and next clear locally
    clearHistory(modelId)
  };

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  const searchAudioDownloaded = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild className="outline-none">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-700 dark:text-gray-400"
        >
          <span className="h-8 w-8 ml-1.5 cursor-pointer">
            <CloudDownload className="object-cover p-0.5 cursor-pointer text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-8 w-8 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white" />
          </span>
          {downloads.filter((item) => item.progress < 100).length >
            0 && (
            <span className="-ml-4 -mt-6 h-5 w-5 text-white bg-red-500 rounded-full">
              {downloads.filter((item) => item.progress < 100).length}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-full min-w-sm mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <Input
          type="search"
          placeholder={tr("button.search")}
          className="mb-2"
          onChange={searchAudioDownloaded}
        />
        <ul className="max-h-[500px] overflow-auto border-t pt-4 pb-8 border-gray-200 dark:border-gray-800 flex flex-col gap-1">
          {downloads?.length > 0 &&
            downloads.map((item: DownloadHistoryItem) => {
              return (
                <li key={item.fileName + item.url}>
                  <DropdownMenuItem className="flex -mt-1 items-center justify-between font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                    <button className="flex cursor-pointer">
                      <div className="flex items-center justify-between">
                        <FileAudio2 className="w-5 h-5 mr-2 text-primary dark:text-white"></FileAudio2>
                        <span className="mr-2">{item.fileOriginalName}</span>
                        {item.progress < 100 && (
                          <progress
                            style={{ borderRadius: "6px" }}
                            value={item.progress}
                            max={100}
                          />
                        )}

                        <div className="flex my-2 justify-between">
                          {item.progress < 100 && (
                            <div className="mx-1">{item.progress}%</div>
                          )}
                          {item.totalSize > 0 && item.progress < 100 ? (
                            <div className="mr-1">
                              {item.downloadedSize + "M"} /{" "}
                              {item.totalSize + "M"}
                            </div>
                          ) : (
                            <div className="mr-1">{item.totalSize + "M"}</div>
                          )}
                        </div>
                      </div>
                    </button>

                    <button className="flex cursor-pointer mr-4">
                      {item.url && item.progress < 100 ? (
                        <button
                          className="cursor-pointer"
                          onClick={async (e) => {
                            handleConfirmAlert(
                              tr("button.confirm_action"),
                              false,
                              () => stopDownloaded(item.modelId)
                            );
                            toggleDropdown(e);
                          }}
                        >
                          <Trash className="w-5 text-red-500"></Trash>
                        </button>
                      ) : (
                        <>
                          <button
                            className="cursor-pointer"
                            onClick={() => putAudioInPlayer(item)}
                          >
                            {item.fileName.endsWith('pdf') ? <File className="w-5 text-green-500 dark:text-white"></File> : <PlayCircle className="w-5 text-blue-500 dark:text-white"></PlayCircle>}
                            
                          </button>
                          <button
                            className="cursor-pointer mx-1"
                            onClick={async (e) => {
                              handleConfirmAlert(
                                tr("button.confirm_action"),
                                false,
                                () => clearHistory(item.modelId)
                              );
                              toggleDropdown(e);
                            }}
                          >
                            <Trash className="w-5 text-red-500"></Trash>
                          </button>
                        </>
                      )}
                    </button>
                  </DropdownMenuItem>
                </li>
              );
            })}
        </ul>
        {downloads.filter((item) => item.progress === 100)?.length > 0 && (
          <button
            onClick={async (e) => {
              handleConfirmAlert(
                tr("button.confirm_action"),
                false,
                clearHistories
              );
              toggleDropdown(e);
            }}
            className="button text-blue-500 dark:text-white cursor-pointer p-2"
          >
            {tr("button.clear_all_history")}
          </button>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DonwloadHistoryDropdown;
