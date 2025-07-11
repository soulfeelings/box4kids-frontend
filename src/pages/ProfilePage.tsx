import React, { useState } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { UserData } from '../types';
import { DeliveryHistoryPage } from './DeliveryHistoryPage';
import { SupportPage } from './SupportPage';
import { EditNamePage } from './EditNamePage';
import { EditPhonePage } from './EditPhonePage';
import { EditDeliveryPage } from './EditDeliveryPage';

interface ProfilePageProps {
  userData: UserData;
  setShowProfile: (show: boolean) => void;
  BottomNavigation: React.ComponentType;
  onUpdateUserData: (userData: UserData) => void;
}

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

const ProfileItem: React.FC<ProfileItemProps> = ({ 
  label, 
  value, 
  hasArrow = false, 
  isEditable = false, 
  icon,
  isDelivery = false,
  isLogout = false,
  deliveryAddress,
  deliveryDate,
  deliveryTime,
  customRadius = 'rounded-lg',
  isMenuItem = false,
  onEditClick
}) => {
  const backgroundColor = isMenuItem || isLogout ? 'bg-[#FFFFFF]' : 'bg-[#F2F2F2]';
  
  return (
    <div className={`${backgroundColor} ${customRadius} px-4 py-3 mb-2`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className={`text-sm ${isLogout ? 'text-red-500' : 'text-gray-600'} mb-1`}>
            {label}
          </div>
          {value && (
            <div className={`text-base ${isLogout ? 'text-red-500' : 'text-gray-900'}`}>
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
                <button 
                  onClick={onEditClick}
                  className="w-full bg-[#E3E3E3] text-sm text-black py-2 px-4 rounded-[32px] text-center hover:bg-gray-300 transition-colors"
                >
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
          {hasArrow && (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ userData, setShowProfile, BottomNavigation, onUpdateUserData }) => {
  const [showDeliveryHistory, setShowDeliveryHistory] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [showEditPhone, setShowEditPhone] = useState(false);
  const [showEditDelivery, setShowEditDelivery] = useState(false);

  // Helper function to format delivery date
  const formatDeliveryDate = (dateString: string) => {
    if (!dateString || !dateString.includes('.')) return dateString;
    
    const [day, month] = dateString.split('.');
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, parseInt(month) - 1, parseInt(day));
    
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    
    const daysOfWeek = [
      'воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'
    ];
    
    const monthName = months[date.getMonth()];
    const dayOfWeek = daysOfWeek[date.getDay()];
    
    return `${day} ${monthName}, ${dayOfWeek}`;
  };

  // Helper function to format delivery time
  const formatDeliveryTime = (timeString: string) => {
    if (!timeString || !timeString.includes('-')) return timeString;
    
    const [startTime, endTime] = timeString.split('-');
    const formatHour = (hour: string) => {
      const h = parseInt(hour);
      return h.toString().padStart(2, '0') + ':00';
    };
    
    return `${formatHour(startTime)}–${formatHour(endTime)}`;
  };

  // Handle delivery history click
  const handleDeliveryHistoryClick = () => {
    setShowDeliveryHistory(true);
  };

  // Handle support click
  const handleSupportClick = () => {
    setShowSupport(true);
  };

  // Handle edit name click
  const handleEditNameClick = () => {
    setShowEditName(true);
  };

  // Handle save name
  const handleSaveName = (newName: string) => {
    const updatedUserData = { ...userData, name: newName };
    onUpdateUserData(updatedUserData);
  };

  // Handle edit phone click
  const handleEditPhoneClick = () => {
    setShowEditPhone(true);
  };

  // Handle save phone
  const handleSavePhone = (newPhone: string) => {
    const updatedUserData = { ...userData, phone: newPhone };
    onUpdateUserData(updatedUserData);
  };

  // Handle edit delivery click
  const handleEditDeliveryClick = () => {
    setShowEditDelivery(true);
  };

  // Handle save delivery
  const handleSaveDelivery = (updatedUserData: UserData) => {
    onUpdateUserData(updatedUserData);
  };

  // Show delivery history page if requested
  if (showDeliveryHistory) {
    return (
      <DeliveryHistoryPage
        onClose={() => setShowDeliveryHistory(false)}
        BottomNavigation={BottomNavigation}
      />
    );
  }

  // Show support page if requested
  if (showSupport) {
    return (
      <SupportPage
        onClose={() => setShowSupport(false)}
        BottomNavigation={BottomNavigation}
      />
    );
  }

  // Show edit name page if requested
  if (showEditName) {
    return (
      <EditNamePage
        currentName={userData.name}
        onClose={() => setShowEditName(false)}
        onSave={handleSaveName}
        BottomNavigation={BottomNavigation}
      />
    );
  }

  // Show edit phone page if requested
  if (showEditPhone) {
    return (
      <EditPhonePage
        currentPhone={userData.phone}
        onClose={() => setShowEditPhone(false)}
        onSave={handleSavePhone}
        BottomNavigation={BottomNavigation}
      />
    );
  }

  // Show edit delivery page if requested
  if (showEditDelivery) {
    return (
      <EditDeliveryPage
        userData={userData}
        onClose={() => setShowEditDelivery(false)}
        onSave={handleSaveDelivery}
        BottomNavigation={BottomNavigation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-20" style={{ fontFamily: 'Nunito, sans-serif' }}>
      {/* Profile Content */}
      <div className="px-4 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => setShowProfile(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Name */}
        <ProfileItem 
          label="Имя" 
          value={userData.name} 
          isEditable={true}
          customRadius="rounded-[24px]"
          onEditClick={handleEditNameClick}
        />

        {/* Phone */}
        <ProfileItem 
          label="Номер" 
          value={userData.phone} 
          isEditable={true}
          customRadius="rounded-[24px]"
          onEditClick={handleEditPhoneClick}
        />

        {/* Delivery */}
        <ProfileItem 
          label="Доставка" 
          isDelivery={true}
          deliveryAddress={userData.deliveryAddress}
          deliveryDate={formatDeliveryDate(userData.deliveryDate)}
          deliveryTime={formatDeliveryTime(userData.deliveryTime)}
          customRadius="rounded-[24px]"
          onEditClick={handleEditDeliveryClick}
        />

        {/* Menu Items */}
        <div className="mt-6">
          <div onClick={handleDeliveryHistoryClick} className="cursor-pointer">
            <ProfileItem 
              label="История доставок" 
              hasArrow={true}
              isMenuItem={true}
            />
          </div>
          
          <ProfileItem 
            label="Платёжные данные" 
            hasArrow={true}
            isMenuItem={true}
          />
          
          <ProfileItem 
            label="Уведомления" 
            hasArrow={true}
            isMenuItem={true}
          />
          
          <div onClick={handleSupportClick} className="cursor-pointer">
            <ProfileItem 
              label="Поддержка" 
              hasArrow={true}
              isMenuItem={true}
            />
          </div>
        </div>

        {/* Logout */}
        <div className="mt-6">
          <ProfileItem 
            label="Выйти" 
            isLogout={true}
          />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}; 