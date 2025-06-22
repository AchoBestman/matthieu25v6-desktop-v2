import { useState } from "react";
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

const SermonSidebar = () => {
  const [fontSize, setFontSize] = useState<number>(16);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const onOpenChange = () => {
    setOpen(!open);
  };

  const {
    data: totalSermon,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["total-sermon", "lng"], // reactively refetches when lng changes
    queryFn: () => totalModel(resources.sermons, lng),
  });

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
          <Label className="flex items-center gap-2 text-sm cursor-pointer">
            <span>Reorder</span>
            <Switch className="shadow-none border-1 border-amber-800" />
          </Label>
        </div>
        <SidebarInput placeholder={tr("button.search")} />
        <div className="flex">
          <div className="mx-2 flex justify-center items-center">
            <div className="text-white px-2 whitespace-nowrap">
              {tr("home.sermon_num")}:
            </div>
            <Input
              className="bg-white dark:bg-muted/100 h-8"
              size={5}
              type="text"
              placeholder={tr("home.sermon_num")}
              onChange={(e) => {
                if (e.target.value && parseInt(e.target.value) > totalSermon) {
                  setMessage(
                    `Kacou ${e.target.value} ${t.home.search_not_found_pred_message}`
                  );
                  setOpen(true);
                  setPredication(e.target.value);
                  setSearchSermon({ number: e.target.value });
                  return;
                }

                setTimeout(() => {
                  if (e.target.value && parseInt(e.target.value)) {
                    setSearchSermon({ number: e.target.value });
                    setToggleSearch(!toggleSearch);
                    setPredication(e.target.value);
                  }
                }, 1000);
              }}
            ></Input>
          </div>
          <div className="flex justify-center items-center">
            <span className="px-2 whitespace-nowrap text-white">
              {t.home.verset_num}:
            </span>
            <Input
              className="bg-white dark:bg-black dark:bg-muted/100 h-8"
              size={5}
              type="text"
              onChange={(e) => setSearchSermon({ versetId: e.target.value })}
              placeholder={t.home.verset_num}
            ></Input>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {/* {mails.map((mail) => (
                <a
                  href="#"
                  key={mail.email}
                  className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                >
                  <div className="flex w-full items-center gap-2">
                    <span>{mail.name}</span>{" "}
                    <span className="ml-auto text-xs">{mail.date}</span>
                  </div>
                  <span className="font-medium">{mail.subject}</span>
                  <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                    {mail.teaser}
                  </span>
                </a>
              ))} */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SermonSidebar;
