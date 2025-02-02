import { Skeleton } from "~components/ui/skeleton"

export function OverlaySkeleton() {
  return (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="flex gap-4 items-center *:h-8 *:w-8">
          <Skeleton />
          <Skeleton />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {new Array(4).fill(null).map((_) => (
          <div className="flex flex-col gap-4">
            {/* definition */}
            <Skeleton className="w-40 h-4" />

            <div className="flex flex-col gap-1">
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-full h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
