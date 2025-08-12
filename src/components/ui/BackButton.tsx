import React from "react";

interface BackButtonProps {
  onClick: () => void;
  ariaLabel?: string;
  stroke?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  ariaLabel = "Назад",
  stroke = "black",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center ${className}`}
      style={{ minWidth: 40, minHeight: 40 }}
      aria-label={ariaLabel}
    >
      <svg
        width="18"
        height="14"
        viewBox="0 0 18 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 7H1M1 7L7 13M1 7L7 1"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

