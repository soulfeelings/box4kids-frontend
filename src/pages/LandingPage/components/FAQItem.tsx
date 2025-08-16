import { useState } from "react";

interface FAQItemProps {
  item: {
    id: number;
    question: string;
    answer: string;
  };
  isLast: boolean;
}

export const FAQItem = ({ item, isLast }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFaq = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`p-6 ${!isLast ? "border-b border-gray-100" : ""}`}>
      <div className="flex items-center cursor-pointer" onClick={toggleFaq}>
        <div className="w-8 h-8 bg-gray-100 rounded-full flex flex-shrink-0 items-center justify-center mr-4">
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform ${
              isOpen ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
        <h3 className="font-medium text-gray-800 text-lg flex-1">
          {item.question}
        </h3>
      </div>
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
};
