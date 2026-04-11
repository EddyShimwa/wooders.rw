'use client'

import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted/20">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  )
}
