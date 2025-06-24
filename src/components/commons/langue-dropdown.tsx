import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { resources } from "@/lib/resources";
import { findAll } from "@/lib/resources/langue";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { dbExist, deleteDb, downloadWithProgress } from "@/lib/database";
import { Download, RefreshCcw, Trash } from "lucide-react";
import { API_URL } from "@/lib/env";
import { downloadDrogressType } from "@/lib/utils";
import { setTr, tr } from "@/translation";
import DownloadProgressModal from "@/components/dialog/download-progress-modal";
import DisplayAlert from "@/components/dialog/display-alert";
import { Langue } from "@/schemas/langue";
import { useLangue } from "@/context/langue-context";
import { Avatar, AvatarImage } from "../ui/avatar";

type LangueDataType = {
  id: number;
  name: string;
  lang: string;
  icon: string;
  countryFip: string;
  translation: string;
  exist: boolean;
};

const LangueDropdown = () => {
  const { setLng, setLangName, lng } = useLangue();
  const [isOpen, setIsOpen] = useState(false);
  const [langues, setLangues] = useState<Array<LangueDataType>>([]);
  const [searchLangues, setSearchLangues] = useState<Array<LangueDataType>>([]);
  const [openProgress, setOpenProgress] = useState<boolean>(false);
  const [progress, setProgress] = useState<downloadDrogressType>({
    percent: 0,
    downloadSize: 0,
    totalSize: 0,
  });
  const [open, setOpen] = useState<boolean>(false);
  const abortRef = useRef(false);

  const onOpenChange = () => {
    setOpen(!open);
  };

  const onOpenChangeProgress = () => {
    setOpenProgress(!openProgress);
  };

  const stopDownloading = () => {
    abortRef.current = !abortRef.current;
  };

  const downloadDb = async (initial: string) => {
    try {
      abortRef.current = false;
      onOpenChangeProgress();
      setProgress({
        percent: 0,
        downloadSize: 0,
        totalSize: 0,
      });
      await downloadWithProgress(
        `${API_URL}/auth/download/${initial}`,
        initial,
        (percent) => {
          setProgress(percent);
        },
        () => abortRef.current
      );
    } catch (err) {
      console.error("Error downloading database:", err);
    }
  };

  const removeDb = async (initial: string) => {
    try {
      await deleteDb(initial);
      await availabeLangues();
    } catch (err) {
      console.error("Error deleting database:", err);
      throw err;
    }
  };

  const availabeLangues = async () => {
    const response = await findAll(
      resources.langues,
      lng,
      {
        is_active: true,
        web_translation: true,
        per_page: 1000,
      },
      { column: "order", direction: "ASC" }
    );
    const data = response.data;

    const customLangues = await Promise.all(
      data.map(async (item: Langue) => {
        const status = await dbExist(item.initial);
        const itemToArray = item.initial.split("-");
        const countryFip = itemToArray[0];

        return {
          id: item.id,
          icon: `/images/drapeau/${countryFip}.jpg`,
          lang: item.initial,
          name: item.libelle,
          countryFip: countryFip,
          translation: item.web_translation,
          exist: status,
        };
      })
    );

    setLangues(customLangues);
    setSearchLangues(customLangues);
  };

  const changeUrl = (langue: LangueDataType) => {
    setLng(langue.lang);
    setLangName(langue.name);
    setTr(langue.translation);
  };

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function activeLang() {
    return searchLangues.find(
      (current: LangueDataType) => current.lang === lng
    ) as LangueDataType;
  }

  const searchLangue = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    const lngs = searchLangues.filter((value: LangueDataType) =>
      value.name.toLowerCase().includes(search.toLowerCase())
    );
    setLangues(lngs);
  };

  useEffect(() => {
    availabeLangues();
  }, [lng]);

  useEffect(() => {
    if (progress.percent === 100) availabeLangues();
  }, [progress]);

  return (
    <>
      <DownloadProgressModal
        open={openProgress}
        onOpenChange={onOpenChangeProgress}
        progress={progress}
        title={tr("download.waiting_for_downloaded_langue")}
        cancel={true}
        stopDownloading={stopDownloading}
      />
      <DisplayAlert
        open={open}
        onOpenChange={onOpenChange}
        message={""}
        title={tr("download.langue_not_found")}
        cancel={true}
      ></DisplayAlert>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild className="outline-none">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-700 dark:text-gray-400"
          >
            <span className="h-8 w-8  ml-1.5 cursor-pointer">
              {activeLang() && (
                <Avatar>
                  <AvatarImage
                    src={activeLang().icon}
                    alt={activeLang().name}
                    className="object-cover p-0.5 rounded-full"
                  />
                </Avatar>
              )}
            </span>
            <span className="text-white cursor-pointer">
              <svg
                className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-[300px] mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900"
        >
          <Input
            type="search"
            placeholder="chercher une langue"
            className="mb-2"
            onChange={searchLangue}
          />
          <ul className="max-h-[500px] overflow-auto border-t pt-4 pb-8 border-gray-200 dark:border-gray-800 flex flex-col gap-1">
            {langues?.length > 0 &&
              langues.map((item: LangueDataType) => {
                return (
                  <li key={item.id}>
                    <DropdownMenuItem className="flex -mt-1 items-center justify-between font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                      <button
                        className="flex cursor-pointer"
                        onClick={() => {
                          if (item.exist) {
                            changeUrl(item);
                            closeDropdown();
                          } else {
                            onOpenChange();
                          }
                        }}
                      >
                        <div className="flex items-center justify-center">
                          <Avatar>
                            <AvatarImage
                              alt={item.lang}
                              src={item.icon}
                              width={20}
                              height={20}
                              className="rounded-full p-0.5"
                            />
                          </Avatar>
                          {item.name}
                        </div>
                      </button>

                      <button className="flex cursor-pointer">
                        {item.exist ? (
                          <>
                            <button
                              className="cursor-pointer"
                              onClick={() => downloadDb(item.lang)}
                            >
                              <RefreshCcw className="w-5 text-primary dark:text-white mx-2"></RefreshCcw>
                            </button>
                            <button
                              className="cursor-pointer"
                              onClick={() => removeDb(item.lang)}
                            >
                              <Trash className="w-5 text-red-500"></Trash>
                            </button>
                          </>
                        ) : (
                          <button
                            className="cursor-pointer"
                            onClick={() => downloadDb(item.lang)}
                          >
                            <Download className="w-5 text-primary dark:text-white"></Download>
                          </button>
                        )}
                      </button>
                    </DropdownMenuItem>
                  </li>
                );
              })}
          </ul>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default LangueDropdown;
