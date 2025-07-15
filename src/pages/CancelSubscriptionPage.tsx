import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CancelSubscriptionPage: React.FC = () => {
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1);
  };

  const onConfirm = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Остановить подписку?
        </h1>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-32">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Остановить подписку?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Мы приостановим доставку коробок
                <br />
                и подбор игрушек. Вы сможете возобновить
                <br />
                подписку в любой момент.
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <button
                onClick={onConfirm}
                className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-full transition-colors"
              >
                Остановить подписку
              </button>

              <button
                onClick={onCancel}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-full transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
