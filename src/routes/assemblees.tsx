import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/assemblees')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/assemblees"!</div>
}
