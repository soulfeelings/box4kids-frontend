import React, { useState } from 'react';
import { Star, Home, MessageCircle, MoreHorizontal, ArrowLeft, X, User, Gift, Calendar, Heart } from 'lucide-react';
import { UserData } from '../types';
import {
  NotSubscribedView,
  JustSubscribedView,
  NextSetNotDeterminedView,
  NextSetDeterminedView,
  FeedbackView,
  ToySetDetailView,
  ChildrenAndSubscriptionsView
} from '../components/states';
import { ProfilePage } from './ProfilePage';
import { EditChildPage } from './EditChildPage';
import { EditSubscriptionPage } from './EditSubscriptionPage';
import { CancelSubscriptionPage } from './CancelSubscriptionPage';

interface KidsAppInterfaceProps {
  userData: UserData;
  onUpdateUserData?: (userData: UserData) => void;
}

export const KidsAppInterface: React.FC<KidsAppInterfaceProps> = ({ userData, onUpdateUserData }) => {
  const [rating, setRating] = useState<number>(0);
  const [showAllToys, setShowAllToys] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showChildrenScreen, setShowChildrenScreen] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [feedbackComment, setFeedbackComment] = useState<string>("");
  const [editingChild, setEditingChild] = useState<UserData['children'][0] | null>(null);
  const [editingSubscription, setEditingSubscription] = useState<UserData['children'][0] | null>(null);
  const [cancelingSubscription, setCancelingSubscription] = useState<UserData['children'][0] | null>(null);

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

  // Bottom Navigation Component
  const BottomNavigation = () => (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-800 shadow-lg" style={{ borderRadius: '48px' }}>
      <div className="flex justify-center items-center space-x-8 px-4 py-3">
        <button 
          onClick={() => {
            setShowAllToys(false);
            setShowFeedback(false);
            setShowChildrenScreen(false);
            setShowProfile(false);
            setEditingChild(null);
            setEditingSubscription(null);
            setCancelingSubscription(null);
          }}
          className={`p-3 rounded-2xl ${!showAllToys && !showFeedback && !showChildrenScreen && !showProfile && !editingChild && !editingSubscription && !cancelingSubscription ? 'bg-purple-500' : ''}`}
        >
          <Home size={24} className="text-white" />
        </button>
        <button 
          onClick={() => {
            setShowChildrenScreen(true);
            setShowAllToys(false);
            setShowFeedback(false);
            setShowProfile(false);
            setEditingChild(null);
            setEditingSubscription(null);
            setCancelingSubscription(null);
          }}
          className={`p-3 rounded-2xl ${showChildrenScreen && !editingChild && !editingSubscription && !cancelingSubscription ? 'bg-purple-500' : ''}`}
        >
          <img 
            src="/illustrations/Icon.png" 
            alt="Icon" 
            className="w-6 h-6"
          />
        </button>
        <button 
          onClick={() => {
            setShowProfile(true);
            setShowAllToys(false);
            setShowFeedback(false);
            setShowChildrenScreen(false);
            setEditingChild(null);
            setEditingSubscription(null);
            setCancelingSubscription(null);
          }}
          className={`p-3 rounded-2xl ${showProfile && !editingChild && !editingSubscription && !cancelingSubscription ? 'bg-purple-500' : ''}`}
        >
          <MoreHorizontal size={24} className="text-white" />
        </button>
      </div>
    </div>
  );

  // Determine current screen state
  const getCurrentScreenState = (): 'not_subscribed' | 'just_subscribed' | 'next_set_not_determined' | 'next_set_determined' => {
    // Check if user is not subscribed or has no children
    if (userData.subscriptionStatus === 'not_subscribed' || !userData.children || userData.children.length === 0) {
      return 'not_subscribed';
    }
    
    // Check if user just subscribed (first 2 hours)
    if (userData.subscriptionStatus === 'just_subscribed' && userData.subscriptionDate) {
      const subscriptionTime = new Date(userData.subscriptionDate);
      const now = new Date();
      const hoursDiff = (now.getTime() - subscriptionTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff <= 2) {
        return 'just_subscribed';
      }
    }
    
    // Check next set status
    if (userData.nextSetStatus === 'not_determined') {
      return 'next_set_not_determined';
    }
    
    return 'next_set_determined';
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

  // Handle child update
  const handleChildUpdate = (updatedChild: UserData['children'][0]) => {
    if (onUpdateUserData) {
      const updatedUserData = {
        ...userData,
        children: userData.children.map(child => 
          child.id === updatedChild.id ? updatedChild : child
        )
      };
      onUpdateUserData(updatedUserData);
    }
    setEditingChild(null);
    setShowChildrenScreen(true);
  };

  // Handle subscription update
  const handleSubscriptionUpdate = (updatedChild: UserData['children'][0]) => {
    if (onUpdateUserData) {
      const updatedUserData = {
        ...userData,
        children: userData.children.map(child => 
          child.id === updatedChild.id ? updatedChild : child
        )
      };
      onUpdateUserData(updatedUserData);
    }
    setEditingSubscription(null);
    setShowChildrenScreen(true);
  };

  // Handle cancel subscription
  const handleCancelSubscription = (child: UserData['children'][0]) => {
    setCancelingSubscription(child);
  };

  const handleConfirmCancelSubscription = () => {
    if (cancelingSubscription && onUpdateUserData) {
      const updatedUserData = {
        ...userData,
        subscriptionStatus: 'paused' as const
      };
      onUpdateUserData(updatedUserData);
    }
    setCancelingSubscription(null);
  };

  const handleCancelCancelSubscription = () => {
    setCancelingSubscription(null);
  };

  const handleResumeSubscription = () => {
    if (onUpdateUserData) {
      const updatedUserData = {
        ...userData,
        subscriptionStatus: 'active' as const
      };
      onUpdateUserData(updatedUserData);
    }
  };

  const handleDeleteChild = (child: UserData['children'][0]) => {
    if (onUpdateUserData) {
      const updatedChildren = userData.children.filter(c => c.id !== child.id);
      const updatedUserData = {
        ...userData,
        children: updatedChildren,
        subscriptionStatus: updatedChildren.length === 0 ? 'not_subscribed' as const : userData.subscriptionStatus
      };
      onUpdateUserData(updatedUserData);
    }
  };

  // Render based on current view
  if (editingChild) {
    return (
      <EditChildPage
        child={editingChild}
        onClose={() => setEditingChild(null)}
        onSave={handleChildUpdate}
        BottomNavigation={BottomNavigation}
      />
    );
  }

  if (editingSubscription) {
    return (
      <EditSubscriptionPage
        child={editingSubscription}
        onClose={() => setEditingSubscription(null)}
        onSave={handleSubscriptionUpdate}
        BottomNavigation={BottomNavigation}
      />
    );
  }

  if (cancelingSubscription) {
    return (
      <CancelSubscriptionPage
        onCancel={handleCancelCancelSubscription}
        onConfirm={handleConfirmCancelSubscription}
      />
    );
  }

  if (showProfile) {
    return (
      <ProfilePage
        userData={userData}
        setShowProfile={setShowProfile}
        BottomNavigation={BottomNavigation}
        onUpdateUserData={onUpdateUserData || (() => {})}
      />
    );
  }

  if (showFeedback) {
    return (
      <FeedbackView
        rating={rating}
        feedbackComment={feedbackComment}
        setFeedbackComment={setFeedbackComment}
        setShowFeedback={setShowFeedback}
        BottomNavigation={BottomNavigation}
      />
    );
  }
  
  if (showChildrenScreen) {
    return (
      <ChildrenAndSubscriptionsView
        userData={userData}
        BottomNavigation={BottomNavigation}
        getAge={getAge}
        onEditChild={setEditingChild}
        onEditSubscription={setEditingSubscription}
        onCancelSubscription={handleCancelSubscription}
        onResumeSubscription={handleResumeSubscription}
        onDeleteChild={handleDeleteChild}
      />
    );
  }

  if (showAllToys) {
    return (
      <ToySetDetailView
        allToys={getAllCurrentToys()}
        setShowAllToys={setShowAllToys}
        BottomNavigation={BottomNavigation}
      />
    );
  }
  
  const currentScreenState = getCurrentScreenState();
  const currentToys = getCurrentToys();
  const nextToys = getNextToys();
  
  switch (currentScreenState) {
    case 'not_subscribed':
      return (
        <NotSubscribedView
          userData={userData}
          BottomNavigation={BottomNavigation}
        />
      );
    case 'just_subscribed':
      return (
        <JustSubscribedView
          userData={userData}
          BottomNavigation={BottomNavigation}
          formatDeliveryDate={formatDeliveryDate}
          formatDeliveryTime={formatDeliveryTime}
          allToys={getAllCurrentToys()}
          getCurrentDate={getCurrentDate}
        />
      );
    case 'next_set_not_determined':
      return (
        <NextSetNotDeterminedView
          userData={userData}
          BottomNavigation={BottomNavigation}
          currentToys={currentToys}
          nextToys={nextToys}
          rating={rating}
          setShowAllToys={setShowAllToys}
          handleStarClick={handleStarClick}
          getCurrentDate={getCurrentDate}
          formatDeliveryDate={formatDeliveryDate}
          formatDeliveryTime={formatDeliveryTime}
        />
      );
    case 'next_set_determined':
      return (
        <NextSetDeterminedView
          userData={userData}
          BottomNavigation={BottomNavigation}
          currentToys={currentToys}
          nextToys={nextToys}
          rating={rating}
          setShowAllToys={setShowAllToys}
          handleStarClick={handleStarClick}
          getCurrentDate={getCurrentDate}
          formatDeliveryDate={formatDeliveryDate}
          formatDeliveryTime={formatDeliveryTime}
        />
      );
    default:
      return (
        <NextSetDeterminedView
          userData={userData}
          BottomNavigation={BottomNavigation}
          currentToys={currentToys}
          nextToys={nextToys}
          rating={rating}
          setShowAllToys={setShowAllToys}
          handleStarClick={handleStarClick}
          getCurrentDate={getCurrentDate}
          formatDeliveryDate={formatDeliveryDate}
          formatDeliveryTime={formatDeliveryTime}
        />
      );
  }
}; 