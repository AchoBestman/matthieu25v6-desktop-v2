import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import TextFontSizeBar from "@/components/commons/text-font-sizebar";
import { tr } from "@/translation";
import { Input } from "@/components/ui/input";
import DisplayAlert from "@/components/dialog/display-alert";
import { useQuery } from "@tanstack/react-query";
import { resources } from "@/lib/resources";
import { findAll } from "@/lib/resources/sermon";
import { SermonSearchParams } from "@/schemas/sermon";
import { useDebounce } from "use-debounce";
import { useLangue } from "@/context/langue-context";
import { useSermon } from "@/context/sermon-context";
import { useNavigate } from "@tanstack/react-router";
import { ArrowDown10, ArrowUp10 } from "lucide-react";

const SermonSidebar = () => {
  const { lng } = useLangue();
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const {
    fontSize,
    setFontSize,
    setNumber,
    setVerseNumber,
    number,
    verseNumber,
  } = useSermon();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState<SermonSearchParams>({
    per_page: 500,
    order: "ASC",
  });

  const [selectedSermon, setSelectedSermon] = useState<{
    number: string;
    verse_number: string;
    fontSize: number;
  }>({
    number: number.toString(),
    fontSize,
    verse_number: verseNumber.toString(),
  });

  const [searchParamsDebouce] = useDebounce(searchParams, 300);
  const [selectedVerseDebounce] = useDebounce(selectedSermon, 300);

  const {
    data: sermons,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sermons", searchParamsDebouce, lng],
    queryFn: () =>
      findAll(resources.sermons, lng, searchParamsDebouce, {
        column: "number",
        direction: searchParamsDebouce.order,
      }),
  });

  const onOpenChange = () => {
    setOpen(!open);
  };

  const handleToggle = () => {
    setSearchParams((prev) => {
      return { ...prev, order: prev.order === "ASC" ? "DESC" : "ASC" };
    });
  };

  useEffect(() => {
    setSelectedSermon((prev) => {
      return {
        ...prev,
        fontSize,
      };
    });
    return () => {};
  }, [fontSize]);

  useEffect(() => {
    setFontSize(selectedVerseDebounce.fontSize);
  }, [selectedVerseDebounce.fontSize]);

  useEffect(() => {
    if (selectedVerseDebounce.number) setNumber(selectedVerseDebounce.number);
  }, [selectedVerseDebounce.number]);

  useEffect(() => {
    setVerseNumber(selectedVerseDebounce.verse_number);
  }, [selectedVerseDebounce.verse_number]);

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex bg-muted">
      <DisplayAlert
        open={open}
        onOpenChange={onOpenChange}
        message={message}
        title={tr("home.search_not_found_title")}
        cancel={true}
      ></DisplayAlert>
      <SidebarHeader className="gap-3.5 border-b">
        <div className="flex w-full items-center justify-between">
          <div className="text-foreground text-base font-medium">
            <TextFontSizeBar
              className="flex max-w-md"
              fontSize={fontSize}
              setFontSize={setFontSize}
            ></TextFontSizeBar>
          </div>
          <Label className="flex items-center gap-2 text-sm cursor-pointer mr-1">
            <div className="-mr-2">
              {searchParamsDebouce.order === "DESC" ? (
                <ArrowDown10></ArrowDown10>
              ) : (
                <ArrowUp10></ArrowUp10>
              )}
            </div>
            <Switch
              checked={searchParamsDebouce.order === "ASC"}
              onCheckedChange={handleToggle}
              className="shadow-none border-1 dark:border-white cursor-pointer"
            />
          </Label>
        </div>

        <div className="mr-1">
          <div className="flex">
            <div className="flex justify-center items-center">
              <div className="whitespace-nowrap px-1">
                {tr("home.sermon_num")}:
              </div>
              <Input
                className="bg-white h-7 mt-1 border-1 dark:border-white"
                size={3}
                type="text"
                placeholder={tr("home.sermon_num")}
                value={selectedSermon.number}
                onChange={(e) => {
                  if (
                    sermons &&
                    e.target.value &&
                    parseInt(e.target.value) > sermons?.pagination?.meta?.total
                  ) {
                    setMessage(
                      `Kacou ${e.target.value} ${tr("home.search_not_found_pred_message")}`
                    );
                    setOpen(true);
                  }

                  setSelectedSermon((prev) => {
                    return {
                      ...prev,
                      number: e.target.value,
                    };
                  });
                }}
              ></Input>
            </div>
            <div className="flex justify-center items-center">
              <span className="whitespace-nowrap px-1">
                {tr("home.verset_num")}:
              </span>
              <Input
                className="bg-white h-7 mt-1 dark:border-white"
                size={5}
                type="text"
                value={selectedSermon.verse_number}
                onChange={(e) => {
                  setSelectedSermon((prev) => {
                    return {
                      ...prev,
                      verse_number: e.target.value,
                    };
                  });
                }}
                placeholder={tr("home.verset_num")}
              ></Input>
            </div>
          </div>
        </div>
        <SidebarInput
          className="border-1 dark:border-white -ml-1"
          placeholder={tr("button.search")}
          onChange={(e) =>
            setSearchParams((prev) => {
              return {
                ...prev,
                search: e.target.value,
              };
            })
          }
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {sermons?.data.map((sermon) => (
              <button
                type="button"
                onClick={() => {
                  setSelectedSermon((prev) => {
                    return {
                      ...prev,
                      number: sermon.number.toString(),
                    };
                  });

                  navigate({ to: "/sermons" });
                }}
                key={sermon.number}
                className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0 text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <div className="flex w-full items-center gap-2">
                  <span className="font-medium">{sermon.chapter}</span>{" "}
                  <span className="ml-auto text-xs text-blue-600 dark:text-blue-400">
                    {sermon.publication_date}
                  </span>
                </div>
                <span className="line-clamp-2 font-medium w-[260px] whitespace-break-spaces">
                  {sermon.title}
                </span>
                <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                  {sermon.sub_title}
                </span>
              </button>
            ))}
            {isError && <span>{tr("home.sermon_unvailable")}</span>}
            {isLoading && <span>{tr("home.waiting")}</span>}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SermonSidebar;
