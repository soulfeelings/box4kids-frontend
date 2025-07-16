import React, { useEffect, useState } from "react";
import { DeliveryAddressData } from "../types";
import { dateManager } from "../utils/date/DateManager";

interface DeliveryData {
  name: string;
  address: string;
  date: string; // ISO
  time: string;
  comment: string | null;
}

interface DeliveryEditFormProps {
  deliveryAddress?: DeliveryAddressData;
  onDataChange: (data: DeliveryData) => void;
  isDisabled?: boolean;
}

const timeOptions = [
  { value: "", label: "Выберите время" },
  { value: "9:00 – 12:00", label: "9:00 - 12:00" },
  { value: "12:00 – 15:00", label: "12:00 - 15:00" },
  { value: "15:00 – 18:00", label: "15:00 - 18:00" },
  { value: "18:00 – 21:00", label: "18:00 - 21:00" },
];

export const DeliveryEditForm: React.FC<DeliveryEditFormProps> = ({
  deliveryAddress,
  onDataChange,
  isDisabled = false,
}) => {
  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    name: "",
    address: "",
    date: "",
    time: "",
    comment: "",
  });

  // Инициализация данных при загрузке
  useEffect(() => {
    if (deliveryAddress) {
      setDeliveryData({
        name: deliveryAddress.name,
        address: deliveryAddress.address,
        date: deliveryAddress.date, // Уже в ISO формате
        time: deliveryAddress.time,
        comment: deliveryAddress.comment,
      });
    }
  }, [deliveryAddress]);

  // Уведомляем родительский компонент об изменениях
  useEffect(() => {
    onDataChange(deliveryData);
  }, [deliveryData, onDataChange]);

  const dateOptions = dateManager.generateDateOptions();

  return (
    <div className="space-y-6">
      {/* Название адреса */}
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-gray-600 px-3"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Название адреса
        </label>
        <div className="w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all border-gray-200 focus-within:border-[#7782F5]">
          <input
            type="text"
            className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
            placeholder="Введите название адреса"
            value={deliveryData.name}
            onChange={(e) => {
              setDeliveryData({ ...deliveryData, name: e.target.value });
            }}
            maxLength={50}
            disabled={isDisabled}
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </div>
      </div>

      {/* Адрес */}
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-gray-600 px-3"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Адрес
        </label>
        <div className="w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all relative border-gray-200 focus-within:border-[#7782F5]">
          <input
            type="text"
            className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 pr-9"
            placeholder="Введите адрес доставки"
            value={deliveryData.address}
            onChange={(e) => {
              setDeliveryData({ ...deliveryData, address: e.target.value });
            }}
            maxLength={200}
            disabled={isDisabled}
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
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-gray-600 px-3"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Дата доставки
        </label>
        <div className="relative">
          <select
            value={dateManager.toShort(deliveryData.date)}
            onChange={(e) => {
              const isoDate = dateManager.toISO(e.target.value);
              setDeliveryData({ ...deliveryData, date: isoDate });
            }}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 appearance-none focus:outline-none focus:border-[#7782F5] pr-12"
            style={{ fontFamily: "Nunito, sans-serif" }}
            disabled={isDisabled}
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
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-gray-600 px-3"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Время доставки
        </label>
        <div className="relative">
          <select
            value={deliveryData.time}
            onChange={(e) => {
              setDeliveryData({ ...deliveryData, time: e.target.value });
            }}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 appearance-none focus:outline-none focus:border-[#7782F5] pr-12"
            style={{ fontFamily: "Nunito, sans-serif" }}
            disabled={isDisabled}
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
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-gray-600 px-3"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Комментарий для курьера
        </label>
        <div className="w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all border-gray-200 focus-within:border-[#7782F5]">
          <textarea
            className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 resize-none"
            placeholder="Дополнительная информация для курьера"
            value={deliveryData.comment || ""}
            onChange={(e) =>
              setDeliveryData({ ...deliveryData, comment: e.target.value })
            }
            rows={4}
            maxLength={500}
            disabled={isDisabled}
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </div>
      </div>
    </div>
  );
};
