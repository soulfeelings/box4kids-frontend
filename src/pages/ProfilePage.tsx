import React from 'react';
import { ChevronRight, Edit, MapPin, Calendar, CreditCard, Bell, HelpCircle, LogOut, ArrowLeft } from 'lucide-react';
import { UserData } from '../types';

interface ProfilePageProps {
  userData: UserData;
  setShowProfile: (show: boolean) => void;
  BottomNavigation: React.ComponentType;
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
  deliveryTime
}) => {
  return (
    <div className={`bg-white rounded-lg px-4 py-3 mb-2 ${isLogout ? 'border-l-4 border-red-500' : ''}`}>
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
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <MapPin className="w-4 h-4 mr-1 text-red-500" />
                {deliveryAddress}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1 text-red-500" />
                {deliveryDate}, {deliveryTime}
              </div>
              <button className="text-sm text-blue-600 mt-2">
                Изменить адрес или дату доставки
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center ml-4">
          {isEditable && (
            <Edit className="w-4 h-4 text-gray-400 mr-2" />
          )}
          {hasArrow && (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ userData, setShowProfile, BottomNavigation }) => {
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20" style={{ fontFamily: 'Nunito, sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setShowProfile(false)}
              className="mr-3 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Профиль</h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Edit className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-4 py-6">
        {/* Name */}
        <ProfileItem 
          label="Имя" 
          value={userData.name} 
          isEditable={true}
        />

        {/* Phone */}
        <ProfileItem 
          label="Номер" 
          value={userData.phone} 
          isEditable={true}
        />

        {/* Delivery */}
        <ProfileItem 
          label="Доставка" 
          isDelivery={true}
          deliveryAddress={userData.deliveryAddress}
          deliveryDate={formatDeliveryDate(userData.deliveryDate)}
          deliveryTime={formatDeliveryTime(userData.deliveryTime)}
        />

        {/* Menu Items */}
        <div className="mt-6">
          <ProfileItem 
            label="История доставок" 
            hasArrow={true}
          />
          
          <ProfileItem 
            label="Платёжные данные" 
            hasArrow={true}
          />
          
          <ProfileItem 
            label="Уведомления" 
            hasArrow={true}
          />
          
          <ProfileItem 
            label="Поддержка" 
            hasArrow={true}
          />
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