import React from "react";

export const LoadingComponent: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-11/12 max-w-sm text-center relative">
        <div className="mb-8">
          <h2 className="text-gray-800 text-lg font-semibold tracking-wide">
            BOX4BABY
          </h2>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-8">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
          </div>

          {/* <h3 className="text-gray-800 text-2xl font-semibold mb-4">
            Загрузка данных...
          </h3>
          <p className="text-gray-600 text-base leading-relaxed max-w-xs">
            Пожалуйста, подождите, мы загружаем данные для вашего ребёнка.
          </p> */}
        </div>
      </div>
    </div>
  );
};
