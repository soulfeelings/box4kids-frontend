import { ChevronRight } from "lucide-react";

interface ProfileItemProps {
  label: string;
  value?: string;
  hasArrow?: boolean;
  isEditable?: boolean;
  icon?: React.ReactNode;
  isDelivery?: boolean;
  isLogout?: boolean;
  deliveryAddress?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  customRadius?: string;
  isMenuItem?: boolean;
  onEditClick?: () => void;
}

export const ProfileItem: React.FC<ProfileItemProps> = ({
  label,
  value,
  hasArrow = false,
  isEditable = false,
  isDelivery = false,
  isLogout = false,
  deliveryAddress,
  deliveryDate,
  deliveryTime,
  customRadius = "rounded-lg",
  isMenuItem = false,
  onEditClick,
}) => {
  const backgroundColor =
    isMenuItem || isLogout ? "bg-[#FFFFFF]" : "bg-[#F2F2F2]";

  return (
    <div className={`${backgroundColor} ${customRadius} px-4 py-3 mb-2`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div
            className={`text-sm ${
              isLogout ? "text-red-500" : "text-gray-600"
            } mb-1`}
          >
            {label}
          </div>
          {value && (
            <div
              className={`text-base ${
                isLogout ? "text-red-500" : "text-gray-900"
              }`}
            >
              {value}
            </div>
          )}
          {isDelivery && (
            <div className="mt-2">
              <div className="flex items-center text-base text-black mb-1">
                <div className="bg-[#F9F9F9] rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  <span className="text-xs">📍</span>
                </div>
                {deliveryAddress}
              </div>
              <div className="flex items-center text-base text-black">
                <div className="bg-[#F9F9F9] rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  <span className="text-xs">🗓</span>
                </div>
                {deliveryDate}, {deliveryTime}
              </div>
              <div className="mt-3">
                <button className="w-full bg-[#E3E3E3] text-sm text-black py-2 px-4 rounded-[32px] text-center hover:bg-gray-300 transition-colors">
                  Изменить адрес или дату доставки
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center ml-4">
          {isEditable && (
            <button
              onClick={onEditClick}
              className="bg-[#E3E3E3] rounded-full p-2 mr-2 hover:bg-gray-300 transition-colors"
            >
              <img
                src="/illustrations/pen.png"
                alt="Edit"
                className="w-4 h-4"
              />
            </button>
          )}
          {hasArrow && <ChevronRight className="w-5 h-5 text-gray-400" />}
        </div>
      </div>
    </div>
  );
};
