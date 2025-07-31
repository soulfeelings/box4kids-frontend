import React from "react";
import { useTranslation } from 'react-i18next';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
  children,
  variant = "primary",
  className = "",
}) => {
  const { t } = useTranslation();
  const baseClasses =
    "w-full py-3 px-4 rounded-[32px] font-medium text-base transition-all";

  const variantClasses = {
    primary: "bg-gray-800 text-white hover:bg-gray-700",
    secondary: "bg-[#E3E3E3] text-black hover:bg-gray-200",
    danger: "bg-[#FBC8D5] text-[#E14F75] hover:bg-red-100",
  };

  const disabledClasses = "bg-gray-300 text-gray-500 cursor-not-allowed";

  const buttonClasses = `${baseClasses} ${
    disabled || isLoading ? disabledClasses : variantClasses[variant]
  } ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {isLoading ? t('saving') : children}
    </button>
  );
};
