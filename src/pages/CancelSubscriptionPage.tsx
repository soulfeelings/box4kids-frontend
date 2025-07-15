import React from "react";
import { useNavigate } from "react-router-dom";
import { useCancelSubscriptionParams } from "../hooks/useTypedParams";
import { useStore } from "../store/store";
import { ModalHeader } from "../components/common/ModalHeader";

export const CancelSubscriptionPage: React.FC = () => {
  const { getChildById } = useStore();
  const { childId } = useCancelSubscriptionParams();
  const navigate = useNavigate();

  const child = childId ? getChildById(parseInt(childId)) : null;

  if (!child) {
    return <div>Child not found</div>;
  }

  const onCancel = () => {
    navigate(-1);
  };

  const onConfirm = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center p-4">
        <ModalHeader
          className="mb-8"
          title="Остановить подписку?"
          onClose={onCancel}
        />

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-600 leading-relaxed">
            Мы приостановим доставку коробок и подбор игрушек. Вы сможете
            возобновить подписку в любой момент.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={onConfirm}
            className="w-full h-14 bg-[#FBC8D5] hover:bg-[#F9B8C8] text-[#E14F75] py-4 px-4 rounded-[32px] transition-colors"
          >
            Остановить подписку
          </button>

          <button
            onClick={onCancel}
            className="w-full h-14 bg-[#E3E3E3] hover:bg-[#D3D3D3] text-gray-800 py-4 px-4 rounded-[32px] transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};
