import React from "react";
import { X } from "lucide-react";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  onClose,
  className,
}) => {
  return (
    <div className={`w-full flex justify-between items-center ${className}`}>
      <div className="relative w-8 h-8"></div>
      <h2 className="text-xl text-gray-800">{title}</h2>
      <button
        onClick={onClose}
        className="flex justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl p-1 transition-colors"
      >
        <X size={20} className="text-gray-600" />
      </button>
    </div>
  );
};
