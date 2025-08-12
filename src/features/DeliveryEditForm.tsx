import React, { useEffect, useMemo, useState, useRef } from "react";
import { DeliveryAddressData } from "../types";
import { dateManager } from "../utils/date/DateManager";
import { useTranslation } from "react-i18next";

export interface DeliveryData {
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
  showErrors?: boolean;
}

export const DeliveryEditForm: React.FC<DeliveryEditFormProps> = ({
  deliveryAddress,
  onDataChange,
  isDisabled = false,
  showErrors = false,
}) => {
  const { t } = useTranslation();

  const fallbackTimeOptions = [
    { value: "", label: t("select_time") },
    { value: "9:00 – 12:00", label: "9:00 - 12:00" },
    { value: "12:00 – 15:00", label: "12:00 - 15:00" },
    { value: "15:00 – 18:00", label: "15:00 - 18:00" },
    { value: "18:00 – 21:00", label: "18:00 - 21:00" },
  ];

  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    name: "",
    address: "",
    date: "",
    time: "",
    comment: "",
  });

  const { name, address, date, time, comment } = useMemo(() => {
    return {
      name: deliveryAddress?.name,
      address: deliveryAddress?.address,
      date: deliveryAddress?.date, // Уже в ISO формате
      time: deliveryAddress?.time,
      comment: deliveryAddress?.comment,
    };
  }, [
    deliveryAddress?.name,
    deliveryAddress?.address,
    deliveryAddress?.date,
    deliveryAddress?.time,
    deliveryAddress?.comment,
  ]);

  // Инициализация данных при загрузке
  useEffect(() => {
    if (name && address && date && time && comment) {
      setDeliveryData({
        name,
        address,
        date,
        time,
        comment,
      });
    }
  }, [name, address, date, time, comment]);

  // Уведомляем родительский компонент об изменениях
  useEffect(() => {
    onDataChange(deliveryData);
  }, [deliveryData, onDataChange]);

  const [allowedDates, setAllowedDates] = useState<string[] | null>(null);
  const [allowedTimes, setAllowedTimes] = useState<{ ranges: string[]; hours: string[] } | null>(null);
  useEffect(() => {
    // Подтягиваем разрешенные даты для селекта
    (async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/delivery-dates/available`);
        if (resp.ok) {
          const json = await resp.json();
          setAllowedDates(json?.dates ?? null);
        } else {
          setAllowedDates(null);
        }
      } catch {
        setAllowedDates(null);
      }
    })();
    // Подтягиваем разрешенное время для селекта (интервалы и часы)
    (async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/delivery-times/available`);
        if (resp.ok) {
          const json = await resp.json();
          const ranges: string[] = Array.isArray(json?.ranges) ? json.ranges : [];
          const hours: string[] = Array.isArray(json?.hours) ? json.hours : [];
          if (ranges.length || hours.length) {
            setAllowedTimes({ ranges, hours });
          } else {
            setAllowedTimes(null);
          }
        } else {
          setAllowedTimes(null);
        }
      } catch {
        setAllowedTimes(null);
      }
    })();
  }, []);

  const dateOptions = useMemo(() => {
    if (allowedDates && allowedDates.length > 0) {
      const opts = [{ value: "", label: t("select_date") }];
      for (const iso of allowedDates) {
        // iso YYYY-MM-DD -> DD.MM
        const [, m, d] = iso.split("-");
        const short = `${d}.${m}`;
        const label = dateManager.toFormatted(iso);
        opts.push({ value: short, label });
      }
      return opts;
    }
    return dateManager.generateDateOptions();
  }, [allowedDates, t]);

  const timeOptions = useMemo(() => {
    if (allowedTimes) {
      const opts = [{ value: "", label: t("select_time") }];
      for (const r of allowedTimes.ranges) {
        opts.push({ value: r, label: r.replace("–", "-") });
      }
      for (const h of allowedTimes.hours) {
        opts.push({ value: h, label: h });
      }
      return opts;
    }
    return fallbackTimeOptions;
  }, [allowedTimes, t]);

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const suggestTimeout = useRef<NodeJS.Timeout | null>(null);

  // Закрытие подсказок при клике вне
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setAddressSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDetectAddress = async () => {
    setIsLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError(t("geolocation_not_supported"));
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Используем Nominatim для обратного геокодирования
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ru`
          );
          if (!response.ok) throw new Error(t("geocoding_error"));
          const data = await response.json();
          // Формируем адрес: страна, область, город, улица, дом
          const a = data.address || {};
          const formatted = [
            a.country,
            a.state || a.region,
            a.city || a.town || a.village,
            a.road || a.street,
            a.house_number,
          ]
            .filter(Boolean)
            .join(", ");
          const address = formatted || data.display_name || "";
          setDeliveryData((prev) => {
            const newData = { ...prev, address };
            onDataChange(newData);
            return newData;
          });
        } catch (e) {
          setLocationError(t("failed_to_determine_address"));
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setLocationError(t("failed_to_get_geolocation"));
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDeliveryData({ ...deliveryData, address: value });
    setSuggestError(null);
    if (suggestTimeout.current) clearTimeout(suggestTimeout.current);
    if (!value || value.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    setIsSuggesting(true);
    suggestTimeout.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value
        )}&addressdetails=1&accept-language=ru&limit=10`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(t("suggestions_error"));
        const data = await response.json();
        setAddressSuggestions(data);
      } catch (e) {
        setSuggestError(t("failed_to_get_suggestions"));
      } finally {
        setIsSuggesting(false);
      }
    }, 700); // задержка для снижения нагрузки на API
  };

  const handleSuggestionClick = (suggestion: any) => {
    const a = suggestion.address || {};
    // Формируем адрес только до самого глубокого уровня
    const parts = [a.country];
    if (a.state || a.region) parts.push(a.state || a.region);
    if (a.city || a.town || a.village)
      parts.push(a.city || a.town || a.village);
    if (a.road || a.street) parts.push(a.road || a.street);
    if (a.house_number) parts.push(a.house_number);
    // Обрезаем до самого глубокого уровня, который есть в подсказке
    let lastIdx = parts.length - 1;
    while (lastIdx >= 0 && !parts[lastIdx]) lastIdx--;
    const smartAddress = parts
      .slice(0, lastIdx + 1)
      .filter(Boolean)
      .join(", ");
    setDeliveryData((prev) => {
      const newData = { ...prev, address: smartAddress };
      onDataChange(newData);
      return newData;
    });
    setAddressSuggestions([]);
  };

  return (
    <div className="space-y-6">
      

      {/* Адрес */}
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-gray-600 px-3"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {t("address")}
        </label>
        <div className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all relative ${showErrors && !deliveryData.address.trim() ? "border-red-500" : "border-gray-200"} focus-within:border-[#7782F5]`}>
          <input
            type="text"
            className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 pr-9"
            placeholder={t("enter_delivery_address")}
            value={deliveryData.address}
            onChange={handleAddressInput}
            maxLength={200}
            disabled={isDisabled}
            style={{ fontFamily: "Nunito, sans-serif" }}
            autoComplete="off"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 hover:text-blue-600 focus:outline-none"
            onClick={handleDetectAddress}
            disabled={isDisabled || isLocating}
            aria-label={t("auto_detect_address")}
          >
            {isLocating ? (
              <svg
                className="animate-spin w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
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
            )}
          </button>
          {addressSuggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute left-0 right-0 top-full z-20 bg-white border border-gray-300 rounded-b-2xl shadow-lg max-h-72 overflow-y-auto"
              style={{ minWidth: "200px" }}
            >
              {addressSuggestions.map((suggestion, idx) => {
                const a = suggestion.address || {};
                // Формируем строку: страна, область, город, улица[, дом]
                const parts = [
                  a.country,
                  a.state || a.region,
                  a.city || a.town || a.village,
                  a.road || a.street,
                ].filter(Boolean);
                let label = parts.join(", ");
                if (a.house_number) {
                  label += `, ${a.house_number}`;
                }
                return (
                  <div
                    key={idx}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0"
                    style={{ whiteSpace: "normal", lineHeight: "1.3" }}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {label || suggestion.display_name}
                  </div>
                );
              })}
            </div>
          )}
          {isSuggesting && (
            <div className="absolute left-0 right-0 top-full z-10 bg-white border-t-0 border border-gray-200 rounded-b-2xl shadow-lg px-4 py-2 text-xs text-gray-500">
              {t("loading_suggestions")}
            </div>
          )}
          {suggestError && (
            <div className="text-xs text-red-500 mt-1 px-3">{suggestError}</div>
          )}
        </div>
        {locationError && (
          <div className="text-xs text-red-500 mt-1 px-3">{locationError}</div>
        )}
      </div>

      {/* Дата доставки */}
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-gray-600 px-3"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {t("delivery_date")}
        </label>
        <div className="relative">
          <select
            value={dateManager.toShort(deliveryData.date)}
            onChange={(e) => {
              const isoDate = dateManager.toISO(e.target.value);
              setDeliveryData({ ...deliveryData, date: isoDate });
            }}
            className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-2xl appearance-none focus:outline-none pr-12 ${showErrors && !deliveryData.date ? "border-red-500" : "border-gray-200"} ${deliveryData.date ? "text-gray-900" : "text-gray-400"} focus:border-[#7782F5]`}
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
          {t("delivery_time")}
        </label>
        <div className="relative">
          <select
            value={deliveryData.time}
            onChange={(e) => {
              setDeliveryData({ ...deliveryData, time: e.target.value });
            }}
            className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-2xl appearance-none focus:outline-none pr-12 ${showErrors && !deliveryData.time ? "border-red-500" : "border-gray-200"} ${deliveryData.time ? "text-gray-900" : "text-gray-400"} focus:border-[#7782F5]`}
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
          {t("courier_comment")}
        </label>
        <div className="w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all border-gray-200 focus-within:border-[#7782F5]">
          <textarea
            className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 resize-none"
            placeholder={t("additional_info_for_courier")}
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
