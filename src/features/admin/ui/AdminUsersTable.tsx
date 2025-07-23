import React, { useState } from "react";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { AdminUser } from "../types";

export const AdminUsersTable: React.FC = () => {
  const { users, isLoading, error, changeUserRole, changeToyBoxStatus } =
    useAdminUsers();
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  const toggleUserExpansion = (userId: number) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await changeUserRole(userId, newRole);
    } catch (err) {
      console.error("Ошибка изменения роли:", err);
    }
  };

  const handleBoxStatusChange = async (boxId: number, newStatus: string) => {
    try {
      await changeToyBoxStatus(boxId, newStatus);
    } catch (err) {
      console.error("Ошибка изменения статуса:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Загрузка пользователей...</div>
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
          Пользователи ({users.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роль
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дети
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Подписки
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.phone_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="text-sm border-gray-300 rounded-md"
                    >
                      <option value="user">Пользователь</option>
                      <option value="admin">Администратор</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.children.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.subscriptions.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleUserExpansion(user.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {expandedUser === user.id ? "Скрыть" : "Подробнее"}
                    </button>
                  </td>
                </tr>

                {expandedUser === user.id && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Дети:</h4>
                        {user.children.map((child) => (
                          <div
                            key={child.id}
                            className="ml-4 border-l-2 border-gray-200 pl-4"
                          >
                            <div className="font-medium">
                              {child.name} ({child.age} лет)
                            </div>

                            {child.current_box && (
                              <div className="mt-2">
                                <div className="text-sm font-medium text-gray-700">
                                  Текущий набор:
                                </div>
                                <div className="text-sm text-gray-600">
                                  Статус:
                                  <select
                                    value={child.current_box.status}
                                    onChange={(e) =>
                                      handleBoxStatusChange(
                                        child.current_box!.id,
                                        e.target.value
                                      )
                                    }
                                    className="ml-2 border-gray-300 rounded text-xs"
                                  >
                                    <option value="preparing">
                                      Подготовка
                                    </option>
                                    <option value="delivered">Доставлен</option>
                                    <option value="returned">Возвращен</option>
                                  </select>
                                </div>
                                <div className="text-sm text-gray-600">
                                  Игрушки:{" "}
                                  {child.current_box.items
                                    .map(
                                      (item) =>
                                        `${item.category_name} (${item.quantity})`
                                    )
                                    .join(", ")}
                                </div>
                              </div>
                            )}

                            {child.next_box && (
                              <div className="mt-2">
                                <div className="text-sm font-medium text-gray-700">
                                  Следующий набор:
                                </div>
                                <div className="text-sm text-gray-600">
                                  Игрушки:{" "}
                                  {child.next_box.items
                                    .map(
                                      (item) =>
                                        `${item.category_name} (${item.quantity})`
                                    )
                                    .join(", ")}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
