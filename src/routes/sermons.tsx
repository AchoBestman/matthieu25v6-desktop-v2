import { resources } from "@/lib/resources";
import { findBy } from "@/lib/resources/sermon";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/sermons")({
  component: RouteComponent,
});

type SearchType = {
  number: number;
  verse_number?: number;
  fontSize: number;
};
function RouteComponent() {
  const { search } = useLocation() as {
    search: SearchType;
  };

  const {
    data: sermon,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sermons", search, "lng"],
    queryFn: () =>
      findBy(resources.sermons, "en-en", {
        column: "number",
        value: search.number,
      }),
  });
  console.log(sermon);
  return (
    <div>
      Hello "/sermons"! number:{search.number} vers:{search.verse_number}{" "}
      fontSize {search.fontSize}
      {sermon?.title}
    </div>
  );
}
