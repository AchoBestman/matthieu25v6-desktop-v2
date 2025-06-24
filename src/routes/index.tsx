import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad() {
    throw redirect({
      to: "/sermons",
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/Index"!</div>;
}
