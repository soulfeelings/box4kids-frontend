import React, { useMemo, useState, useCallback } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BottomNavigation } from "../features/BottomNavigation";
import { DeliveryEditForm } from "../features/DeliveryEditForm";
import { ActionButton } from "../features/ActionButton";
import { useStore } from "../store/store";
import { useUpdateDeliveryAddressDeliveryAddressesAddressIdPut } from "../api-client/";
import { convertDeliveryDateToISO } from "../utils/date/convert";
import { notifications } from "../utils/notifications";

interface DeliveryData {
  name: string;
  address: string;
  date: string;
  time: string;
  comment: string | null;
}

export const EditDeliveryInfoPage: React.FC = () => {
  const { addressId } = useParams<{ addressId: string }>();
  const navigate = useNavigate();
  const updateDeliveryAddress = useStore(
    (state) => state.updateDeliveryAddress
  );
  const setError = useStore((state) => state.setError);
  const deliveryAddresses = useStore((state) => state.user?.deliveryAddresses);
  const currentAddress = useMemo(
    () =>
      deliveryAddresses?.find(
        (address) => address.id === parseInt(addressId || "0")
      ),
    [deliveryAddresses, addressId]
  );

  const updateDeliveryAddressMutation =
    useUpdateDeliveryAddressDeliveryAddressesAddressIdPut();

  // Состояние для данных адреса
  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    name: currentAddress?.name || "",
    address: currentAddress?.address || "",
    date: currentAddress?.date || "",
    time: currentAddress?.time || "",
    comment: currentAddress?.comment || "",
  });

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleDeliveryDataChange = useCallback((data: DeliveryData) => {
    setDeliveryData(data);
  }, []);

  const isDeliveryDataChanged = useMemo(() => {
    if (!currentAddress) return false;

    return (
      deliveryData.name !== currentAddress.name ||
      deliveryData.address !== currentAddress.address ||
      deliveryData.date !== currentAddress.date ||
      deliveryData.time !== currentAddress.time ||
      deliveryData.comment !== currentAddress.comment
    );
  }, [deliveryData, currentAddress]);

  const isFormValid =
    deliveryData.name.trim() &&
    deliveryData.address.trim() &&
    deliveryData.date &&
    deliveryData.time;

  const handleSave = useCallback(async () => {
    if (!isFormValid || !currentAddress) return;

    try {
      const updateData: any = {};

      debugger;
      // Добавляем данные адреса если они изменились
      if (isDeliveryDataChanged) {
        updateData.name = deliveryData.name;
        updateData.address = deliveryData.address;
        updateData.date = convertDeliveryDateToISO(deliveryData.date);
        updateData.time = deliveryData.time;
        updateData.courier_comment = deliveryData.comment;
      }

      const updatedAddress = await updateDeliveryAddressMutation.mutateAsync({
        addressId: currentAddress.id,
        data: updateData,
      });

      // Обновляем в store
      updateDeliveryAddress(currentAddress.id, {
        name: updatedAddress.name,
        address: updatedAddress.address,
        date: updatedAddress.date,
        time: updatedAddress.time,
        comment: updatedAddress.courier_comment || "",
      });

      notifications.deliveryAddressUpdated();
      navigate(-1);
    } catch (error) {
      console.error("Failed to update delivery address:", error);
      setError("Не удалось обновить адрес доставки");
      notifications.error("Не удалось сохранить данные адреса");
    }
  }, [
    currentAddress,
    updateDeliveryAddressMutation,
    deliveryData,
    isDeliveryDataChanged,
    updateDeliveryAddress,
    setError,
    isFormValid,
    navigate,
  ]);

  // Если адрес не найден
  if (!currentAddress) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Адрес доставки не найден</p>
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-center relative">
          <h1 className="text-[20px] text-gray-900 text-center">
            Изменить доставку
          </h1>
          <button
            onClick={handleClose}
            className="absolute right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-24 overflow-y-auto">
        <div className="space-y-6">
          {/* Delivery Edit Form */}
          <DeliveryEditForm
            deliveryAddress={currentAddress}
            onDataChange={handleDeliveryDataChange}
            isDisabled={updateDeliveryAddressMutation.isPending}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-24 left-4 right-4">
        <ActionButton
          onClick={handleSave}
          disabled={!isFormValid || !isDeliveryDataChanged}
          isLoading={updateDeliveryAddressMutation.isPending}
          variant="primary"
        >
          Сохранить
        </ActionButton>
      </div>

      <BottomNavigation />
    </div>
  );
};
