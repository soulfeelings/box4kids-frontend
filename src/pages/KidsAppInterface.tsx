import React, { useState } from 'react';
import { Star, Home, MessageCircle, MoreHorizontal, ArrowLeft, X, User, Gift, Calendar, Heart } from 'lucide-react';

// Interface for user data
interface UserData {
  name: string;
  phone: string;
  children: Array<{
    id: string;
    name: string;
    birthDate: string;
    gender: "male" | "female";
    limitations: "none" | "has_limitations";
    comment: string;
    interests: string[];
    skills: string[];
    subscription: "base" | "premium" | "";
  }>;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
}

interface KidsAppInterfaceProps {
  userData: UserData;
}

export const KidsAppInterface: React.FC<KidsAppInterfaceProps> = ({ userData }) => {
  const [rating, setRating] = useState<number>(0);
  const [showAllToys, setShowAllToys] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showChildrenScreen, setShowChildrenScreen] = useState<boolean>(false);
  const [feedbackComment, setFeedbackComment] = useState<string>("");

  const handleStarClick = (starIndex: number): void => {
    setRating(starIndex + 1);
    setShowFeedback(true);
  };

  // Get toys based on children's interests and subscription types
  const getCurrentToys = () => {
    const toys: Array<{ icon: string; count: number; name: string; color: string }> = [];
    
    userData.children.forEach(child => {
      if (child.subscription === 'premium') {
        toys.push(
          { icon: '🔧', count: 3, name: 'Конструктор', color: '#F8CAAF' },
          { icon: '🎨', count: 2, name: 'Творческий набор', color: '#F8CAAF' }
        );
      } else if (child.subscription === 'base') {
        toys.push(
          { icon: '🔧', count: 2, name: 'Конструктор', color: '#F8CAAF' },
          { icon: '🎨', count: 2, name: 'Творческий набор', color: '#F8CAAF' }
        );
      }
    });
    
    // Remove duplicates and combine counts
    const toyMap = new Map();
    toys.forEach(toy => {
      const key = toy.name;
      if (toyMap.has(key)) {
        toyMap.get(key).count += toy.count;
      } else {
        toyMap.set(key, { ...toy });
      }
    });
    
    return Array.from(toyMap.values()).slice(0, 2); // Show first 2 types
  };

  // Get all toys for detailed view
  const getAllCurrentToys = () => {
    const toys: Array<{ icon: string; count: number; name: string; color: string }> = [];
    
    userData.children.forEach(child => {
      if (child.subscription === 'premium') {
        toys.push(
          { icon: '🔧', count: 2, name: 'Конструктор', color: 'bg-blue-100' },
          { icon: '🎨', count: 2, name: 'Творческий набор', color: 'bg-green-100' },
          { icon: '🧸', count: 1, name: 'Мягкая игрушка', color: 'bg-orange-100' },
          { icon: '🎪', count: 1, name: 'Головоломка', color: 'bg-pink-100' }
        );
      } else if (child.subscription === 'base') {
        toys.push(
          { icon: '🔧', count: 2, name: 'Конструктор', color: 'bg-blue-100' },
          { icon: '🎨', count: 2, name: 'Творческий набор', color: 'bg-green-100' },
          { icon: '🧸', count: 1, name: 'Мягкая игрушка', color: 'bg-orange-100' },
          { icon: '🎪', count: 1, name: 'Головоломка', color: 'bg-pink-100' }
        );
      }
    });
    
    // Remove duplicates and combine counts
    const toyMap = new Map();
    toys.forEach(toy => {
      const key = toy.name;
      if (toyMap.has(key)) {
        toyMap.get(key).count += toy.count;
      } else {
        toyMap.set(key, { ...toy });
      }
    });
    
    return Array.from(toyMap.values());
  };

  const getNextToys = () => {
    const toys: Array<{ icon: string; count: number; name: string; color: string }> = [];
    
    userData.children.forEach(child => {
      // Add toys based on interests
      if (child.interests.includes('Конструкторы')) {
        toys.push({ icon: '🔧', count: 2, name: 'Конструктор', color: 'bg-orange-200' });
      }
      if (child.interests.includes('Творчество')) {
        toys.push({ icon: '🎨', count: 2, name: 'Творческий набор', color: 'bg-green-200' });
      }
      
      // Add default toys
      toys.push(
        { icon: '🧸', count: 1, name: 'Мягкая игрушка', color: 'bg-yellow-200' },
        { icon: '🧠', count: 1, name: 'Головоломка', color: 'bg-pink-200' }
      );
    });
    
    // Remove duplicates and combine counts
    const toyMap = new Map();
    toys.forEach(toy => {
      const key = toy.name;
      if (toyMap.has(key)) {
        toyMap.get(key).count += toy.count;
      } else {
        toyMap.set(key, { ...toy });
      }
    });
    
    return Array.from(toyMap.values());
  };

  // Get feedback text based on rating
  const getFeedbackText = (rating: number) => {
    switch (rating) {
      case 1:
        return { title: "Ужасно", subtitle: "Что можно улучшить?" };
      case 2:
        return { title: "Плохо", subtitle: "Что можно улучшить?" };
      case 3:
        return { title: "Так себе", subtitle: "Что можно улучшить?" };
      case 4:
        return { title: "Хорошо", subtitle: "Спасибо за оценку!\nЧто вам особенно понравилось?" };
      case 5:
        return { title: "Отлично", subtitle: "Спасибо за оценку!\nЧто вам особенно понравилось?" };
      default:
        return { title: "", subtitle: "" };
    }
  };

  // Bottom Navigation Component
  const BottomNavigation = () => (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-800 shadow-lg" style={{ borderRadius: '48px' }}>
      <div className="flex justify-center items-center space-x-8 px-4 py-3">
        <button 
          onClick={() => {
            setShowAllToys(false);
            setShowFeedback(false);
            setShowChildrenScreen(false);
          }}
          className={`p-3 rounded-2xl ${!showAllToys && !showFeedback && !showChildrenScreen ? 'bg-purple-500' : ''}`}
        >
          <Home size={24} className="text-white" />
        </button>
        <button 
          onClick={() => {
            setShowChildrenScreen(true);
            setShowAllToys(false);
            setShowFeedback(false);
          }}
          className={`p-3 rounded-2xl ${showChildrenScreen ? 'bg-purple-500' : ''}`}
        >
          <img 
            src="/illustrations/Icon.png" 
            alt="Icon" 
            className="w-6 h-6"
          />
        </button>
        <button className="p-3">
          <MoreHorizontal size={24} className="text-gray-400" />
        </button>
      </div>
    </div>
  );

  // Feedback view
  const FeedbackView = () => {
    const feedbackText = getFeedbackText(rating);
    
    const handleSubmitFeedback = () => {
      // Here you would typically send the feedback to your backend
      console.log('Feedback submitted:', { rating, comment: feedbackComment });
      setShowFeedback(false);
      setFeedbackComment("");
    };

    const handleCloseFeedback = () => {
      setShowFeedback(false);
    };

    return (
      <div className="w-full bg-white min-h-screen" style={{ fontFamily: 'Nunito, sans-serif' }}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
            Как вам набор игрушек?
          </h1>
          <button 
            onClick={handleCloseFeedback}
            className="p-1"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 pb-24">
          {/* Stars */}
          <div className="flex justify-center space-x-1 mb-4">
            {[0, 1, 2, 3, 4].map((index) => (
              <Star
                key={index}
                size={40}
                className={`${
                  index < rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Rating text */}
          <div className="text-center mb-2">
            <p className="text-lg font-medium text-gray-800">{feedbackText.title}</p>
          </div>

          {/* Subtitle */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {feedbackText.subtitle}
            </p>
          </div>

          {/* Comment textarea */}
          <div className="mb-8">
            <textarea
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="Здесь можно оставить комментарий"
              className="w-full h-32 p-3 bg-gray-100 rounded-xl resize-none text-sm text-gray-700 placeholder-gray-500 border-none outline-none"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            />
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmitFeedback}
            className="w-full bg-gray-800 text-white py-4 rounded-xl text-sm font-medium"
          >
            Отправить
          </button>
        </div>
        <BottomNavigation />
      </div>
    );
  };

  // Detailed toy set view
  const ToySetDetailView = () => {
    const allToys = getAllCurrentToys();
    
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

  // Children and subscriptions screen
  const ChildrenAndSubscriptionsView = () => {
    const child = userData.children[0]; // Assuming first child for now
    
    return (
      <div className="w-full min-h-screen" style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: '#FFE8C8' }}>
        {/* Header */}
        <div className="p-4 flex items-center justify-center relative" style={{ backgroundColor: '#FFE8C8' }}>
          <button 
            onClick={() => setShowChildrenScreen(false)}
            className="absolute left-4 p-1"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            Дети и наборы
          </h1>
        </div>

        {/* Content */}
        <div className="p-4 pb-24">
          {/* Combined Child Info and Toy Set Container */}
          <div className="bg-white rounded-2xl p-4 mb-4">
            {/* Child Info */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mr-3">
                  <User size={20} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{child.name}, {getAge(child.birthDate)} лет</h3>
                </div>
              </div>

              {/* Interests */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Интересы</p>
                <div className="flex flex-wrap gap-2">
                  {child.interests.map((interest, index) => (
                    <span key={index} className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Навыки для развития</p>
                <div className="flex flex-wrap gap-2">
                  {child.skills.map((skill, index) => (
                    <span key={index} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Subscription */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Тариф</p>
                <p className="text-gray-800 font-medium">
                  {child.subscription === 'base' ? 'Базовый' : 'Премиум'} • 6 игрушек • 535₽/мес
                </p>
              </div>
            </div>

            {/* Toy Set Composition */}
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

            {/* Action buttons */}
            <div className="space-y-3">
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium">
                Изменить данные ребенка
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium">
                Изменить тариф
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium">
                Оставить подписку
              </button>
            </div>
          </div>

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

  // Main interface view
  const MainInterfaceView = () => {
    const currentToys = getCurrentToys();
    const nextToys = getNextToys();

    return (
      <div className="w-full min-h-screen pb-24" style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: '#F2F2F2' }}>
        {/* Main Container */}
        <div className="p-4" style={{ 
          backgroundColor: '#FFE8C8',
          opacity: 1,
          borderRadius: '0 0 24px 24px',
          aspectRatio: '46%'
        }}>
          {/* Header */}
          <h1 className="text-xl font-semibold text-gray-800 mb-6">
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
                    style={{
                      opacity: 1,
                      borderRadius: '1px',
                      aspectRatio: '46%'
                    }}
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
  };

  // Format current date for display
  const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate();
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const month = months[today.getMonth()];
    return `${day} ${month}`;
  };

  // Format delivery date with full month and day of week
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

  // Format delivery time to 24-hour format
  const formatDeliveryTime = (timeString: string) => {
    if (!timeString || !timeString.includes('-')) return timeString;
    
    const [startTime, endTime] = timeString.split('-');
    const formatHour = (hour: string) => {
      const h = parseInt(hour);
      return h.toString().padStart(2, '0') + ':00';
    };
    
    return `${formatHour(startTime)}–${formatHour(endTime)}`;
  };

  // Helper function to calculate age
  const getAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Render based on current view
  if (showFeedback) {
    return <FeedbackView />;
  }
  
  if (showChildrenScreen) {
    return <ChildrenAndSubscriptionsView />;
  }
  
  return showAllToys ? <ToySetDetailView /> : <MainInterfaceView />;
}; 