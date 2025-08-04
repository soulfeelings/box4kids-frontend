import React from "react";
import { Skeleton } from "./Skeleton";

export const MainPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-orange-50 p-4">
      {/* Header with date */}
      <div className="mb-6">
        <Skeleton width="w-32" height="h-6" className="mb-2" />
        <Skeleton width="w-48" height="h-8" />
      </div>

      {/* Current box card skeleton */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Skeleton width="w-24" height="h-5" />
          <Skeleton width="w-16" height="h-6" rounded="full" />
        </div>
        
        <div className="space-y-4">
          <Skeleton width="w-3/4" height="h-6" />
          <Skeleton width="w-1/2" height="h-4" />
          
          <div className="flex gap-4 mt-4">
            <Skeleton width="w-20" height="h-8" rounded="lg" />
            <Skeleton width="w-24" height="h-8" rounded="lg" />
          </div>
        </div>
      </div>

      {/* Next box card skeleton */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Skeleton width="w-20" height="h-5" />
          <Skeleton width="w-12" height="h-6" rounded="full" />
        </div>
        
        <div className="space-y-4">
          <Skeleton width="w-2/3" height="h-6" />
          <Skeleton width="w-1/2" height="h-4" />
          
          <div className="flex gap-4 mt-4">
            <Skeleton width="w-20" height="h-8" rounded="lg" />
            <Skeleton width="w-24" height="h-8" rounded="lg" />
          </div>
        </div>
      </div>

      {/* Children cards skeleton */}
      <div className="space-y-4">
        {[1, 2].map((item) => (
          <div key={item} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton width="w-12" height="h-12" rounded="full" />
              <div className="flex-1">
                <Skeleton width="w-24" height="h-5" className="mb-1" />
                <Skeleton width="w-32" height="h-4" />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Skeleton width="w-16" height="h-6" rounded="full" />
              <Skeleton width="w-20" height="h-6" rounded="full" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom navigation skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-around">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex flex-col items-center">
              <Skeleton width="w-6" height="h-6" className="mb-1" />
              <Skeleton width="w-8" height="h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 