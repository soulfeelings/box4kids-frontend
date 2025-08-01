import React from "react";
import { Skeleton } from "./Skeleton";

export const ProfilePageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-orange-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <Skeleton width="w-24" height="h-8" className="mb-2" />
        <Skeleton width="w-40" height="h-6" />
      </div>

      {/* Profile info */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton width="w-20" height="h-20" rounded="full" />
          <div className="flex-1">
            <Skeleton width="w-32" height="h-6" className="mb-2" />
            <Skeleton width="w-40" height="h-4" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton width="w-24" height="h-5" />
            <Skeleton width="w-32" height="h-5" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton width="w-20" height="h-5" />
            <Skeleton width="w-28" height="h-5" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton width="w-28" height="h-5" />
            <Skeleton width="w-24" height="h-5" />
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton width="w-6" height="h-6" />
                <Skeleton width="w-32" height="h-5" />
              </div>
              <Skeleton width="w-4" height="h-4" />
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