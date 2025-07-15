import { ChevronRight } from "lucide-react";

interface ProfileItemProps {
  label: string;
  value?: string;
  hasArrow?: boolean;
  isEditable?: boolean;
  icon?: React.ReactNode;
  isLogout?: boolean;
  customRadius?: string;
  isMenuItem?: boolean;
  onEditClick?: () => void;
}

export const ProfileItem: React.FC<ProfileItemProps> = ({
  label,
  value,
  hasArrow = false,
  isEditable = false,
  isLogout = false,
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
