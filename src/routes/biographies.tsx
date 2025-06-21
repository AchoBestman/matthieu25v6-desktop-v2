import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/biographies")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/biographies"!</div>;
}
