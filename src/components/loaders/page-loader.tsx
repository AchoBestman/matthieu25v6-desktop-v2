import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

function PageLoaderSkeleton({
  loadMessage,
}: Readonly<{ loadMessage: string }>) {
  return (
    <div className="flex-col justify-center space-y-6 -mt-4">
      {/* Header skeleton */}
      <span className="dark:text-gray-400">{loadMessage}</span>
      <Skeleton className="h-8 w-2/3 darkss:bg-gray-400 bg-gray-400" />
      <Skeleton className="h-6 w-1/2 darks:bg-amber-800 bg-gray-400" />
      {/* content skeleton (simulate 4 contents) */}
      {[...Array(8)].map((_, i) => (
        <div className="space-y-2" key={i}>
          <Skeleton className="h-4 w-3/4 darks:bg-amber-800 bg-gray-400" />
          <Skeleton className="h-4 w-full darks:bg-amber-800 bg-gray-400" />
        </div>
      ))}
    </div>
  );
}

function PageLoaderContent({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <motion.div
      className="relatives -mt-8 min-h-[200px]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const PageLoader = ({
  loadMessage,
  children,
  isLoading,
}: {
  children: React.ReactNode;
  isLoading: boolean;
  loadMessage: string;
}) => {
  if (isLoading) {
    return <PageLoaderSkeleton loadMessage={loadMessage} />;
  }
  return <PageLoaderContent>{children}</PageLoaderContent>;
};

export default PageLoader;
