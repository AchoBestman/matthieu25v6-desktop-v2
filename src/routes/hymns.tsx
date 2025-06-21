import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hymns")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/hymns"!</div>;
}
