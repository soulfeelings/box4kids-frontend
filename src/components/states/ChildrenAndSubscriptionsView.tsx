import React from 'react';

import { UserData } from '../../types';

interface ChildrenAndSubscriptionsViewProps {
  userData: UserData;
  BottomNavigation: React.ComponentType;
  getAge: (birthDate: string) => number;
  onEditChild: (child: UserData['children'][0]) => void;
  onEditSubscription: (child: UserData['children'][0]) => void;
  onCancelSubscription: (child: UserData['children'][0]) => void;
  onResumeSubscription: () => void;
  onDeleteChild: (child: UserData['children'][0]) => void;
}

export const ChildrenAndSubscriptionsView: React.FC<ChildrenAndSubscriptionsViewProps> = ({
  userData,
  BottomNavigation,
  getAge,
  onEditChild,
  onEditSubscription,
  onCancelSubscription,
  onResumeSubscription,
  onDeleteChild
}) => {
  // Mapping для эмодзи интересов
  const interestEmojis: { [key: string]: string } = {
    'Конструкторы': '🧱',
    'Плюшевые': '🧸',
    'Ролевые': '🎭',
    'Развивающие': '🧠',
    'Техника': '⚙️',
    'Творчество': '🎨'
  };

  // Mapping для эмодзи навыков
  const skillEmojis: { [key: string]: string } = {
    'Моторика': '✋',
    'Логика': '🧩',
    'Воображение': '💭',
    'Творчество': '🎨',
    'Речь': '🗣'
  };

  // If no children, show "not subscribed" state
  if (!userData.children || userData.children.length === 0) {
    return (
      <div className="w-full min-h-screen" style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: '#FFE8C8' }}>
        {/* Header */}
        <div className="p-4 flex items-center justify-center" style={{ backgroundColor: '#FFE8C8' }}>
          <h1 className="font-semibold text-gray-800" style={{ fontSize: '26px' }}>
            Дети и наборы
          </h1>
        </div>

        {/* Not subscribed content */}
        <div className="p-4 pb-24">
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
  }

  return (
    <div className="w-full min-h-screen" style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: '#FFE8C8' }}>
      {/* Header */}
      <div className="p-4 flex items-center justify-center" style={{ backgroundColor: '#FFE8C8' }}>
        <h1 className="font-semibold text-gray-800" style={{ fontSize: '26px' }}>
          Дети и наборы
        </h1>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Loop through all children */}
        {userData.children.map((child, index) => (
          <div key={child.id} className="bg-white rounded-2xl p-4 mb-4">
            {/* Child Info */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 flex items-center justify-center mr-3">
                  <span className="text-lg">
                    {child.gender === 'male' ? '👦' : '👧'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{child.name}, {getAge(child.birthDate)} лет</h3>
                </div>
              </div>

              {/* Child Comment/Characteristics */}
              {child.comment && child.comment.trim() !== '' && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Особенности</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-800">{child.comment}</p>
                  </div>
                </div>
              )}

              {/* Interests */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Интересы</p>
                <div className="flex flex-wrap gap-2">
                  {child.interests.map((interest, index) => (
                    <span key={index} className="text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1" style={{ backgroundColor: '#F2F2F2' }}>
                      <span>{interestEmojis[interest] || ''}</span>
                      <span>{interest}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Навыки для развития</p>
                <div className="flex flex-wrap gap-2">
                  {child.skills.map((skill, index) => (
                    <span key={index} className="text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1" style={{ backgroundColor: '#F2F2F2' }}>
                      <span>{skillEmojis[skill] || ''}</span>
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Subscription */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Тариф</p>
                <p className="text-gray-800 font-medium">
                  {child.subscription === 'base' ? 'Базовый' : 'Премиум'} • 6 игрушек • ${child.subscription === 'base' ? '35' : '60'}/мес
                </p>
              </div>
            </div>

            {/* Toy Set Composition */}
            {userData.subscriptionStatus !== 'paused' && (
              <div className="mb-6">
                <h4 className="text-gray-800 font-medium mb-3">Состав набора игрушек</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      🔧
                    </div>
                    <span className="text-gray-700">x2 Конструктор</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      🎨
                    </div>
                    <span className="text-gray-700">x2 Творческий набор</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      🧸
                    </div>
                    <span className="text-gray-700">x1 Мягкая игрушка</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                      🎪
                    </div>
                    <span className="text-gray-700">x1 Головоломка</span>
                  </div>
                </div>
              </div>
            )}

            {/* Paused subscription message */}
            {userData.subscriptionStatus === 'paused' && (
              <div className="mb-6 p-6 bg-orange-50 rounded-2xl text-center">
                <p className="text-orange-600 text-sm">
                  Подписка остановлена! Возобновите её<br />
                  в любое время — и мы снова начнём<br />
                  собирать коробки для вашего ребенка
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => onEditChild(child)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Изменить данные ребенка
              </button>
              <button 
                onClick={() => userData.subscriptionStatus === 'paused' ? onDeleteChild(child) : onEditSubscription(child)}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
                  userData.subscriptionStatus === 'paused' 
                    ? 'text-gray-700 hover:opacity-90' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={userData.subscriptionStatus === 'paused' ? { backgroundColor: '#FBC8D5' } : {}}
              >
                {userData.subscriptionStatus === 'paused' ? 'Удалить' : 'Изменить тариф'}
              </button>
              <button 
                onClick={() => userData.subscriptionStatus === 'paused' ? onResumeSubscription() : onCancelSubscription(child)}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
                  userData.subscriptionStatus === 'paused' 
                    ? 'text-white hover:opacity-90' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={userData.subscriptionStatus === 'paused' ? { backgroundColor: '#30313D' } : {}}
              >
                {userData.subscriptionStatus === 'paused' ? 'Возобновить подписку' : 'Остановить подписку'}
              </button>
            </div>
          </div>
        ))}

        {/* Add child button */}
        <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: '#747EEC' }}>
          <p className="text-white font-medium mb-2">
            Добавьте еще одного ребенка
          </p>
          <p className="text-white text-sm mb-3">
            и получите скидку 20% на следующий набор
          </p>
          <button className="bg-white px-6 py-2 rounded-lg font-medium text-sm" style={{ color: '#747EEC' }}>
            Добавить ребенка
          </button>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}; 