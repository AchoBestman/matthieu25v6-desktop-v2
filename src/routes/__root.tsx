import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppSidebar } from "@/components/commons/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { menus } from "@/lib/menu";
import { ThemeToggleButton } from "@/components/commons/heme-toggle-button";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex justify-between shrink-0 items-center gap-2 border-b p-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                {menus.map((menu) => (
                  <Link
                    key={menu.url}
                    to={menu.url}
                    className="[&.active]:font-bold gap-2 p-2 "
                  >
                    <BreadcrumbLink href={menu.url}>
                      {menu.title}
                    </BreadcrumbLink>
                  </Link>
                ))}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center">
            <SidebarTrigger className="cursor-pointer text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-8 w-8 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white" />
            <ThemeToggleButton />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>

      <TanStackRouterDevtools />
    </React.Fragment>
  );
}
