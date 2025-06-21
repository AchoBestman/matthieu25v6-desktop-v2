import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/videos")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-red-700">
      Hello "/videos"! Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Nihil adipisci architecto accusamus amet deleniti quidem nemo culpa quo
      laborum veritatis at asperiores repellendus, neque eos nam perspiciatis
      voluptatibus nulla incidunt?
    </div>
  );
}
