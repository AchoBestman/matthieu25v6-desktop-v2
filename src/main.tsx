import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "@/context/theme-context";
import { SidebarProvider } from "./components/ui/sidebar";
import { LangueProvider } from "./context/langue-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AudioPlayerProvider } from "./context/audio-player-context";
import SongPlayer from "@/components/buttons/player-button";
import { SermonProvider } from "@/context/sermon-context";
import { DownloadHistoryProvider } from "./context/download-history-context";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  const queryClient = new QueryClient();
  root.render(
    <StrictMode>
      <LangueProvider>
        <QueryClientProvider client={queryClient}>
          <DownloadHistoryProvider>
          <AudioPlayerProvider>
            <SongPlayer darkColor="white" lightColor="white" />
            <ThemeProvider>
              <SermonProvider>
                <SidebarProvider
                  style={
                    {
                      "--sidebar-width": "350px",
                    } as React.CSSProperties
                  }
                >
                  <RouterProvider router={router} />
                </SidebarProvider>
              </SermonProvider>
            </ThemeProvider>
          </AudioPlayerProvider>
          </DownloadHistoryProvider>
        </QueryClientProvider>
      </LangueProvider>
    </StrictMode>
  );
}
