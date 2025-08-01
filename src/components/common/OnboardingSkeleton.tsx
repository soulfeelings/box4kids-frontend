import React from "react";
import { Skeleton } from "./Skeleton";

export const OnboardingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton width="w-32" height="h-8" className="mb-4" />
        <Skeleton width="w-48" height="h-6" className="mb-2" />
        <Skeleton width="w-64" height="h-4" />
      </div>

      {/* Main content skeleton */}
      <div className="space-y-6">
        {/* Form fields */}
        <div className="space-y-4">
          <Skeleton width="w-24" height="h-4" className="mb-2" />
          <Skeleton width="w-full" height="h-12" rounded="lg" />
          
          <Skeleton width="w-32" height="h-4" className="mb-2" />
          <Skeleton width="w-full" height="h-12" rounded="lg" />
          
          <Skeleton width="w-28" height="h-4" className="mb-2" />
          <Skeleton width="w-full" height="h-12" rounded="lg" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="space-y-3">
              <Skeleton width="w-full" height="h-24" rounded="lg" />
              <Skeleton width="w-3/4" height="h-4" />
              <Skeleton width="w-1/2" height="h-3" />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <Skeleton width="w-24" height="h-10" rounded="lg" />
          <Skeleton width="w-32" height="h-10" rounded="lg" />
        </div>
      </div>
    </div>
  );
}; 