import React, { useCallback, useState } from "react";
import { useStore } from "../../../store";
import { selectSelectedDeliveryAddressId } from "../../../store/selectors";
import {
  useCreateDeliveryAddressDeliveryAddressesPost,
  useUpdateSubscriptionSubscriptionsSubscriptionIdPatch,
} from "../../../api-client/";
import { DeliveryAddressCards } from "../../../features/DeliveryAddressCards";
import {
  DeliveryData,
  DeliveryEditForm,
} from "../../../features/DeliveryEditForm";
import { dateManager } from "../../../utils/date/DateManager";
import { useChildrenSubscriptionsIds } from "../../../store/hooks";
import { useNavigateToEditDelivery } from "../../../hooks/useNavigateHooks";
import { StepIndicator } from "../../ui/StepIndicator";
import { useTranslation } from 'react-i18next';

export const DeliveryStep: React.FC<{
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
}> = ({ onBack, onNext, onClose }) => {
  const { t } = useTranslation();
  const { user, setSelectedDeliveryAddressId, addDeliveryAddress } = useStore();
  const subscriptionsIds = useChildrenSubscriptionsIds();
  const createDeliveryAddressMutation =
    useCreateDeliveryAddressDeliveryAddressesPost();
  const updateSubscriptionMutation =
    useUpdateSubscriptionSubscriptionsSubscriptionIdPatch();

  const selectedAddressId = useStore(selectSelectedDeliveryAddressId);
  const [isCreatingNew, setIsCreatingNew] = useState(
    !user?.deliveryAddresses || user.deliveryAddresses.length === 0
  );

  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    name: "",
    address: "",
    date: "", // ISO
    time: "",
    comment: "",
  });

  const handleDeliveryDataChange = useCallback((data: DeliveryData) => {
    setDeliveryData(data);
  }, []);

  const handleAddressSelect = (id: number) => {
    setSelectedDeliveryAddressId(id);
    setIsCreatingNew(false);

    // Заполняем данные выбранного адреса
    const selectedAddress = user?.deliveryAddresses.find(
      (address) => address.id === id
    );
    if (selectedAddress) {
      setDeliveryData({
        name: selectedAddress.name,
        address: selectedAddress.address,
        date: selectedAddress.date,
        time: selectedAddress.time,
        comment: selectedAddress.comment || "",
      });
    }
  };

  const handleAddNewAddress = () => {
    setSelectedDeliveryAddressId(null);
    setIsCreatingNew(true);

    // Очищаем форму для создания нового адреса
    setDeliveryData({
      name: "",
      address: "",
      date: "",
      time: "",
      comment: "",
    });
  };

  const navigateToEditDelivery = useNavigateToEditDelivery();
  const handleEditAddress = (addressId: number) => {
    navigateToEditDelivery({ addressId });
  };

  const handleBack = () => {
    onBack();
  };

  const handleClose = () => {
    onClose();
  };

  const updateSubscriptionsDeliveryInfoId = async (deliveryInfoId: number) => {
    const updatePromises = subscriptionsIds.map((subscriptionId: number) =>
      updateSubscriptionMutation.mutateAsync({
        subscriptionId,
        data: { delivery_info_id: deliveryInfoId },
      })
    );
    await Promise.all(updatePromises);
  };

  const handleDeliverySubmit = async () => {
    if (!isDeliveryFormValid) return;

    // Если выбран существующий адрес, просто продолжаем
    if (selectedAddressId !== null) {
      await updateSubscriptionsDeliveryInfoId(selectedAddressId);
      onNext();
      return;
    }

    // Если создается новый адрес, отправляем запрос
    try {
      const response = await createDeliveryAddressMutation.mutateAsync({
        data: {
          name: deliveryData.name,
          address: deliveryData.address,
          date: dateManager.toISO(deliveryData.date),
          time: deliveryData.time,
          courier_comment: deliveryData.comment,
        },
      });

      // Добавляем созданный адрес в store с ID из ответа
      addDeliveryAddress({
        id: response.id,
        name: response.name,
        address: response.address,
        date: response.date,
        time: response.time,
        comment: response.courier_comment || "",
      });

      await updateSubscriptionsDeliveryInfoId(response.id);

      onNext();
    } catch (error) {
      console.log();
    }
  };

  const isDeliveryFormValid =
    selectedAddressId !== null ||
    (deliveryData.address.trim() && deliveryData.date && deliveryData.time);

  const isLoading = createDeliveryAddressMutation.isPending;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with step indicator */}
      <div className="flex items-center justify-between px-4 py-2 h-16 bg-white">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <StepIndicator currentStep={6} />

        <button
          onClick={handleClose}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-4 pb-24 overflow-y-auto">
        {/* Title */}
        <div className="text-center mt-4 mb-6">
          <h1
            className="text-xl font-medium text-gray-900"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {t('where_to_deliver_set')}
          </h1>
        </div>

        {/* Delivery Address Cards */}
        {user && (
          <DeliveryAddressCards
            user={user}
            selectedAddressId={selectedAddressId}
            onAddressSelect={handleAddressSelect}
            onAddNewAddress={handleAddNewAddress}
            onEditAddress={handleEditAddress}
            isCreatingNew={isCreatingNew}
          />
        )}

        {/* Show form when creating new address or no saved addresses */}
        {(isCreatingNew ||
          !user?.deliveryAddresses ||
          user.deliveryAddresses.length === 0) && (
          <div className="space-y-6">
            <DeliveryEditForm
              onDataChange={handleDeliveryDataChange}
              isDisabled={isLoading}
            />
          </div>
        )}
      </div>

      {/* Bottom action button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 max-w-[800px] mx-auto">
        <button
          className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
            isDeliveryFormValid && !isLoading
              ? "text-white shadow-sm"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!isDeliveryFormValid || isLoading}
          onClick={handleDeliverySubmit}
          style={{
            fontFamily: "Nunito, sans-serif",
            backgroundColor:
              isDeliveryFormValid && !isLoading ? "#30313D" : undefined,
          }}
        >
          {isLoading
            ? t('creating_address')
            : selectedAddressId !== null
            ? t('use_this_address')
            : !user?.deliveryAddresses || user.deliveryAddresses.length === 0
            ? t('create_address')
            : t('create_new_address')}
        </button>
      </div>
    </div>
  );
};
