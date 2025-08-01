import React from "react";
import { Skeleton } from "./Skeleton";

export const ChildrenPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-orange-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <Skeleton width="w-32" height="h-8" className="mb-2" />
        <Skeleton width="w-48" height="h-6" />
      </div>

      {/* Children cards */}
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton width="w-16" height="h-16" rounded="full" />
              <div className="flex-1">
                <Skeleton width="w-32" height="h-6" className="mb-2" />
                <Skeleton width="w-24" height="h-4" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton width="w-20" height="h-6" rounded="full" />
                <Skeleton width="w-24" height="h-6" rounded="full" />
              </div>
              
              <div className="flex gap-2">
                <Skeleton width="w-16" height="h-8" rounded="lg" />
                <Skeleton width="w-20" height="h-8" rounded="lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add child button */}
      <div className="fixed bottom-6 right-6">
        <Skeleton width="w-14" height="h-14" rounded="full" />
      </div>
    </div>
  );
}; 