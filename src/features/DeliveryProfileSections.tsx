import React from "react";
import { DeliveryProfileSection } from "./DeliveryProfileSection";
import { UserData } from "../types";
import { useStore } from "../store/store";
import { useTranslation } from 'react-i18next';

interface DeliveryAddress {
  id: number;
  address: string;
  date: string;
  time: string;
  // Информация о связанных объектах
  subscriptionInfo?: {
    id: number;
    childName: string;
    planName: string;
    status: string;
  };
  boxInfo?: {
    id: number;
    childName: string;
    status: string;
    deliveryDate: string;
  };
}

interface DeliveryProfileSectionsProps {
  user?: UserData;
  deliveryAddresses?: DeliveryAddress[];
  onEditDelivery?: (addressId: number) => void;
}

export const DeliveryProfileSections: React.FC<
  DeliveryProfileSectionsProps
> = ({ user, deliveryAddresses = [], onEditDelivery }) => {
  const state = useStore();
  const { t } = useTranslation();

  // Обогащаем адреса информацией о подписках и боксах
  const enrichedAddresses = deliveryAddresses.map((address) => {
    const enrichedAddress: DeliveryAddress = { ...address };

    // Ищем подписки, использующие этот адрес
    const relatedSubscription = user?.children.flatMap((child) =>
      child.subscriptions.filter((sub) => sub.delivery_info_id === address.id)
    )[0];

    if (relatedSubscription) {
      const child = user?.children.find((c) =>
        c.subscriptions.some((sub) => sub.id === relatedSubscription.id)
      );

      // Получаем реальное имя плана из state
      const plan = state.subscriptionPlans.find(
        (plan) => plan.id === relatedSubscription.plan_id
      );

      enrichedAddress.subscriptionInfo = {
        id: relatedSubscription.id,
        childName: child?.name || t('unknown_child'),
        planName: plan?.name || t('plan_id', { id: relatedSubscription.plan_id }),
        status: relatedSubscription.status,
      };
    }

    // Здесь можно добавить логику для поиска боксов, использующих этот адрес
    // Пока оставляем пустым, так как нужно больше данных о боксах

    return enrichedAddress;
  });

  if (!enrichedAddresses || enrichedAddresses.length === 0) {
    return null;
  }

  return (
    <>
      {enrichedAddresses.map((address) => (
        <DeliveryProfileSection
          key={address.id}
          deliveryAddresses={[address]}
          onEditDelivery={() => onEditDelivery?.(address.id)}
        />
      ))}
    </>
  );
};
