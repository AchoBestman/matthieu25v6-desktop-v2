import ListVideo from "@/components/videos/list-video";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/videos")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-1">
      <ListVideo></ListVideo>
    </div>
  );
}
