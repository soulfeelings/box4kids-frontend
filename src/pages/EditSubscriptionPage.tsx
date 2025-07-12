import React, { useState } from 'react';
import { X } from 'lucide-react';
import { UserData } from '../types';

interface EditSubscriptionPageProps {
  child: UserData['children'][0];
  onClose: () => void;
  onSave: (updatedChild: UserData['children'][0]) => void;
  BottomNavigation: React.ComponentType;
}

export const EditSubscriptionPage: React.FC<EditSubscriptionPageProps> = ({ 
  child, 
  onClose, 
  onSave, 
  BottomNavigation 
}) => {
  const [selectedSubscription, setSelectedSubscription] = useState<"base" | "premium" | "">(child.subscription);

  // Get plan items based on subscription type
  const getPlanItems = (subscription: "base" | "premium") => {
    if (subscription === 'premium') {
      return [
        { icon: '🔧', count: 3, name: 'Конструктор', color: '#A4B9ED' },
        { icon: '🎨', count: 2, name: 'Творческий набор', color: '#D4E8C0' },
        { icon: '🧸', count: 2, name: 'Мягкая игрушка', color: '#FFD8BE' },
        { icon: '🧠', count: 1, name: 'Головоломка', color: '#F6E592' },
        { icon: '💎', count: 1, name: 'Премиум-игрушка', color: '#E8D3F0' }
      ];
    }
    return [
      { icon: '🔧', count: 2, name: 'Конструктор', color: '#A4B9ED' },
      { icon: '🎨', count: 2, name: 'Творческий набор', color: '#D4E8C0' },
      { icon: '🧸', count: 1, name: 'Мягкая игрушка', color: '#FFD8BE' },
      { icon: '🧠', count: 1, name: 'Головоломка', color: '#F6E592' }
    ];
  };

  const handleSave = () => {
    if (selectedSubscription === "base" || selectedSubscription === "premium") {
      const updatedChild = {
        ...child,
        subscription: selectedSubscription
      };
      
      onSave(updatedChild);
      onClose();
    }
  };

  const isFormValid = selectedSubscription === "base" || selectedSubscription === "premium";

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-32" style={{ fontFamily: 'Nunito, sans-serif' }}>
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-center relative">
          <h1 className="text-[20px] font-semibold text-gray-900 text-center">
            Изменение тарифа для {child.name}
          </h1>
          <button 
            onClick={onClose}
            className="absolute right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-32">
        {/* Info Alert */}
        <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 mb-6">
          <p className="text-sm font-medium text-indigo-700 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Мы подбираем игрушки вручную, с учётом интересов. Хотите поменять состав набора? Просто обновите интересы ребёнка
          </p>
        </div>

        <div className="space-y-4">
          {/* Base Subscription */}
          <div 
            className={`rounded-3xl p-6 shadow-sm border transition-all cursor-pointer ${
              selectedSubscription === 'base' 
                ? 'border-indigo-400' 
                : 'border-gray-100 hover:border-gray-300'
            }`} 
            style={{ 
              backgroundColor: '#F2F2F2'
            }}
            onClick={() => setSelectedSubscription('base')}
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Базовый
              </h3>
              <span className="text-gray-500">•</span>
              <span className="text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                6 игрушек
              </span>
              <span className="text-gray-500">•</span>
              <div className="text-right">
                <span className="text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  $35/мес.
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Состав набора игрушек
              </p>
              <div className="space-y-3">
                {getPlanItems('base').map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-gray-700 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      x{item.count}
                    </span>
                    <span className="text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className={`w-full py-3 rounded-xl font-medium transition-colors ${
                selectedSubscription === 'base' 
                  ? 'bg-indigo-400 text-white' 
                  : 'text-gray-700 hover:opacity-80'
              }`} 
              style={{ 
                fontFamily: 'Nunito, sans-serif',
                backgroundColor: selectedSubscription === 'base' ? undefined : '#E3E3E3'
              }}
            >
              {selectedSubscription === 'base' ? 'Выбрано' : 'Выбрать'}
            </button>
          </div>

          {/* Premium Subscription */}
          <div 
            className={`rounded-3xl p-6 shadow-sm border transition-all cursor-pointer ${
              selectedSubscription === 'premium' 
                ? 'border-indigo-400' 
                : 'border-gray-100 hover:border-gray-300'
            }`} 
            style={{ 
              backgroundColor: '#F2F2F2'
            }}
            onClick={() => setSelectedSubscription('premium')}
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Премиум
              </h3>
              <span className="text-gray-500">•</span>
              <span className="text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                9 игрушек
              </span>
              <span className="text-gray-500">•</span>
              <div className="text-right">
                <span className="text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  $60/мес.
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Состав набора игрушек
              </p>
              <div className="space-y-3">
                {getPlanItems('premium').map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-gray-700 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      x{item.count}
                    </span>
                    <span className="text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className={`w-full py-3 rounded-xl font-medium transition-colors ${
                selectedSubscription === 'premium' 
                  ? 'bg-indigo-400 text-white' 
                  : 'text-gray-700 hover:opacity-80'
              }`} 
              style={{ 
                fontFamily: 'Nunito, sans-serif',
                backgroundColor: selectedSubscription === 'premium' ? undefined : '#E3E3E3'
              }}
            >
              {selectedSubscription === 'premium' ? 'Выбрано' : 'Выбрать'}
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-28 left-4 right-4">
        <button
          onClick={handleSave}
          disabled={!isFormValid}
          className={`w-full py-3 px-4 rounded-[32px] font-medium text-base transition-colors ${
            isFormValid
              ? 'bg-gray-800 text-white hover:bg-gray-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Сохранить изменения
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
}; 