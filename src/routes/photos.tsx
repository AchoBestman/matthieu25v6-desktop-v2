import ListPhoto from "@/components/images/list-photo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/photos")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-10 bg-pkp-sand">
      <ListPhoto></ListPhoto>
    </div>
  );
}
