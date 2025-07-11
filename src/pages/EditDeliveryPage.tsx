import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { UserData } from '../types';

interface EditDeliveryPageProps {
  userData: UserData;
  onClose: () => void;
  onSave: (userData: UserData) => void;
  BottomNavigation: React.ComponentType;
}

export const EditDeliveryPage: React.FC<EditDeliveryPageProps> = ({ 
  userData, 
  onClose, 
  onSave, 
  BottomNavigation 
}) => {
  const [deliveryAddress, setDeliveryAddress] = useState(userData.deliveryAddress || "");
  const [deliveryDate, setDeliveryDate] = useState(userData.deliveryDate || "");
  const [deliveryTime, setDeliveryTime] = useState(userData.deliveryTime || "");
  const [deliveryComments, setDeliveryComments] = useState(userData.deliveryComments || "");

  // Generate date options for next 14 days
  const generateDateOptions = () => {
    const options = [{ value: '', label: 'Выберите дату' }];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      const value = `${day}.${month}`;
      const dayOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()];
      const monthName = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'][date.getMonth()];
      
      let label;
      if (i === 0) {
        label = `Сегодня, ${day} ${monthName}`;
      } else if (i === 1) {
        label = `Завтра, ${day} ${monthName}`;
      } else {
        label = `${dayOfWeek}, ${day} ${monthName}`;
      }
      
      options.push({ value, label });
    }
    
    return options;
  };

  // Time options
  const timeOptions = [
    { value: '', label: 'Выберите время' },
    { value: '9-12', label: '9:00 - 12:00' },
    { value: '12-15', label: '12:00 - 15:00' },
    { value: '15-18', label: '15:00 - 18:00' },
    { value: '18-21', label: '18:00 - 21:00' }
  ];

  const dateOptions = generateDateOptions();

  // Check if form is valid
  const isFormValid = deliveryAddress.trim() && deliveryDate && deliveryTime;

  // Handle save
  const handleSave = () => {
    if (!isFormValid) return;

    const updatedUserData = {
      ...userData,
      deliveryAddress: deliveryAddress.trim(),
      deliveryDate,
      deliveryTime,
      deliveryComments: deliveryComments.trim()
    };

    onSave(updatedUserData);
    onClose();
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-20" style={{ fontFamily: 'Nunito, sans-serif' }}>
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-center relative">
          <h1 className="text-[20px] font-semibold text-gray-900 text-center">Изменить доставку</h1>
          <button 
            onClick={onClose}
            className="absolute right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Адрес */}
        <div>
          <label className="block text-gray-600 text-sm mb-3 px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Адрес
          </label>
          <div className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all relative ${
            deliveryAddress ? 'border-[#7782F5]' : 'border-gray-200 focus-within:border-[#7782F5]'
          }`}>
            <input
              type="text"
              className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 pr-9"
              placeholder="Введите адрес доставки"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            />
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
        </div>

        {/* Дата доставки */}
        <div>
          <label className="block text-gray-600 text-sm mb-3 px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Дата доставки
          </label>
          <div className="relative">
            <select
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 appearance-none focus:outline-none focus:border-[#7782F5] pr-12"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>

        {/* Время доставки */}
        <div>
          <label className="block text-gray-600 text-sm mb-3 px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Время доставки
          </label>
          <div className="relative">
            <select
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 appearance-none focus:outline-none focus:border-[#7782F5] pr-12"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {timeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>

        {/* Комментарий для курьера */}
        <div>
          <label className="block text-gray-600 text-sm mb-3 px-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Комментарий для курьера
          </label>
          <div className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
            deliveryComments ? 'border-[#7782F5]' : 'border-gray-200 focus-within:border-[#7782F5]'
          }`}>
            <textarea
              className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 resize-none"
              placeholder="Дополнительная информация для курьера"
              value={deliveryComments}
              onChange={(e) => setDeliveryComments(e.target.value)}
              rows={4}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-24 left-4 right-4">
        <button
          onClick={handleSave}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-[32px] font-medium text-base transition-all ${
            isFormValid
              ? 'text-white shadow-sm' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          style={{ 
            fontFamily: 'Nunito, sans-serif',
            backgroundColor: isFormValid ? '#30313D' : undefined
          }}
        >
          Сохранить
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
}; 