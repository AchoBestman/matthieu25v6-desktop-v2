import Dashboard from "@/components/commons/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Dashboard />;
}
