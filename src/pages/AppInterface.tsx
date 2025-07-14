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
  useGetUserProfileUsersProfileGet,
  useGetUserSubscriptionsSubscriptionsUserGet,
  useGetUserDeliveryAddressesDeliveryAddressesGet,
  useGetCurrentBoxToyBoxesCurrentChildIdGet,
  useGetNextBoxToyBoxesNextChildIdGet,
} from "../api-client";
import { Home, MoreHorizontal } from "lucide-react";
import { useStore } from "../store/store";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

interface AppInterfaceProps {}

export const AppInterface: React.FC<AppInterfaceProps> = ({}) => {
  const [rating, setRating] = useState<number>(0);
  const [showAllToys, setShowAllToys] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showChildrenScreen, setShowChildrenScreen] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [feedbackComment, setFeedbackComment] = useState<string>("");

  const { user } = useStore();

  if (!user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  const handleStarClick = (starIndex: number): void => {
    setRating(starIndex + 1);
    setShowFeedback(true);
  };

  // Get toys based on real API data
  const getCurrentToys = () => {
    const currentChild = user?.children[0]; // Упрощение для примера
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

    user?.children.forEach((child) => {
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
    const currentChild = user?.children[0]; // Упрощение для примера
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
    const currentChild = user?.children[0]; // Упрощение для примера
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

    user?.children.forEach((child) => {
      // Add toys based on interests
      // TODO: change to real interests
      if (child.interests.includes(1)) {
        toys.push({
          icon: "🔧",
          count: 2,
          name: "Конструктор",
          color: "bg-orange-200",
        });
      }
      // TODO: change to real interests
      if (child.interests.includes(2)) {
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
    if (user?.subscriptionStatus === "not_subscribed") {
      return "not_subscribed";
    }

    // Check if user just subscribed (first 2 hours)
    if (
      user?.subscriptionStatus === "just_subscribed" &&
      user?.subscriptionDate
    ) {
      const subscriptionTime = new Date(user?.subscriptionDate);
      const now = new Date();
      const hoursDiff =
        (now.getTime() - subscriptionTime.getTime()) / (1000 * 60 * 60);

      if (hoursDiff <= 2) {
        return "just_subscribed";
      }
    }

    // Check next set status
    if (user?.nextSetStatus === "not_determined") {
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
        userData={user}
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
        userData={user}
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
          userData={user}
          BottomNavigation={BottomNavigation}
        />
      );
    case "just_subscribed":
      return (
        <JustSubscribedView
          userData={user}
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
          userData={user}
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
          userData={user}
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
          userData={user}
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
