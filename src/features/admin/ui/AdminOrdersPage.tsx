import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUserToyBoxes, updateToyBoxStatus } from "../api/adminApi";

interface AdminOrdersPageProps {
  userId: number;
  userName?: string;
  onBack?: () => void;
}

const STATUS_OPTIONS = [
  "planned",
  "assembled",
  "shipped",
  "delivered",
  "returned",
];

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ userId, userName, onBack }) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserToyBoxes(userId);
      setOrders(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки заказов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleStatusChange = async (boxId: number, newStatus: string) => {
    setUpdatingId(boxId);
    setError(null);
    try {
      await updateToyBoxStatus(boxId, newStatus);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось обновить статус заказа");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {t("users")}: {userName ? `${userName} (ID: ${userId})` : `ID: ${userId}`}
        </h3>
        {onBack && (
          <button onClick={onBack} className="text-sm text-gray-600 hover:text-gray-900">
            {t("back")}
          </button>
        )}
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>{t("loading")}</div>
      ) : orders.length === 0 ? (
        <div className="text-sm text-gray-500">{t("no_data")}</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("status")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("delivery_date")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("delivery_time")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("return")}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{o.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="border-gray-300 rounded text-sm"
                    disabled={updatingId === o.id}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{o.delivery_date || "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{o.delivery_time || "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{o.return_date || "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleStatusChange(o.id, o.status)}
                    className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                    disabled={updatingId === o.id}
                  >
                    {updatingId === o.id ? t("saving") : t("save")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


