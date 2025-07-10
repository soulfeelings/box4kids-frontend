import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface DeliveryItem {
  id: string;
  orderNumber: string;
  date: string;
}

interface DeliveryHistoryPageProps {
  onClose?: () => void;
  BottomNavigation: React.ComponentType;
}

export const DeliveryHistoryPage: React.FC<DeliveryHistoryPageProps> = ({ onClose, BottomNavigation }) => {
  const deliveries: DeliveryItem[] = [
    { id: '1', orderNumber: 'Набор №5', date: '10 апреля' },
    { id: '2', orderNumber: 'Набор №4', date: '24 марта' },
    { id: '3', orderNumber: 'Набор №3', date: '10 марта' },
    { id: '4', orderNumber: 'Набор №2', date: '24 февраля' },
    { id: '5', orderNumber: 'Набор №1', date: '10 февраля' },
  ];

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
      <div className="px-4 pb-6">
        <h1 className="text-xl font-semibold text-gray-900">История доставок</h1>
      </div>

      {/* Table Header */}
      <div className="bg-[#F2F2F2] mx-4 rounded-lg px-4 py-3 mb-2">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700 flex-1">
            №
          </div>
          <div className="text-sm font-medium text-gray-700 flex-1 text-right">
            Доставка
          </div>
        </div>
      </div>

      {/* Delivery List */}
      <div className="mx-4 space-y-2">
        {deliveries.map((delivery, index) => (
          <div 
            key={delivery.id}
            className="bg-[#FFFFFF] rounded-lg px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div className="text-base text-gray-900 flex-1">
                {delivery.orderNumber}
              </div>
              <div className="text-base text-gray-900 flex-1 text-right">
                {delivery.date}
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
}; 