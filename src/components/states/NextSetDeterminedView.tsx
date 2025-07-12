import React from 'react';
import { Star } from 'lucide-react';
import { UserData } from '../../types';

interface NextSetDeterminedViewProps {
  userData: UserData;
  BottomNavigation: React.ComponentType;
  currentToys: Array<{ icon: string; count: number; name: string; color: string }>;
  nextToys: Array<{ icon: string; count: number; name: string; color: string }>;
  rating: number;
  setShowAllToys: (show: boolean) => void;
  handleStarClick: (starIndex: number) => void;
  getCurrentDate: () => string;
  formatDeliveryDate: (dateString: string) => string;
  formatDeliveryTime: (timeString: string) => string;
}

export const NextSetDeterminedView: React.FC<NextSetDeterminedViewProps> = ({
  userData,
  BottomNavigation,
  currentToys,
  nextToys,
  rating,
  setShowAllToys,
  handleStarClick,
  getCurrentDate,
  formatDeliveryDate,
  formatDeliveryTime
}) => (
  <div className="w-full min-h-screen pb-24" style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: '#F2F2F2' }}>
    <div className="p-4" style={{ 
      backgroundColor: '#FFE8C8',
      opacity: 1,
      borderRadius: '0 0 24px 24px',
      aspectRatio: '46%'
    }}>
      <h1 className="font-semibold text-gray-800 mb-6" style={{ fontSize: '26px' }}>
        Привет, {userData.name}! 🦋
      </h1>

      {/* Current Set Card */}
      <div className="p-4 mb-4" style={{ backgroundColor: '#F0955E', borderRadius: '24px' }}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-white font-medium">Текущий набор</h2>
          <span className="text-white text-sm">{getCurrentDate()}</span>
        </div>
        
        <div className="space-y-2 mb-4">
          {currentToys.map((toy, index) => (
            <div key={index} className="flex items-center text-white">
              <div className="w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs" style={{ backgroundColor: toy.color }}>
                {toy.icon}
              </div>
              <span className="text-sm">x{toy.count} {toy.name}</span>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => setShowAllToys(true)}
          className="w-full text-white py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: '#F4B58E' }}
        >
          Показать все игрушки
        </button>
      </div>

      {/* Rating Section */}
      <div className="p-4 mb-6" style={{ backgroundColor: '#747EEC', borderRadius: '24px' }}>
        <h3 className="text-white font-medium mb-3">Как вам текущий набор?</h3>
        <div className="flex justify-center space-x-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <button
              key={index}
              onClick={() => handleStarClick(index)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={`${
                  index < rating
                    ? 'fill-[#FFDB28] text-[#FFDB28]'
                    : 'fill-[#BABFF6] text-[#BABFF6]'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Next Set Section */}
    <div className="p-4 flex-1" style={{ 
      backgroundColor: '#FFFFFF', 
      borderRadius: '24px', 
      marginTop: '16px',
      marginLeft: '16px',
      marginRight: '16px'
    }}>
      <h3 className="text-gray-800 font-medium mb-4">Следующий набор</h3>
      
      <div className="space-y-3 mb-6">
        {nextToys.map((toy, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-8 h-8 ${toy.color} rounded-full mr-3 flex items-center justify-center`}>
              {toy.icon}
            </div>
            <span className="text-gray-700 text-sm">x{toy.count} {toy.name}</span>
          </div>
        ))}
      </div>

      {/* Delivery Info */}
      <div className="p-4 mb-4" style={{ backgroundColor: '#F2F2F2', borderRadius: '16px' }}>
        <div>
          <p className="text-gray-600 text-sm mb-1">Доставка</p>
          <p className="text-gray-800 font-medium">{formatDeliveryDate(userData.deliveryDate)} • {formatDeliveryTime(userData.deliveryTime)}</p>
        </div>
      </div>

      {/* Change Interests Button */}
      <button 
        className="w-full text-gray-600 py-3 text-sm font-medium mb-8"
        style={{ backgroundColor: '#E3E3E3', borderRadius: '32px' }}
      >
        Изменить интересы ребенка
      </button>
    </div>

    <BottomNavigation />
  </div>
); 