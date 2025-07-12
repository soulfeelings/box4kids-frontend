import React from 'react';
import { ChevronDown } from 'lucide-react';
import { UserData } from '../../types';

interface NextSetNotDeterminedViewProps {
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

export const NextSetNotDeterminedView: React.FC<NextSetNotDeterminedViewProps> = ({
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

      {/* Current Set Header */}
      <div className="mx-4 mb-4" style={{ backgroundColor: '#F0955E', borderRadius: '24px' }}>
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center">
            <span className="text-white font-medium">Текущий набор</span>
            <span className="text-white mx-2">•</span>
            <span className="text-white">{getCurrentDate()}</span>
          </div>
          <button 
            onClick={() => setShowAllToys(true)}
            className="p-1"
          >
            <ChevronDown className="w-5 h-5 text-white" />
          </button>
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
            <div className={`w-8 h-8 ${getToyColorClass(toy.name)} rounded-full mr-3 flex items-center justify-center`}>
              {getToyIcon(toy.name)}
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

// Helper functions for toy display
const getToyIcon = (toyName: string): string => {
  const iconMap: { [key: string]: string } = {
    'Конструктор': '🔧',
    'Творческий набор': '🎨',
    'Мягкая игрушка': '🧸',
    'Головоломка': '🧩'
  };
  return iconMap[toyName] || '🎁';
};

const getToyColorClass = (toyName: string): string => {
  const colorMap: { [key: string]: string } = {
    'Конструктор': 'bg-blue-200',
    'Творческий набор': 'bg-green-200',
    'Мягкая игрушка': 'bg-orange-200',
    'Головоломка': 'bg-yellow-200'
  };
  return colorMap[toyName] || 'bg-gray-200';
}; 