import React, { useEffect, useMemo, useState } from "react";
import {
  FeedbackView,
  ToySetDetailView,
  NotSubscribedView,
  NextSetDeterminedView,
} from "../components/states";
import { useStore } from "../store/store";
import { Navigate, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import {
  getCurrentBoxToyBoxesCurrentChildIdGet,
  getNextBoxToyBoxesNextChildIdGet,
} from "../api-client";
import { notifications } from "../utils/notifications";
import {
  NextBoxResponse,
  SubscriptionStatus,
  ToyBoxResponse,
} from "../api-client/model";
import { UserChildData } from "../types";
import { useTranslation } from 'react-i18next';

export interface BoxesState {
  child: UserChildData;
  currentBox: ToyBoxResponse | null;
  nextBox: NextBoxResponse | null;
}

export interface SuccessfulBoxesState {
  child: UserChildData;
  currentBox: ToyBoxResponse;
  nextBox: NextBoxResponse;
}

export const AppInterface: React.FC = () => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(0);
  const [currentBox, setCurrentBox] = useState<
    SuccessfulBoxesState["currentBox"] | null
  >(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackComment, setFeedbackComment] = useState<string>("");

  const { user, currentAppScreen } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentAppScreen === "home") {
      setShowFeedback(false);
      navigate(ROUTES.APP.ROOT);
    } else if (currentAppScreen === "children") {
      navigate(ROUTES.APP.CHILDREN);
    } else if (currentAppScreen === "profile") {
      navigate(ROUTES.APP.PROFILE);
      setShowFeedback(false);
    }
  }, [currentAppScreen, navigate]);

  const [currentSuccessfulBoxes, setCurrentSuccessfulBoxes] = useState<
    SuccessfulBoxesState[]
  >([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      if (user?.children.length) {
        try {
          // Фильтруем детей с активной подпиской
          const subscribedChildren = user.children.filter((child) =>
            child.subscriptions.some(
              (subscription) =>
                subscription.status === SubscriptionStatus.active
            )
          );

          if (subscribedChildren.length === 0) {
            setCurrentSuccessfulBoxes([]);
            return;
          }

          const res = await Promise.all(
            subscribedChildren.map(async (child) => {
              try {
                const [currentBox, nextBox] = await Promise.all([
                  getCurrentBoxToyBoxesCurrentChildIdGet(child.id),
                  getNextBoxToyBoxesNextChildIdGet(child.id),
                ]);
                return { currentBox, nextBox, success: true };
              } catch (error) {
                console.warn(
                  `Failed to fetch boxes for child ${child.id}:`,
                  error
                );
                return { currentBox: null, nextBox: null, success: false };
              }
            })
          );

          const successfulBoxes = res
            .map((result, index) => ({
              child: subscribedChildren[index],
              currentBox: result.currentBox,
              nextBox: result.nextBox,
            }))
            .filter((box) => box.currentBox !== null || box.nextBox !== null);

          setCurrentSuccessfulBoxes(successfulBoxes as SuccessfulBoxesState[]);

          // Показываем уведомление если не удалось загрузить данные для некоторых детей
          const failedCount = res.filter((r) => !r.success).length;
          if (failedCount > 0) {
            notifications.warning(
              t('failed_to_load_data_for_children', { 
                count: failedCount, 
                child: failedCount === 1 ? t('child') : t('children') 
              })
            );
          }
        } catch (error) {
          console.error("Failed to fetch boxes data:", error);
          notifications.error(t('failed_to_load_toy_boxes_data'));
        }
      }
    };

    fetchData();
  }, [user, t]);

  // Determine current screen state
  const currentScreenState = useMemo((): "not_subscribed" | undefined => {
    const noSubscribedChild =
      user?.children?.find((child) =>
        child.subscriptions.find(
          (subscription) => subscription.status === SubscriptionStatus.active
        )
      ) === undefined;

    if (noSubscribedChild) {
      return "not_subscribed";
    }

    return undefined;
  }, [user]);

  if (!user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  const handleStarClick = (starIndex: number): void => {
    setRating(starIndex + 1);
    setShowFeedback(true);
  };

  // Format current date for display
  const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate();
    const months = [
      t('january'),
      t('february'),
      t('march'),
      t('april'),
      t('may'),
      t('june'),
      t('july'),
      t('august'),
      t('september'),
      t('october'),
      t('november'),
      t('december'),
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
      t('january'),
      t('february'),
      t('march'),
      t('april'),
      t('may'),
      t('june'),
      t('july'),
      t('august'),
      t('september'),
      t('october'),
      t('november'),
      t('december'),
    ];

    const daysOfWeek = [
      t('sunday'),
      t('monday'),
      t('tuesday'),
      t('wednesday'),
      t('thursday'),
      t('friday'),
      t('saturday'),
    ];

    const monthName = months[date.getMonth()];
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${day} ${monthName}, ${dayOfWeek}`;
  };

  // Format delivery time to 24-hour format
  const formatDeliveryTime = (timeString: string) => {
    if (!timeString) return timeString;

    // Если время уже в формате "14:00 – 18:00", возвращаем как есть
    if (timeString.includes(":") && timeString.includes("–")) {
      return timeString;
    }

    // Если время в формате "14-18", преобразуем в "14:00 – 18:00"
    if (timeString.includes("-")) {
      const [startTime, endTime] = timeString.split("-");
      const formatHour = (hour: string) => {
        const h = parseInt(hour);
        return h.toString().padStart(2, "0") + ":00";
      };

      return `${formatHour(startTime)}–${formatHour(endTime)}`;
    }

    return timeString;
  };

  if (showFeedback && currentBox) {
    return (
      <FeedbackView
        rating={rating}
        feedbackComment={feedbackComment}
        setFeedbackComment={setFeedbackComment}
        setShowFeedback={setShowFeedback}
        setRating={setRating}
        boxId={currentBox.id}
        userId={user?.id}
      />
    );
  }

  if (currentBox) {
    return (
      <ToySetDetailView
        currentBox={currentBox}
        close={() => setCurrentBox(null)}
      />
    );
  }

  switch (currentScreenState) {
    case "not_subscribed":
      return <NotSubscribedView userData={user} />;

    default:
      return (
        <NextSetDeterminedView
          userData={user}
          boxes={currentSuccessfulBoxes}
          rating={rating}
          setCurrentBox={setCurrentBox}
          handleStarClick={handleStarClick}
          getCurrentDate={getCurrentDate}
          formatDeliveryDate={formatDeliveryDate}
          formatDeliveryTime={formatDeliveryTime}
        />
      );
  }
};
