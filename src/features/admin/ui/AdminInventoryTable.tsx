import React, { useState } from "react";
import { useAdminInventory } from "../hooks/useAdminInventory";
import { AdminInventoryItem } from "../types";

export const AdminInventoryTable: React.FC = () => {
  const { inventory, isLoading, error, updateInventoryItem } =
    useAdminInventory();
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  const handleEdit = (item: AdminInventoryItem) => {
    setEditingItem(item.id);
    setEditQuantity(item.available_quantity);
  };

  const handleSave = async (categoryId: number) => {
    try {
      await updateInventoryItem(categoryId, editQuantity);
      setEditingItem(null);
    } catch (err) {
      console.error("Ошибка обновления:", err);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Загрузка остатков...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">Ошибка: {error}</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Остатки на складе ({inventory.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категория
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Доступно
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Обновлено
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.category_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {item.category_id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingItem === item.id ? (
                    <input
                      type="number"
                      min="0"
                      value={editQuantity}
                      onChange={(e) =>
                        setEditQuantity(parseInt(e.target.value) || 0)
                      }
                      className="w-20 text-sm border-gray-300 rounded-md"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">
                      {item.available_quantity}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.updated_at).toLocaleDateString("ru-RU")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingItem === item.id ? (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleSave(item.category_id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Отмена
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Изменить
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
