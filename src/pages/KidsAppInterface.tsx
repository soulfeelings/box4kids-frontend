import React, { useState, useEffect } from "react";
import {
  FeedbackView,
  ToySetDetailView,
  ChildrenAndSubscriptionsView,
  NotSubscribedView,
  JustSubscribedView,
  NextSetDeterminedView,
  NextSetNotDeterminedView,
} from "../components/states";
import { ProfilePage } from "./ProfilePage";
import {
  useGetUserProfileUsersProfileUserIdGet,
  useGetUserSubscriptionsSubscriptionsUserUserIdGet,
  useGetUserDeliveryAddressesDeliveryAddressesGet,
  useGetCurrentBoxToyBoxesCurrentChildIdGet,
  useGetNextBoxToyBoxesNextChildIdGet,
} from "../api-client";
import {
  transformMainScreenData,
  transformToyBoxToToys,
} from "../utils/dataTransformers";
import { error } from "console";
import { Home, MoreHorizontal } from "lucide-react";

interface KidsAppInterfaceProps {
  userId: number; // вместо userData
}

export const KidsAppInterface: React.FC<KidsAppInterfaceProps> = ({
  userId,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [showAllToys, setShowAllToys] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showChildrenScreen, setShowChildrenScreen] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [feedbackComment, setFeedbackComment] = useState<string>("");

  // Заменить useState на хуки
  const { data: userProfile, isLoading: profileLoading } =
    useGetUserProfileUsersProfileUserIdGet(userId);
  const { data: subscriptions, isLoading: subscriptionsLoading } =
    useGetUserSubscriptionsSubscriptionsUserUserIdGet(userId);
  const { data: deliveryAddresses, isLoading: deliveryLoading } =
    useGetUserDeliveryAddressesDeliveryAddressesGet({ user_id: userId });

  // Для коробок нужно получить детей из профиля
  const firstChildId = userProfile?.children?.[0]?.id;
  const { data: currentToyBox } = useGetCurrentBoxToyBoxesCurrentChildIdGet(
    firstChildId || 0,
    {
      query: { enabled: !!firstChildId },
    }
  );
  const { data: nextToyBox } = useGetNextBoxToyBoxesNextChildIdGet(
    firstChildId || 0,
    {
      query: { enabled: !!firstChildId },
    }
  );

  const isLoading = profileLoading || subscriptionsLoading || deliveryLoading;

  // Преобразовать данные
  const userData =
    userProfile && subscriptions
      ? transformMainScreenData(
          // @ts-ignore
          userProfile,
          subscriptions,
          deliveryAddresses?.addresses || [],
          currentToyBox
            ? new Map([[firstChildId || 0, currentToyBox]])
            : new Map(),
          nextToyBox ? new Map([[firstChildId || 0, nextToyBox]]) : new Map()
        )
      : null;

  // Добавить обработку загрузки и ошибок
  if (isLoading && !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем данные...</p>
        </div>
      </div>
    );
  }

  if ("Error") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error</p>
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Нет данных для отображения</p>
      </div>
    );
  }

  const handleStarClick = (starIndex: number): void => {
    setRating(starIndex + 1);
    setShowFeedback(true);
  };

  // Get toys based on real API data
  const getCurrentToys = () => {
    const currentChild = userData.children[0]; // Упрощение для примера
    if (!currentChild) return [];

    // const currentBox = currentToyBoxes.get(currentChild.id);

    // if (currentBox) {
    //   return transformToyBoxToToys(currentBox);
    // }

    // Fallback на существующую логику если нет API данных
    const toys: Array<{
      icon: string;
      count: number;
      name: string;
      color: string;
    }> = [];

    userData.children.forEach((child) => {
      if (child.subscription === "premium") {
        toys.push(
          { icon: "🔧", count: 3, name: "Конструктор", color: "#F8CAAF" },
          { icon: "🎨", count: 2, name: "Творческий набор", color: "#F8CAAF" }
        );
      } else if (child.subscription === "base") {
        toys.push(
          { icon: "🔧", count: 2, name: "Конструктор", color: "#F8CAAF" },
          { icon: "🎨", count: 2, name: "Творческий набор", color: "#F8CAAF" }
        );
      }
    });

    // Remove duplicates and combine counts
    const toyMap = new Map();
    toys.forEach((toy) => {
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
    // Используем ту же логику что и getCurrentToys, но возвращаем все
    return getCurrentToys();
  };

  // Обновить функцию обработки отзывов
  const handleFeedbackSubmit = async (rating: number, comment: string) => {
    // Найти ID текущего набора (логика зависит от UI)
    const currentChild = userData.children[0]; // Упрощение для примера
    if (!currentChild) return;

    // const currentBox = currentToyBoxes.get(currentChild.id);

    // if (currentBox) {
    //   await submitReview(currentBox.id, rating, comment);
    //   // После успешной отправки отзыва закрываем модальное окно
    //   setShowFeedback(false);
    //   setRating(0);
    //   setFeedbackComment("");
    // }
  };

  const getNextToys = () => {
    const currentChild = userData.children[0]; // Упрощение для примера
    if (!currentChild) return [];

    // const nextBox = nextToyBoxes.get(currentChild.id);

    // if (nextBox) {
    //   return transformToyBoxToToys(nextBox);
    // }

    // Fallback на существующую логику если нет API данных
    const toys: Array<{
      icon: string;
      count: number;
      name: string;
      color: string;
    }> = [];

    userData.children.forEach((child) => {
      // Add toys based on interests
      if (child.interests.includes("Конструкторы")) {
        toys.push({
          icon: "🔧",
          count: 2,
          name: "Конструктор",
          color: "bg-orange-200",
        });
      }
      if (child.interests.includes("Творчество")) {
        toys.push({
          icon: "🎨",
          count: 2,
          name: "Творческий набор",
          color: "bg-green-200",
        });
      }

      // Add default toys
      toys.push(
        {
          icon: "🧸",
          count: 1,
          name: "Мягкая игрушка",
          color: "bg-yellow-200",
        },
        { icon: "🧠", count: 1, name: "Головоломка", color: "bg-pink-200" }
      );
    });

    // Remove duplicates and combine counts
    const toyMap = new Map();
    toys.forEach((toy) => {
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
    <div
      className="fixed bottom-4 left-4 right-4 bg-gray-800 shadow-lg"
      style={{ borderRadius: "48px" }}
    >
      <div className="flex justify-center items-center space-x-8 px-4 py-3">
        <button
          onClick={() => {
            setShowAllToys(false);
            setShowFeedback(false);
            setShowChildrenScreen(false);
            setShowProfile(false);
          }}
          className={`p-3 rounded-2xl ${
            !showAllToys && !showFeedback && !showChildrenScreen && !showProfile
              ? "bg-purple-500"
              : ""
          }`}
        >
          <Home size={24} className="text-white" />
        </button>
        <button
          onClick={() => {
            setShowChildrenScreen(true);
            setShowAllToys(false);
            setShowFeedback(false);
            setShowProfile(false);
          }}
          className={`p-3 rounded-2xl ${
            showChildrenScreen ? "bg-purple-500" : ""
          }`}
        >
          <img src="/illustrations/Icon.png" alt="Icon" className="w-6 h-6" />
        </button>
        <button
          onClick={() => {
            setShowProfile(true);
            setShowAllToys(false);
            setShowFeedback(false);
            setShowChildrenScreen(false);
          }}
          className={`p-3 rounded-2xl ${showProfile ? "bg-purple-500" : ""}`}
        >
          <MoreHorizontal size={24} className="text-white" />
        </button>
      </div>
    </div>
  );

  // Determine current screen state
  const getCurrentScreenState = ():
    | "not_subscribed"
    | "just_subscribed"
    | "next_set_not_determined"
    | "next_set_determined" => {
    // Check if user is not subscribed
    if (userData.subscriptionStatus === "not_subscribed") {
      return "not_subscribed";
    }

    // Check if user just subscribed (first 2 hours)
    if (
      userData.subscriptionStatus === "just_subscribed" &&
      userData.subscriptionDate
    ) {
      const subscriptionTime = new Date(userData.subscriptionDate);
      const now = new Date();
      const hoursDiff =
        (now.getTime() - subscriptionTime.getTime()) / (1000 * 60 * 60);

      if (hoursDiff <= 2) {
        return "just_subscribed";
      }
    }

    // Check next set status
    if (userData.nextSetStatus === "not_determined") {
      return "next_set_not_determined";
    }

    return "next_set_determined";
  };

  // Format current date for display
  const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate();
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];
    const month = months[today.getMonth()];
    return `${day} ${month}`;
  };

  // Format delivery date with full month and day of week
  const formatDeliveryDate = (dateString: string) => {
    if (!dateString || !dateString.includes(".")) return dateString;

    const [day, month] = dateString.split(".");
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, parseInt(month) - 1, parseInt(day));

    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];

    const daysOfWeek = [
      "воскресенье",
      "понедельник",
      "вторник",
      "среда",
      "четверг",
      "пятница",
      "суббота",
    ];

    const monthName = months[date.getMonth()];
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${day} ${monthName}, ${dayOfWeek}`;
  };

  // Format delivery time to 24-hour format
  const formatDeliveryTime = (timeString: string) => {
    if (!timeString || !timeString.includes("-")) return timeString;

    const [startTime, endTime] = timeString.split("-");
    const formatHour = (hour: string) => {
      const h = parseInt(hour);
      return h.toString().padStart(2, "0") + ":00";
    };

    return `${formatHour(startTime)}–${formatHour(endTime)}`;
  };

  // Helper function to calculate age
  const getAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Render based on current view
  if (showProfile) {
    return (
      <ProfilePage
        userData={userData}
        setShowProfile={setShowProfile}
        BottomNavigation={BottomNavigation}
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
        setShowChildrenScreen={setShowChildrenScreen}
        BottomNavigation={BottomNavigation}
        getAge={getAge}
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
    case "not_subscribed":
      return (
        <NotSubscribedView
          userData={userData}
          BottomNavigation={BottomNavigation}
        />
      );
    case "just_subscribed":
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
    case "next_set_not_determined":
      return (
        <NextSetNotDeterminedView
          userData={userData}
          BottomNavigation={BottomNavigation}
          currentToys={currentToys}
          rating={rating}
          setShowAllToys={setShowAllToys}
          handleStarClick={handleStarClick}
          getCurrentDate={getCurrentDate}
          formatDeliveryDate={formatDeliveryDate}
          formatDeliveryTime={formatDeliveryTime}
        />
      );
    case "next_set_determined":
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
