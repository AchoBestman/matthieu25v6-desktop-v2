"use client";

import {
  ChevronsUpDown,
  Home,
  Mail,
  Navigation,
  Phone,
  PhoneCall,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { open as OpenTauri } from "@tauri-apps/plugin-shell";

export function NavUser({
  user,
}: Readonly<{
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}>) {
  const { isMobile } = useSidebar();

  const openLink = async (url: string) => {
    try {
      await OpenTauri(url);
    } catch (error) {
      console.error("Erreur lors de l'ouverture du lien:", error);
      // Fallback : ouvrir dans le navigateur classique
      window.open(url, "_blank");
    }
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">
                    <button
                      onClick={() => openLink(`https://${user.email}`)}
                      className="text-primary cursor-pointer"
                    >
                      {user.email}
                    </button>
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Mail />
                <button
                  className="cursor-pointer"
                  onClick={() => openLink("mailto:mat25v6.msg@gmail.com")}
                >
                  mat25v6.msg@gmail.com
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Home />
                <span>{"BP 374 Sikensi (Côte d'Ivoire)"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone />
                {"(+225) 0757585000"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PhoneCall />
                {"(+225) 0757585000"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Navigation />
              <button
                onClick={() => openLink(`https://${user.email}`)}
                className="text-primary cursor-pointer"
              >
                {user.email}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
