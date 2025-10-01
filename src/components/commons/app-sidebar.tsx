"use client";

import * as React from "react";
import { NavUser } from "@/components/commons/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { tr } from "@/translation";
import { menus } from "@/lib/menu";
import { useNavigate } from "@tanstack/react-router";
import SermonSidebar from "@/components/sermons/sermon-sidebar";
import { useLangue } from "@/context/langue-context";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const activeItem = {
    name: tr("home.title"),
    email: "philippekacou.org",
    avatar: "/images/logo-pkacou3.jpeg",
  };

  const { setOpen } = useSidebar();
  const navigate = useNavigate();
  const { lng, langName } = useLangue();

  const [sideMenus, setSideMenus] = React.useState(menus);

  React.useEffect(() => {
    setSideMenus(menus);
  }, [lng]);

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons.*/}
      <Sidebar
        collapsible="none"
        className={`border-r w-[calc(var(--sidebar-width-icon)+1px)]! bg-muted`}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className={`md:h-8 -ml-1`}>
                <button
                  className="cursor-pointer"
                  onClick={() => navigate({ to: "/sermons" })}
                >
                  <div
                    className={`text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg`}
                  >
                    <Avatar>
                      <AvatarImage
                        alt="logo"
                        src={`/images/drapeau/${lng?.split("-")[0]}.jpg`}
                        className={`size-8 p-1.5 rounded-2xl -ml-1`}
                      ></AvatarImage>
                    </Avatar>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium uppercase text-white">
                      {activeItem.name}
                    </span>
                    <span className="truncate text-xs uppercase text-white">
                      {langName}
                    </span>
                  </div>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {sideMenus.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: tr(item.title),
                        hidden: false,
                      }}
                      onClick={() => {
                        navigate({ to: item.url });
                        setOpen(true);
                      }}
                      className="px-2.5 md:px-2 cursor-pointer"
                    >
                      <item.icon />
                      <span>{tr(item.title)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={activeItem} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <SermonSidebar></SermonSidebar>
    </Sidebar>
  );
}
