import React from "react";
import { useNavigate } from "react-router-dom";
import { useCancelSubscriptionParams } from "../hooks/useTypedParams";
import { useStore } from "../store/store";
import { ModalHeader } from "../components/common/ModalHeader";
import { LoadingComponent } from "../components/common/LoadingComponent";
import {
  usePauseSubscriptionSubscriptionsSubscriptionIdPausePost,
  useResumeSubscriptionSubscriptionsSubscriptionIdResumePost,
  useGetSubscriptionSubscriptionsSubscriptionIdGet,
} from "../api-client";
import { SubscriptionStatus } from "../api-client/model";
import { notifications } from "../utils/notifications";
import { ErrorComponent } from "../components/common/ErrorComponent";

export const CancelSubscriptionPage: React.FC = () => {
  const { subscriptionId } = useCancelSubscriptionParams();
  const { updateChildSubscription } = useStore();
  const navigate = useNavigate();

  const pauseSubscriptionMutation =
    usePauseSubscriptionSubscriptionsSubscriptionIdPausePost();
  const resumeSubscriptionMutation =
    useResumeSubscriptionSubscriptionsSubscriptionIdResumePost();

  // Получаем данные подписки
  const {
    data: subscription,
    isLoading: isLoadingSubscription,
    refetch,
  } = useGetSubscriptionSubscriptionsSubscriptionIdGet(
    subscriptionId ? parseInt(subscriptionId) : 0
  );

  if (!subscriptionId) {
    return (
      <ErrorComponent
        errorMessage="ID подписки не найден"
        onBack={() => navigate(-1)}
      />
    );
  }

  if (isLoadingSubscription) {
    return <LoadingComponent />;
  }

  if (!subscription) {
    return (
      <ErrorComponent
        errorMessage="Подписка не найдена"
        onBack={() => navigate(-1)}
      />
    );
  }

  const isPaused = subscription.status === SubscriptionStatus.paused;
  const isActive = subscription.status === SubscriptionStatus.active;

  const onCancel = () => {
    navigate(-1);
  };

  const onPause = async () => {
    try {
      await pauseSubscriptionMutation.mutateAsync({
        subscriptionId: parseInt(subscriptionId),
      });

      const updatedSubscription = {
        ...subscription,
        status: SubscriptionStatus.paused,
        is_paused: true,
      };
      updateChildSubscription(
        subscription.child_id,
        subscription.id,
        updatedSubscription
      );

      notifications.subscriptionPaused();
      refetch();
    } catch (error) {
      console.error("Ошибка при приостановке подписки:", error);
      notifications.error("Не удалось приостановить подписку");
    }
  };

  const onResume = async () => {
    try {
      await resumeSubscriptionMutation.mutateAsync({
        subscriptionId: parseInt(subscriptionId),
      });

      // Обновляем подписку в store
      const updatedSubscription = {
        ...subscription,
        status: SubscriptionStatus.active,
        is_paused: false,
      };
      updateChildSubscription(
        subscription.child_id,
        subscription.id,
        updatedSubscription
      );

      notifications.subscriptionResumed();
      refetch();
    } catch (error) {
      console.error("Ошибка при возобновлении подписки:", error);
      notifications.error("Не удалось возобновить подписку");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center p-4">
        <ModalHeader
          className="mb-8"
          title={isPaused ? "Возобновить подписку?" : "Остановить подписку?"}
          onClose={onCancel}
        />

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-600 text-center leading-relaxed">
            {isPaused
              ? "Мы возобновим доставку коробок и подбор игрушек для вашего ребенка."
              : "Мы приостановим доставку коробок и подбор игрушек. Вы сможете возобновить подписку в любой момент."}
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          {isPaused ? (
            <button
              onClick={onResume}
              disabled={resumeSubscriptionMutation.isPending}
              className="w-full h-14 bg-[#4CAF50] hover:bg-[#45a049] text-white py-4 px-4 rounded-[32px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resumeSubscriptionMutation.isPending
                ? "Возобновляем..."
                : "Возобновить подписку"}
            </button>
          ) : (
            <button
              onClick={onPause}
              disabled={pauseSubscriptionMutation.isPending}
              className="w-full h-14 bg-[#FBC8D5] hover:bg-[#F9B8C8] text-[#E14F75] py-4 px-4 rounded-[32px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pauseSubscriptionMutation.isPending
                ? "Останавливаем..."
                : "Остановить подписку"}
            </button>
          )}

          <button
            onClick={onCancel}
            disabled={
              pauseSubscriptionMutation.isPending ||
              resumeSubscriptionMutation.isPending
            }
            className="w-full h-14 bg-[#E3E3E3] hover:bg-[#D3D3D3] text-gray-800 py-4 px-4 rounded-[32px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};
