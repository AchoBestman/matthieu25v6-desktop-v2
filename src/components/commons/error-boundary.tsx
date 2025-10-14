import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./error-fallback";

export default function ErrorBoundary({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} reset={resetErrorBoundary} />
      )}
    >
      {children}
    </ReactErrorBoundary>
  );
}
