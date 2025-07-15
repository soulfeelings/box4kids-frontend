import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { BottomNavigation } from '../features/BottomNavigation';

interface SupportPageProps {
  onClose?: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onClose }) => {
  const handleWhatsAppClick = () => {
    // Здесь можно добавить логику для открытия WhatsApp
    window.open('https://wa.me/your_whatsapp_number', '_blank');
  };

  const handleTelegramClick = () => {
    // Здесь можно добавить логику для открытия Telegram
    window.open('https://t.me/your_telegram_username', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-20" style={{ fontFamily: 'Nunito, sans-serif' }}>
      {/* Back Button */}
      <div className="px-4 pt-6 pb-4">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Title */}
      <div className="px-4 pb-6 relative">
        <h1 className="text-[20px] font-semibold text-gray-900 text-center">Служба поддержки</h1>
        <button 
          onClick={onClose}
          className="absolute right-4 top-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4">
        {/* Description */}
        <div className="mb-8 text-left">
          <p className="text-base text-gray-600 leading-relaxed">
            Возникли проблемы с приложением?<br />
            Напишите нам — мы поможем!
          </p>
        </div>

        {/* Contact Buttons */}
        <div className="space-y-0">
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-[#FFFFFF] rounded-lg px-4 py-4 flex items-center hover:bg-gray-100 transition-colors"
          >
            <div className="bg-[#F2F2F2] rounded-[12px] w-10 h-10 flex items-center justify-center mr-3">
              <img 
                src="/illustrations/whatsup.png" 
                alt="WhatsApp" 
                className="w-5 h-5"
              />
            </div>
            <span className="text-base text-gray-900 font-medium">Написать в WhatsApp</span>
          </button>

          {/* Telegram Button */}
          <button
            onClick={handleTelegramClick}
            className="w-full bg-[#FFFFFF] rounded-lg px-4 py-4 flex items-center hover:bg-gray-100 transition-colors"
          >
            <div className="bg-[#F2F2F2] rounded-[12px] w-10 h-10 flex items-center justify-center mr-3">
              <img 
                src="/illustrations/Telegram.png" 
                alt="Telegram" 
                className="w-5 h-5"
              />
            </div>
            <span className="text-base text-gray-900 font-medium">Написать в Telegram</span>
          </button>
        </div>
      </div>

      <BottomNavigation
        currentScreen="profile"
        onHomeClick={() => {}}
        onChildrenClick={() => {}}
        onProfileClick={() => {}}
      />
    </div>
  );
}; 