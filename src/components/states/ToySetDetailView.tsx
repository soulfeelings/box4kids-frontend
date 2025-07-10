import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ToySetDetailViewProps {
  allToys: Array<{ icon: string; count: number; name: string; color: string }>;
  setShowAllToys: (show: boolean) => void;
  BottomNavigation: React.ComponentType;
}

export const ToySetDetailView: React.FC<ToySetDetailViewProps> = ({
  allToys,
  setShowAllToys,
  BottomNavigation
}) => {
  return (
    <div className="w-full bg-gray-100 min-h-screen" style={{ fontFamily: 'Nunito, sans-serif' }}>
      {/* Header */}
      <div className="bg-white p-4 flex items-center">
        <button 
          onClick={() => setShowAllToys(false)}
          className="mr-3 p-1"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">
          Текущий набор
        </h1>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Delivery and Return Info */}
        <div className="bg-gray-200 rounded-xl p-4 mb-4">
          <div className="mb-2">
            <p className="text-gray-600 text-sm">Доставлено</p>
            <p className="text-gray-800 font-medium">10 апреля, Чт • 14:00 – 18:00</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Возврат</p>
            <p className="text-gray-800 font-medium">24 апреля, Чт • 14:00 – 18:00</p>
          </div>
        </div>

        {/* Toys List */}
        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="space-y-4">
            {allToys.map((toy, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-10 h-10 ${toy.color} rounded-full mr-3 flex items-center justify-center text-lg`}>
                  {toy.icon}
                </div>
                <span className="text-gray-800 font-medium">x{toy.count} {toy.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Text */}
        <div className="px-2">
          <p className="text-blue-600 text-sm leading-relaxed">
            Если вы хотите оставить какую-то игрушку — сообщите об этом курьеру при возврате и менеджер свяжется с вами для выкупа
          </p>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}; 