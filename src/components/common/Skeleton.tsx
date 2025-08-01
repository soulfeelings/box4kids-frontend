import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "w-full",
  height = "h-4",
  rounded = "md",
}) => {
  const roundedClass = `rounded-${rounded}`;
  
  return (
    <div
      className={`${width} ${height} ${roundedClass} bg-gray-300 animate-pulse ${className}`}
    />
  );
}; 