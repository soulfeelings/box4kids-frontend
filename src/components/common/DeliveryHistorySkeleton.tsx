import React from "react";
import { Skeleton } from "./Skeleton";

export const DeliveryHistorySkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-orange-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <Skeleton width="w-32" height="h-8" className="mb-2" />
        <Skeleton width="w-48" height="h-6" />
      </div>

      {/* Delivery history items */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Skeleton width="w-24" height="h-6" />
              <Skeleton width="w-16" height="h-6" rounded="full" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton width="w-4" height="h-4" rounded="full" />
                <Skeleton width="w-32" height="h-5" />
              </div>
              
              <div className="flex items-center gap-3">
                <Skeleton width="w-4" height="h-4" rounded="full" />
                <Skeleton width="w-40" height="h-5" />
              </div>
              
              <div className="flex items-center gap-3">
                <Skeleton width="w-4" height="h-4" rounded="full" />
                <Skeleton width="w-36" height="h-5" />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <Skeleton width="w-20" height="h-5" />
                <Skeleton width="w-24" height="h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 