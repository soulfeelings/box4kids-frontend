import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllowedDeliveryDates,
  addAllowedDeliveryDate,
  removeAllowedDeliveryDate,
  getAllowedDeliveryTimes,
  addAllowedDeliveryTimeRange,
  removeAllowedDeliveryTimeRange,
  addAllowedDeliveryHour,
  removeAllowedDeliveryHour,
} from "../api/adminApi";

export const AdminDeliveryDates: React.FC = () => {
  const { t } = useTranslation();
  const [dates, setDates] = useState<string[]>([]);
  const [newDate, setNewDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Times management
  const [timeRanges, setTimeRanges] = useState<string[]>([]);
  const [timeHours, setTimeHours] = useState<string[]>([]);
  const [newRangeStart, setNewRangeStart] = useState<string>("");
  const [newRangeEnd, setNewRangeEnd] = useState<string>("");
  const [newTimeHour, setNewTimeHour] = useState<string>("");

  const TIME_RE = useMemo(() => /^(?:[01]\d|2[0-3]):[0-5]\d$/, []);
  const formatTimeInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  };
  const normalizeHHMM = (value: string) => {
    const m = value.match(/^(\d{1,2}):(\d{1,2})$/);
    if (!m) return value;
    const h = m[1].padStart(2, "0");
    const mm = m[2].padStart(2, "0");
    return `${h}:${mm}`;
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllowedDeliveryDates();
      setDates(data);
      const times = await getAllowedDeliveryTimes();
      setTimeRanges(times.ranges);
      setTimeHours(times.hours);
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

  const onAddRange = async () => {
    if (!newRangeStart || !newRangeEnd) return;
    setLoading(true);
    setError(null);
    try {
      const formatted = `${newRangeStart} – ${newRangeEnd}`;
      const data = await addAllowedDeliveryTimeRange(formatted);
      setTimeRanges(data.ranges);
      setTimeHours(data.hours);
      setNewRangeStart("");
      setNewRangeEnd("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка добавления интервала");
    } finally {
      setLoading(false);
    }
  };

  const onRemoveRange = async (r: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await removeAllowedDeliveryTimeRange(r);
      setTimeRanges(data.ranges);
      setTimeHours(data.hours);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка удаления интервала");
    } finally {
      setLoading(false);
    }
  };

  const onAddHour = async () => {
    if (!newTimeHour) return;
    setLoading(true);
    setError(null);
    try {
      const data = await addAllowedDeliveryHour(newTimeHour);
      setTimeRanges(data.ranges);
      setTimeHours(data.hours);
      setNewTimeHour("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка добавления часа");
    } finally {
      setLoading(false);
    }
  };

  const onRemoveHour = async (h: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await removeAllowedDeliveryHour(h);
      setTimeRanges(data.ranges);
      setTimeHours(data.hours);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка удаления часа");
    } finally {
      setLoading(false);
    }
  };

  const isValidRange = useMemo(() => {
    if (!TIME_RE.test(newRangeStart) || !TIME_RE.test(newRangeEnd)) return false;
    return newRangeStart < newRangeEnd;
  }, [newRangeStart, newRangeEnd, TIME_RE]);
  const isValidHour = useMemo(() => TIME_RE.test(newTimeHour.trim()), [newTimeHour, TIME_RE]);

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

      <h3 className="text-lg leading-6 font-medium text-gray-900 mt-8 mb-4">
        {t("allowed_delivery_times")}
      </h3>

      {/* Add range (free text inputs, 24h pattern) */}
      <div className="flex items-center space-x-2 mb-3">
        <input
          type="text"
          inputMode="numeric"
          placeholder="HH:MM"
          value={newRangeStart}
          onChange={(e) => setNewRangeStart(formatTimeInput(e.target.value))}
          onBlur={() => setNewRangeStart(normalizeHHMM(newRangeStart))}
          className="border-gray-300 rounded px-2 py-1"
          maxLength={5}
        />
        <span className="text-gray-600">–</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="HH:MM"
          value={newRangeEnd}
          onChange={(e) => setNewRangeEnd(formatTimeInput(e.target.value))}
          onBlur={() => setNewRangeEnd(normalizeHHMM(newRangeEnd))}
          className="border-gray-300 rounded px-2 py-1"
          maxLength={5}
        />
        <button
          onClick={onAddRange}
          disabled={loading || !isValidRange}
          className="bg-indigo-600 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          {t("add_interval")}
        </button>
      </div>

      {/* Ranges list */}
      <ul className="divide-y divide-gray-200 mb-6">
        {timeRanges.map((r) => (
          <li key={r} className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-900">{r}</span>
            <button onClick={() => onRemoveRange(r)} className="text-red-600 hover:text-red-800 text-sm">
              {t("delete")}
            </button>
          </li>
        ))}
        {timeRanges.length === 0 && (
          <li className="py-2 text-sm text-gray-500">{t("no_data")}</li>
        )}
      </ul>

      {/* Add single hour */}
      <div className="flex items-center space-x-2 mb-3">
        <input
          type="text"
          inputMode="numeric"
          placeholder="HH:MM"
          value={newTimeHour}
          onChange={(e) => setNewTimeHour(formatTimeInput(e.target.value))}
          onBlur={() => setNewTimeHour(normalizeHHMM(newTimeHour))}
          className="border-gray-300 rounded px-2 py-1"
          maxLength={5}
        />
        <button
          onClick={onAddHour}
          disabled={loading || !isValidHour}
          className="bg-indigo-600 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          {t("add_hour")}
        </button>
      </div>

      {/* Hours list */}
      <ul className="divide-y divide-gray-200">
        {timeHours.map((h) => (
          <li key={h} className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-900">{h}</span>
            <button onClick={() => onRemoveHour(h)} className="text-red-600 hover:text-red-800 text-sm">
              {t("delete")}
            </button>
          </li>
        ))}
        {timeHours.length === 0 && (
          <li className="py-2 text-sm text-gray-500">{t("no_data")}</li>
        )}
      </ul>
    </div>
  );
};

