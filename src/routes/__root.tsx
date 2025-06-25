import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/commons/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { menus } from "@/lib/menu";
import { ThemeToggleButton } from "@/components/buttons/heme-toggle-button";
import LangueDropdown from "@/components/commons/langue-dropdown";
import { tr } from "@/translation";
import { useLangue } from "@/context/langue-context";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { lng } = useLangue();
  const [topMenus, setTopMenus] = React.useState(menus);

  React.useEffect(() => {
    setTopMenus(menus);
  }, [lng]);
  return (
    <React.Fragment>
      <AppSidebar />
      <SidebarInset className="bg-muted">
        <header className="bg-amber-800 sticky top-0 flex justify-between shrink-0 items-center gap-2 border-b p-4 z-30">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                {topMenus.map((menu) => (
                  <Link
                    key={menu.url}
                    to={menu.url}
                    className="[&.active]:font-bold gap-2 p-2 text-white"
                  >
                    <BreadcrumbLink href={menu.url}>
                      {tr(menu.title)}
                    </BreadcrumbLink>
                  </Link>
                ))}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center">
            <SidebarTrigger className="cursor-pointer text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-8 w-8 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white" />
            <ThemeToggleButton />
            <LangueDropdown />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>

      {/* <TanStackRouterDevtools /> */}
    </React.Fragment>
  );
}
