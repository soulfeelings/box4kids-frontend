import React from "react";

interface DevModeBannerProps {
  message?: string;
}

export const DevModeBanner: React.FC<DevModeBannerProps> = ({
  message = "🛠️ DEV MODE: Получаем код автоматически...",
}) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
      <div className="flex items-center gap-2">
        <div className="animate-spin w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
        <p
          className="text-sm font-medium text-yellow-700"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {message}
        </p>
      </div>
    </div>
  );
};
