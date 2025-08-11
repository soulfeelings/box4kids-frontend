import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllowedDeliveryDates,
  addAllowedDeliveryDate,
  removeAllowedDeliveryDate,
} from "../api/adminApi";

export const AdminDeliveryDates: React.FC = () => {
  const { t } = useTranslation();
  const [dates, setDates] = useState<string[]>([]);
  const [newDate, setNewDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllowedDeliveryDates();
      setDates(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки дат");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onAdd = async () => {
    if (!newDate) return;
    setLoading(true);
    setError(null);
    try {
      const data = await addAllowedDeliveryDate(newDate);
      setDates(data);
      setNewDate("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка добавления даты");
    } finally {
      setLoading(false);
    }
  };

  const onRemove = async (d: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await removeAllowedDeliveryDate(d);
      setDates(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка удаления даты");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md p-4">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        {t("allowed_delivery_dates")}
      </h3>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="border-gray-300 rounded px-2 py-1"
        />
        <button
          onClick={onAdd}
          disabled={loading || !newDate}
          className="bg-indigo-600 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          {t("add")}
        </button>
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      {loading ? (
        <div>{t("loading")}</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {dates.map((d) => (
            <li key={d} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-900">{d}</span>
              <button
                onClick={() => onRemove(d)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                {t("delete")}
              </button>
            </li>
          ))}
          {dates.length === 0 && (
            <li className="py-2 text-sm text-gray-500">{t("no_data")}</li>
          )}
        </ul>
      )}
    </div>
  );
};

