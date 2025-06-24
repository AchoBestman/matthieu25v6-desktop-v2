import { DownloadButton } from "@/components/buttons/download-button";
import DisplayAlert from "@/components/dialog/display-alert";
import DownloadProgressModal from "@/components/dialog/download-progress-modal";
import SermonHeader from "@/components/sermons/sermon-header";
import { useAudioPlayer } from "@/context/audio-player-context";
import { useLangue } from "@/context/langue-context";
import { useSermon } from "@/context/sermon-context";
import { resources } from "@/lib/resources";
import { findBy } from "@/lib/resources/sermon";
import {
  downloadDrogressType,
  fileUrlFormat,
  getLocalFilePath,
} from "@/lib/utils";
import { Verses } from "@/schemas/sermon";
import { tr } from "@/translation";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/sermons")({
  component: RouteComponent,
});

function RouteComponent() {
  const { lng, langName } = useLangue();
  const { setAudio } = useAudioPlayer();
  const refs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [openProgress, setOpenProgress] = useState<boolean>(false);
  const [progress, setProgress] = useState<downloadDrogressType>({
    percent: 0,
    downloadSize: 0,
    totalSize: 0,
  });
  const [finishedDownload, setFinishedDownload] = useState<boolean>(false);

  const {
    fontSize,
    verseNumber,
    number,
    search,
    setSearch,
    setNumber,
    setVerseNumber,
  } = useSermon();

  const {
    data: sermon,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sermons", number, lng, finishedDownload],
    queryFn: () =>
      findBy(
        resources.sermons,
        lng,
        {
          column: "number",
          value: number,
        },
        [{ table: resources.verses, type: "HasMany" }],
        (percent) => {
          onOpenChangeProgress();
          setProgress(percent);
        }
      ),
  });

  const navigateToSermon = (sermon_number: number, verse_number: number) => {
    if (sermon_number) {
      setNumber(sermon_number.toString());
    }
    if (verse_number) {
      setVerseNumber(verse_number.toString());
    }
  };

  const handleLocalSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    if (term.trim().length > 2) {
      const index = sermon?.verses?.find((item) =>
        item.content.toLowerCase().includes(term.toLowerCase())
      );
      if (index?.number) {
        setVerseNumber(index?.number.toString());
      }
      setSearch(term);
    }
  };

  const handleSearch = useCallback(() => {
    if (!verseNumber) return;
    if (sermon?.verses && Number.parseInt(verseNumber) > sermon.verses.length) {
      setMessage(
        `${sermon.chapter} ${tr("home.search_not_found_vers_message")} ${verseNumber}`
      );
      setOpen(true);
    }
    const index = Number.parseInt(verseNumber) - 1; // Convert search to 0-based index
    if (sermon?.verses && index >= 0 && index < sermon.verses.length) {
      refs.current[index]?.scrollIntoView({
        behavior: "smooth", // Smooth scrolling
        block: "center", // Align to the top of the viewport
      });
    }
  }, [verseNumber, sermon]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const onOpenChange = () => {
    setOpen(!open);
  };

  const onOpenChangeProgress = () => {
    setOpenProgress(!openProgress);
  };

  const playAudio = async (url: string, title: string) => {
    let canPlay = true;

    if (!navigator.onLine) {
      await getLocalFilePath(lng, "Others", title).catch(() => {
        alert(tr("alert.cannot_download"));
        canPlay = false;
      });
    }
    if (canPlay && sermon) {
      setAudio(url, title, sermon.id, undefined, true);
    }
  };

  useEffect(() => {
    if (sermon) {
      getLocalFilePath(lng, "Sermons", `${sermon.chapter} : ${sermon.title}`)
        .then(() => {
          setFinishedDownload(true);
        })
        .catch(() => {
          setFinishedDownload(false);
        });
    }
  }, [sermon]);

  return (
    <>
      <DisplayAlert
        open={open}
        onOpenChange={onOpenChange}
        message={message}
        title={tr("home.search_not_found_title")}
        cancel={true}
      ></DisplayAlert>
      <DownloadProgressModal
        open={openProgress}
        onOpenChange={onOpenChangeProgress}
        progress={progress}
        title={tr("download.waiting_for_downloaded_langue")}
        cancel={true}
        type="appLoad"
      />
      {isLoading ? (
        <div className="mt-16">
          {isError
            ? `${tr("home.sermon_unvailable")} ${langName}`
            : tr("home.waiting")}
        </div>
      ) : (
        <div className="relatives -mt-8">
          <div
            className={`sticky top-16 w-full -mt-4 h-25 px-2 py-2 bg-muted z-20`}
          >
            {sermon && (
              <SermonHeader
                sermon={sermon}
                search={search ?? ""}
                handleLocalSearch={handleLocalSearch}
                fileIsDownload={finishedDownload}
                setFinishedDownload={setFinishedDownload}
              ></SermonHeader>
            )}
          </div>

          <div
            id="invoice"
            className={`invoice min-h-[100vh] flex-1 md:min-h-min`}
          >
            <div className="text-center pb-4" style={{ fontSize }}>
              {" "}
              {sermon?.chapter} :{" "}
              {sermon &&
                `${sermon.title} ${sermon.sub_title}`.replace("null", "")}
            </div>
            {sermon?.verses?.map((verset: Verses, key: number) => (
              <div key={verset.number} className="px-2" style={{ fontSize }}>
                <div
                  ref={(el) => {
                    refs.current[key] = el;
                  }}
                  style={{
                    backgroundColor:
                      verseNumber?.toString() === verset.number.toString()
                        ? "yellow"
                        : "transparent",
                    color:
                      verseNumber?.toString() === verset.number.toString()
                        ? "black"
                        : "",
                  }}
                  className="py-1"
                >
                  <span className="font-bold dark:text-red-500 pr-1 float-start">
                    {verset.number}.
                  </span>
                  {verset.url_content && verset.link_at_content ? (
                    <div className="mb-4">
                      <button
                        className="text-left cursor-pointers"
                        onClick={() =>
                          playAudio(
                            verset.url_content as string,
                            verset.link_at_content as string
                          )
                        }
                        dangerouslySetInnerHTML={{
                          __html: verset.content.replace(
                            verset.link_at_content,
                            `<strong style="color:blue; cursor:pointer">${verset.link_at_content}</strong>`
                          ),
                        }}
                      ></button>
                      <DownloadButton
                        audioUrl={verset.url_content}
                        fileName={fileUrlFormat(verset.link_at_content)}
                        subFolder="Others"
                        setFinishedDownload={setFinishedDownload}
                      >
                        <Download className="text-red-500 cursor-pointer"></Download>
                      </DownloadButton>
                    </div>
                  ) : (
                    verset.content
                  )}
                </div>
                <div
                  id="invoice-hidden"
                  className="text-blue-600 dark:text-blue-400"
                >
                  {verset.concordances?.concordance.map((value: any) => (
                    <button
                      className=" cursor-pointer"
                      onClick={() =>
                        navigateToSermon(
                          value.sermon_number,
                          value.verse_number
                        )
                      }
                      key={`${value.sermon_number}-${value.verse_number}`}
                    >
                      {value.label}
                      {""}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-4">{sermon?.similar_sermon}</div>
          </div>
        </div>
      )}
    </>
  );
}
