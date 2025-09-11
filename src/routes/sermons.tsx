import DisplayAlert from "@/components/dialog/display-alert";
import DownloadProgressModal from "@/components/dialog/download-progress-modal";
import SermonHeader from "@/components/sermons/sermon-header";
import { useLangue } from "@/context/langue-context";
import { useSermon } from "@/context/sermon-context";
import { resources } from "@/lib/resources";
import { findBy, findImage } from "@/lib/resources/sermon";
import {
  downloadDrogressType,
  firstSermonVerse,
  getLocalFilePath,
} from "@/lib/utils";
import { Verses } from "@/schemas/sermon";
import { tr } from "@/translation";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import PageLoader from "@/components/loaders/page-loader";
import { hasInternet, openCenteredPopup } from "@/hooks/use-online-status";

export const Route = createFileRoute("/sermons")({
  component: RouteComponent,
});

export const DownloadVerseLink = ({ verset }: { verset: Verses }) => {
  const [isLoad, setIsLoad] = useState(false);
  const download = async (value: { fileName: string | null; url: string }) => {
    setIsLoad(true);
    const online = await hasInternet();
    setIsLoad(false);
    if (!online) {
      alert(tr("alert.cannot_download"));
      return;
    }
    const w = value.fileName?.endsWith(".pdf") ? 700 : 400;
    const h = value.fileName?.endsWith(".pdf") ? 400 : 50;
    // créer dynamiquement un <a> et simuler le clic
    openCenteredPopup(value.url, value.fileName || "", w, h);
  };

  if (!verset?.verse_links?.length) return <></>;
  if (isLoad)
    return <span className="inline-block animate-spin text-blue-600">⟳</span>;

  return (
    <div className="text-blue-600 mb-2 pr-2 flex flex-wrap print-hidden">
      {verset.verse_links?.map((value, key) => {
        const label =
          value.type === "audio"
            ? `${tr("table.lien_audio")} ${value.content}`
            : `${tr("table.lien_audio")} ${value.content}(${value.fileName})`;
        const suffix =
          verset?.verse_links?.length && verset?.verse_links?.length > 1
            ? `(${key + 1})`
            : "";

        return (
          <button
            key={key}
            className="cursor-pointer capitalize pr-2 text-left text-blue-600"
            onClick={() => download(value)}
          >
            <span>
              {label}
              {suffix}
            </span>
          </button>
        );
      })}
    </div>
  );
};

function RouteComponent() {
  const { lng, langName } = useLangue();
  //const { setAudio } = useAudioPlayer();
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
  const [sermonImage, setSermonImage] = useState<{
    name: string;
    blobUrl: string | null;
  }>();

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
      if (!index?.number) {
        //clear coloration if text is not found
        setVerseNumber("");
      }
      setSearch(term);
    } else {
      //clear coloration if text is not found
      setVerseNumber("");
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
        block: search ? "center": "center", // Align to the start of the viewport
      });
    }
  }, [verseNumber, sermon]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  useEffect(() => {
    refs.current[0]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setSearch("");
    setVerseNumber("");
    setNumber("1");
  }, [lng]);

  const onOpenChange = () => {
    setOpen(!open);
  };

  const onOpenChangeProgress = () => {
    setOpenProgress(!openProgress);
  };

  // const playAudio = async (url: string, title: string) => {
  //   let canPlay = true;

  //   if (!navigator.onLine) {
  //     await getLocalFilePath(lng, "Others", title).catch(() => {
  //       handleConfirmAlert(tr("alert.cannot_download"));
  //       canPlay = false;
  //     });
  //   }
  //   if (canPlay && sermon) {
  //     setAudio(url, title, sermon.id, undefined, true);
  //   }
  // };

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

    if (sermon?.cover) {
      findImage(lng, sermon.cover)
        .then((value) => {
          setSermonImage(value);
        })
        .catch((err) => {
          console.log(err, "image error");
        });
    } else {
      setSermonImage({ name: "", blobUrl: null });
    }
  }, [sermon]);

  useEffect(() => {
    if (sermon) {
      setNumber(`${sermon.number}`);
      setVerseNumber(firstSermonVerse(sermon));
    }
  }, [lng]);

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
      <PageLoader
        isLoading={isLoading || !sermon}
        loadMessage={
          isError
            ? `${tr("home.sermon_unvailable")} ${langName}`
            : tr("home.waiting")
        }
      >
        <div>
          <div
            className={`sticky top-16 w-full -mt-4 h-25 px-2 py-2 bg-muted z-1`}
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
            <div
              className="print-title flex items-center justify-center pb-4"
              style={{ fontSize }}
            >
              {" "}
              {sermon?.chapter} :{" "}
              {sermon &&
                `${sermon.title} ${sermon.sub_title}`.replace("null", "")}
            </div>

            <div className="flex">
              {sermonImage?.blobUrl && (
                <img
                  alt=""
                  className="float-left pr-4 mt-2"
                  src={sermonImage?.blobUrl}
                />
              )}
            </div>
            {sermon?.verses?.map((verset: Verses, key: number) => (
              <div key={verset.number} style={{ fontSize }}>
                <div
                  ref={(el) => {
                    refs.current[key] = el;
                  }}
                  className={`py-1 ${verseNumber?.toString() === verset.number.toString() && ((!search && verset.number > 1) || search) ? "bg-blue-600 dark:bg-yellow-300" : "bg-transparent"} ${verseNumber?.toString() === verset.number.toString() && ((!search && verset.number > 1) || search) ? "text-white dark:text-black" : ""}`}
                >
                  {verset.title && (
                    <h1 className="py-1 text-left font-bold">{verset.title}</h1>
                  )}
                  <div>
                    <span className="font-bold dark:text-red-500">
                      {verset.number}.
                    </span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ` ${verset.content.replace(/\n/g, "<br>")}`,
                      }}
                    ></span>
                  </div>
                </div>
                <DownloadVerseLink verset={verset} />

                <div>
                  {/** not use button because in the pdf button give bad content */}
                  {verset.concordances?.concordance.map((value: any) => (
                    <span
                      className="cursor-pointer
                          print-concordance
                          px-2 py-1
                          bg-blue-100 dark:bg-blue-900
                          text-blue-800 dark:text-blue-200
                          rounded
                          hover:bg-blue-200 dark:hover:bg-blue-700
                          active:bg-blue-300 dark:active:bg-blue-600
                          transition-colors
                          duration-200
                          mr-1 mb-1 text-sm"
                      onClick={() =>
                        navigateToSermon(
                          value.sermon_number,
                          value.verse_number
                        )
                      }
                      key={`${value.sermon_number}-${value.verse_number}`}
                    >
                      {value.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-4">{sermon?.similar_sermon}</div>
          </div>
        </div>
      </PageLoader>
    </>
  );
}
