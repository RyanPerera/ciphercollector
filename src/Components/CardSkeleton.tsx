import { memo } from "react";
import { Skeleton } from "./ui/skeleton";

function CardSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-80 w-[14rem] rounded-[14px]" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export const CardSkeletonGrid = memo(function CardSkeletonGrid({
  count = 50,
}: {
  count?: number;
}) {
  const safeCount = Math.max(1, count);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-10">
      {Array.from({ length: safeCount }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
});
