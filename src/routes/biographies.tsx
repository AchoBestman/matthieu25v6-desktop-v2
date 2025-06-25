import { useLangue } from "@/context/langue-context";
import { useSermon } from "@/context/sermon-context";
import { useTheme } from "@/context/theme-context";
import { resources } from "@/lib/resources";
import { findBy } from "@/lib/resources/biography";
import { tr } from "@/translation";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import PageLoader from "@/components/loaders/page-loader";

export const Route = createFileRoute("/biographies")({
  component: RouteComponent,
});

function RouteComponent() {
  const { lng } = useLangue();
  const { theme } = useTheme();
  const { fontSize } = useSermon();

  const {
    data: biography,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["biographies", lng],
    queryFn: () => findBy(resources.biographies, lng),
  });

  return (
    <div className="mt-10">
      {isLoading && tr("home.waiting")}
      {isError && tr("home.search_not_found_pred_message")}
      <PageLoader
        loadMessage={
          isLoading
            ? tr("home.waiting")
            : tr("home.search_not_found_pred_message")
        }
        isLoading={!biography || isLoading || isError}
      >
        <div>
          <div className="w-full">
            <img
              alt="background"
              className="float-left pr-4 mt-2"
              width={200}
              height={200}
              src={`/images/photo-prophete.jpg`}
            />
          </div>
          <div
            style={{ fontSize }}
            dangerouslySetInnerHTML={{
              __html: `${biography?.description}`
                .replace(
                  /<(h1|h2)>/g,
                  `<strong style="color:${theme === "dark" ? "orange" : "#7b3d1a"} !important; font-size: 22px;"><$1>`
                )
                .replace(/<\/(h1|h2)>/g, "</strong></$1>"),
            }}
            className="text-justify w-11.5/12 mt-4 sm:mt-0 sm:w-full"
          ></div>
        </div>
      </PageLoader>
    </div>
  );
}
