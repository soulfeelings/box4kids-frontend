import React from 'react';
import { UserData } from '../../types';

interface NotSubscribedViewProps {
  userData: UserData;
  BottomNavigation: React.ComponentType;
}

export const NotSubscribedView: React.FC<NotSubscribedViewProps> = ({ userData, BottomNavigation }) => (
  <div className="w-full min-h-screen pb-24" style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: '#FFE8C8' }}>
    <div className="p-4 pb-6" style={{ 
      backgroundColor: '#FFE8C8',
      opacity: 1,
      borderRadius: '0 0 24px 24px',
    }}>
      <h1 className="font-semibold text-gray-800 mb-6 text-center" style={{ fontSize: '26px' }}>
        Привет, {userData.name}! 🦋
      </h1>

      {/* Welcome Card - responsive design */}
      <div className="relative flex flex-col rounded-3xl overflow-hidden" style={{ 
        backgroundColor: '#747EEC',
        minHeight: '380px',
        maxHeight: '60vh',
        height: 'clamp(380px, 55vh, 600px)'
      }}>
        {/* Illustration area - flexible height */}
        <div className="relative flex-1 overflow-hidden min-h-0">
          <img 
            src="/illustrations/continue.png" 
            alt="Girl with toy box" 
            className="absolute inset-0 w-full h-full object-contain p-2"
            style={{ objectPosition: 'center top' }}
          />
        </div>
        
        {/* Bottom container with text and button - flexible height */}
        <div className="px-4 sm:px-6 py-4 flex flex-col justify-center" style={{ 
          minHeight: '120px',
          maxHeight: '160px'
        }}>
          <p className="text-sm sm:text-base text-white/90 text-center mb-4 leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Завершите оформление подпсики, чтобы мы могли собрать коробку с игрушками и доставить её вам
          </p>
          
          <button
            onClick={() => console.log('Navigate to subscription')}
            className="w-full bg-white text-[#30313D] py-3 sm:py-4 rounded-3xl font-semibold text-sm sm:text-base transition-all hover:bg-gray-50"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Продолжить оформление
          </button>
        </div>
      </div>
    </div>
    
    <BottomNavigation />
  </div>
); 