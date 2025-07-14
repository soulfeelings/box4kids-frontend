import React, { useState } from "react";
import { useStore } from "../../../store/store";
import { useCreateDeliveryAddressDeliveryAddressesPost } from "../../../api-client/";
import { DeliveryAddressCards } from "../../../features/DeliveryAddressCards";

export const DeliveryStep: React.FC<{
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
}> = ({ onBack, onNext, onClose }) => {
  const { user } = useStore();
  const createDeliveryAddressMutation =
    useCreateDeliveryAddressDeliveryAddressesPost();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [isCreatingNew, setIsCreatingNew] = useState(
    !user?.deliveryAddresses || user.deliveryAddresses.length === 0
  );

  const [deliveryData, setDeliveryData] = useState({
    name: "",
    address: "",
    date: "",
    time: "",
    comment: "",
  });

  const handleAddressSelect = (id: number) => {
    setSelectedAddressId(id);
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
    setSelectedAddressId(null);
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

  const handleBack = () => {
    onBack();
  };

  const handleClose = () => {
    onClose();
  };

  const timeOptions = [
    { value: "", label: "Выберите время" },
    { value: "9-12", label: "9:00 - 12:00" },
    { value: "12-15", label: "12:00 - 15:00" },
    { value: "15-18", label: "15:00 - 18:00" },
    { value: "18-21", label: "18:00 - 21:00" },
  ];

  // Generate date options for next 14 days
  const generateDateOptions = () => {
    const options = [{ value: "", label: "Выберите дату" }];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");

      const value = `${day}.${month}`;
      const dayOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][
        date.getDay()
      ];
      const monthName = [
        "янв",
        "фев",
        "мар",
        "апр",
        "мая",
        "июн",
        "июл",
        "авг",
        "сен",
        "окт",
        "ноя",
        "дек",
      ][date.getMonth()];

      let label;
      if (i === 0) {
        label = `Сегодня, ${day} ${monthName}`;
      } else if (i === 1) {
        label = `Завтра, ${day} ${monthName}`;
      } else {
        label = `${dayOfWeek}, ${day} ${monthName}`;
      }

      options.push({ value, label });
    }

    return options;
  };

  const dateOptions = generateDateOptions();

  const handleDeliverySubmit = async () => {
    if (!isDeliveryFormValid) return;

    // Если выбран существующий адрес, просто продолжаем
    if (selectedAddressId !== null) {
      onNext();
      return;
    }

    // Если создается новый адрес, отправляем запрос
    try {
      await createDeliveryAddressMutation.mutateAsync({
        data: {
          name: deliveryData.name,
          address: deliveryData.address,
          date: deliveryData.date,
          time: deliveryData.time,
          courier_comment: deliveryData.comment,
        },
      });

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

        <span
          className="text-sm font-medium text-gray-600"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Шаг 5/6
        </span>

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
            Куда доставить набор?
          </h1>
        </div>

        {/* Delivery Address Cards */}
        {user && (
          <DeliveryAddressCards
            user={user}
            selectedAddressId={selectedAddressId}
            onAddressSelect={handleAddressSelect}
            onAddNewAddress={handleAddNewAddress}
            isCreatingNew={isCreatingNew}
          />
        )}

        {/* Show form when creating new address or no saved addresses */}
        {(isCreatingNew ||
          !user?.deliveryAddresses ||
          user.deliveryAddresses.length === 0) && (
          <div className="space-y-6">
            {/* Адрес */}
            <div>
              <label
                className="block text-gray-600 text-sm mb-3 px-3"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Название адреса
              </label>
              <div
                className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all relative ${
                  deliveryData.name
                    ? "border-[#7782F5]"
                    : "border-gray-200 focus-within:border-[#7782F5]"
                }`}
              >
                <input
                  type="text"
                  className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 pr-9"
                  placeholder="Введите название адреса"
                  value={deliveryData.name}
                  onChange={(e) =>
                    setDeliveryData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  style={{ fontFamily: "Nunito, sans-serif" }}
                />
              </div>
            </div>

            {/* Адрес */}
            <div>
              <label
                className="block text-gray-600 text-sm mb-3 px-3"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Адрес
              </label>
              <div
                className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all relative ${
                  deliveryData.address
                    ? "border-[#7782F5]"
                    : "border-gray-200 focus-within:border-[#7782F5]"
                }`}
              >
                <input
                  type="text"
                  className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 pr-9"
                  placeholder="Введите адрес доставки"
                  value={deliveryData.address}
                  onChange={(e) =>
                    setDeliveryData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  style={{ fontFamily: "Nunito, sans-serif" }}
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Дата доставки */}
            <div>
              <label
                className="block text-gray-600 text-sm mb-3 px-3"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Дата доставки
              </label>
              <div className="relative">
                <select
                  value={deliveryData.date}
                  onChange={(e) =>
                    setDeliveryData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 appearance-none focus:outline-none focus:border-[#7782F5] pr-12"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {dateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Время доставки */}
            <div>
              <label
                className="block text-gray-600 text-sm mb-3 px-3"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Время доставки
              </label>
              <div className="relative">
                <select
                  value={deliveryData.time}
                  onChange={(e) =>
                    setDeliveryData((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 appearance-none focus:outline-none focus:border-[#7782F5] pr-12"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Комментарий для курьера */}
            <div>
              <label
                className="block text-gray-600 text-sm mb-3 px-3"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Комментарий для курьера
              </label>
              <div
                className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
                  deliveryData.comment
                    ? "border-[#7782F5]"
                    : "border-gray-200 focus-within:border-[#7782F5]"
                }`}
              >
                <textarea
                  className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 resize-none"
                  placeholder="Дополнительная информация для курьера"
                  value={deliveryData.comment || ""}
                  onChange={(e) =>
                    setDeliveryData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  rows={4}
                  style={{ fontFamily: "Nunito, sans-serif" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom action button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
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
            ? "Создаем адрес..."
            : selectedAddressId !== null
            ? "Использовать этот адрес"
            : "Создать адрес"}
        </button>
      </div>
    </div>
  );
};
