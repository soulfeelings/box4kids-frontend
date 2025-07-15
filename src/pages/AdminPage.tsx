import React, { useCallback, useMemo, useState } from "react";
import { Search, Eye, X } from "lucide-react";
import {
  useGetAllUsersAdminUsersGet,
  useUpdateToyBoxStatusAdminToyBoxesBoxIdStatusPut,
  useAdminLoginAdminLoginPost,
} from "../api-client";
import type {
  AdminUserResponse,
  ToyBoxResponse,
  NextBoxResponse,
  DeliveryInfoResponse,
  SubscriptionWithDetailsResponse,
} from "../api-client/model";

interface ClientData {
  id: number;
  phone: string;
  name: string;
  registeredWithoutSubscription: boolean;
  subscriptionStatus: string;
  deliveryAddresses: Array<{
    id: number;
    name: string;
    address: string;
    isUsedInSubscription?: boolean;
    isUsedInBox?: boolean;
  }>;
  nextDeliveryDate: string;
  childName: string;
  currentSet: string;
  currentSetStatus: string;
  currentBoxId?: number;
  nextSet: string;
  nextSetStatus: string;
  fullData: AdminUserResponse;
}

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Проверяем есть ли сохраненный токен при загрузке
    return !!localStorage.getItem("admin_token");
  });
  const [password, setPassword] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterColumn, setFilterColumn] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("nextDeliveryDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Состояние для модальных окон
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // API запросы
  const loginMutation = useAdminLoginAdminLoginPost();

  const {
    data: users,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useGetAllUsersAdminUsersGet();

  const updateStatusMutation =
    useUpdateToyBoxStatusAdminToyBoxesBoxIdStatusPut();

  const handleLogin = useCallback(async () => {
    try {
      const response = await loginMutation.mutateAsync({
        data: { password },
      });

      // Сохраняем токен в localStorage
      localStorage.setItem("admin_token", response.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      alert("Неверный пароль");
    }
  }, [loginMutation, password]);

  const handleStatusChange = useCallback(
    async (boxId: number, newStatus: string) => {
      try {
        await updateStatusMutation.mutateAsync({
          boxId,
          params: {
            new_status: newStatus,
          },
        });

        // Обновляем данные после успешного изменения
        refetchUsers();
      } catch (error) {
        console.error("Ошибка обновления статуса:", error);
        alert("Ошибка при обновлении статуса");
      }
    },
    [updateStatusMutation, refetchUsers]
  );

  const formatToyBox = useCallback((box: ToyBoxResponse): string => {
    if (!box.items || box.items.length === 0) return "---";

    const totalToys = box.items.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );
    const itemsList = box.items
      .map((item: any) => `- ${item.quantity} ${item.category_name}`)
      .join(" ");

    return `Набор на ${totalToys} игрушек: ${itemsList}`;
  }, []);

  const formatNextBox = useCallback((box: NextBoxResponse): string => {
    if (!box.items || box.items.length === 0) return "---";

    const totalToys = box.items.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );
    const itemsList = box.items
      .map((item: any) => `- ${item.quantity} ${item.category_name}`)
      .join(" ");

    return `Набор на ${totalToys} игрушек: ${itemsList}`;
  }, []);

  const transformUserToClientData = useCallback(
    (user: AdminUserResponse): ClientData[] => {
      const result: ClientData[] = [];

      // Получаем все адреса пользователя
      const userAddresses = user.delivery_addresses?.addresses || [];

      // Если у пользователя нет детей, создаем одну запись
      if (!user.children || user.children.length === 0) {
        result.push({
          id: user.id,
          phone: user.phone_number || "",
          name: user.name || "",
          registeredWithoutSubscription: true,
          subscriptionStatus: "Нет подписки",
          deliveryAddresses: userAddresses.map(
            (addr: DeliveryInfoResponse) => ({
              id: addr.id || 0,
              name: addr.name || "Адрес",
              address: addr.address || "Не указан",
            })
          ),
          nextDeliveryDate: "",
          childName: "",
          currentSet: "---",
          currentSetStatus: "",
          nextSet: "---",
          nextSetStatus: "",
          fullData: user,
        });
        return result;
      }

      // Для каждого ребенка создаем отдельную запись
      for (const child of user.children) {
        const currentBox = child.current_box;
        const nextBox = child.next_box;

        // Получаем подписку для этого ребенка
        const childSubscription = user.subscriptions?.find(
          (sub: SubscriptionWithDetailsResponse) => sub.child_id === child.id
        );

        // Помечаем адреса, которые используются в подписке и боксе
        const addressesWithUsage = userAddresses.map(
          (addr: DeliveryInfoResponse) => ({
            id: addr.id || 0,
            name: addr.name || "Адрес",
            address: addr.address || "Не указан",
            isUsedInSubscription:
              childSubscription?.delivery_info_id === addr.id,
            isUsedInBox: currentBox?.delivery_info_id === addr.id,
          })
        );

        result.push({
          id: user.id,
          phone: user.phone_number || "",
          name: user.name || "",
          registeredWithoutSubscription: !childSubscription,
          subscriptionStatus: childSubscription?.status || "Нет подписки",
          deliveryAddresses: addressesWithUsage,
          nextDeliveryDate:
            currentBox?.delivery_date || nextBox?.delivery_date || "",
          childName: child.name || "",
          currentSet: currentBox ? formatToyBox(currentBox) : "---",
          currentSetStatus: currentBox?.status || "",
          currentBoxId: currentBox?.id,
          nextSet: nextBox ? formatNextBox(nextBox) : "---",
          nextSetStatus: nextBox ? "Запланирован" : "",
          fullData: user,
        });
      }

      return result;
    },
    [formatNextBox, formatToyBox]
  );

  const filteredAndSortedData = useMemo(() => {
    if (!users) return [];

    // Преобразуем пользователей в записи для таблицы (каждый ребенок = отдельная запись)
    let data: ClientData[] = [];
    (users as AdminUserResponse[]).forEach((user: AdminUserResponse) => {
      const userRecords = transformUserToClientData(user);
      data.push(...userRecords);
    });

    // Фильтрация по поиску
    if (searchTerm) {
      data = data.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone.includes(searchTerm) ||
          client.childName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтрация по колонкам
    if (filterColumn) {
      data = data.filter((client) => {
        switch (filterColumn) {
          case "subscriptionStatus":
            return client.subscriptionStatus === "Активна";
          case "currentSet":
            return client.currentSet !== "---";
          case "nextSet":
            return client.nextSet !== "---";
          default:
            return true;
        }
      });
    }

    // Сортировка
    data.sort((a, b) => {
      const aValue = a[sortBy as keyof ClientData];
      const bValue = b[sortBy as keyof ClientData];

      if (sortOrder === "asc") {
        return (aValue || "") > (bValue || "") ? 1 : -1;
      } else {
        return (aValue || "") < (bValue || "") ? 1 : -1;
      }
    });

    return data;
  }, [
    users,
    searchTerm,
    filterColumn,
    sortBy,
    sortOrder,
    transformUserToClientData,
  ]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Админ панель
            </h2>
            <p className="text-gray-600">Введите пароль для входа</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль администратора"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Админ панель Box4Kids
            </h1>
            <button
              onClick={() => {
                localStorage.removeItem("admin_token");
                setIsAuthenticated(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Фильтры и поиск */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Поиск по имени, телефону или имени ребенка..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все</option>
                <option value="subscriptionStatus">Активные подписки</option>
                <option value="currentSet">Есть текущий набор</option>
                <option value="nextSet">Есть следующий набор</option>
              </select>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="nextDeliveryDate-asc">Дата доставки ↑</option>
                <option value="nextDeliveryDate-desc">Дата доставки ↓</option>
                <option value="name-asc">Имя ↑</option>
                <option value="name-desc">Имя ↓</option>
                <option value="childName-asc">Имя ребенка ↑</option>
                <option value="childName-desc">Имя ребенка ↓</option>
              </select>
            </div>
          </div>
        </div>

        {/* Таблица */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Клиент
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус подписки
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Адрес доставки
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата след. доставки
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ребенок
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Текущий набор
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус набора
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usersLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      Загрузка...
                    </td>
                  </tr>
                ) : filteredAndSortedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      Нет данных
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedData.map((client) => (
                    <tr
                      key={`${client.id}-${client.childName}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            #{client.id} {client.name}
                          </div>
                          <div className="text-gray-500">{client.phone}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            client.subscriptionStatus === "Активна"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {client.subscriptionStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                        {client.deliveryAddresses &&
                        client.deliveryAddresses.length > 0 ? (
                          <div className="space-y-1">
                            {client.deliveryAddresses.map((addr, index) => (
                              <div key={addr.id || index} className="text-xs">
                                <span className="font-medium">
                                  {addr.name || "Адрес"}:
                                </span>{" "}
                                <span
                                  className="truncate block"
                                  title={addr.address || "Не указан"}
                                >
                                  {addr.address || "Не указан"}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  ID: {addr.id}
                                </span>
                                {(addr.isUsedInSubscription ||
                                  addr.isUsedInBox) && (
                                  <span className="text-blue-600 text-xs ml-1">
                                    {addr.isUsedInSubscription && "📋"}
                                    {addr.isUsedInBox && "📦"}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">Нет адресов</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.nextDeliveryDate}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.childName}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={client.currentSet}>
                          {client.currentSet}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.currentBoxId ? (
                          <select
                            value={client.currentSetStatus}
                            onChange={(e) =>
                              handleStatusChange(
                                client.currentBoxId!,
                                e.target.value
                              )
                            }
                            disabled={updateStatusMutation.isPending}
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                          >
                            <option value="planned">Запланирован</option>
                            <option value="in_transit">В пути</option>
                            <option value="delivered">Доставлен</option>
                            <option value="return_in_transit">
                              Возврат в пути
                            </option>
                            <option value="returned">Возвращен</option>
                            <option value="cancelled">Отменен</option>
                          </select>
                        ) : (
                          client.currentSetStatus
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => {
                            setSelectedClient(client);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Детали
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Модальное окно с деталями */}
      {showDetailsModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Детали клиента</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Информация о клиенте */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Информация о клиенте
                </h3>
                <div className="space-y-2">
                  <div>
                    <strong>ID:</strong> {selectedClient.id}
                  </div>
                  <div>
                    <strong>Имя:</strong> {selectedClient.name}
                  </div>
                  <div>
                    <strong>Телефон:</strong> {selectedClient.phone}
                  </div>
                  <div>
                    <strong>Адреса доставки:</strong>
                    {selectedClient.deliveryAddresses &&
                    selectedClient.deliveryAddresses.length > 0 ? (
                      <div className="mt-2 space-y-2">
                        {selectedClient.deliveryAddresses.map((addr, index) => (
                          <div
                            key={addr.id || index}
                            className="bg-gray-50 p-3 rounded-lg"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {addr.name || "Адрес"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {addr.address || "Не указан"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {addr.id}
                                </div>
                              </div>
                              <div className="flex gap-1 ml-2">
                                {addr.isUsedInSubscription && (
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    Подписка
                                  </span>
                                )}
                                {addr.isUsedInBox && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                    Текущий бокс
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 text-gray-500">
                        Нет сохраненных адресов
                      </div>
                    )}
                  </div>
                  <div>
                    <strong>Статус подписки:</strong>{" "}
                    {selectedClient.subscriptionStatus}
                  </div>
                </div>
              </div>

              {/* Информация о ребенке */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Информация о ребенке
                </h3>
                <div className="space-y-2">
                  <div>
                    <strong>Имя ребенка:</strong> {selectedClient.childName}
                  </div>
                  <div>
                    <strong>Дата следующей доставки:</strong>{" "}
                    {selectedClient.nextDeliveryDate}
                  </div>
                </div>
              </div>

              {/* Текущий набор */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-3">Текущий набор</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-2">
                    <strong>Статус:</strong> {selectedClient.currentSetStatus}
                  </div>
                  <div>
                    <strong>Описание:</strong>
                  </div>
                  <div className="whitespace-pre-line text-sm">
                    {selectedClient.currentSet}
                  </div>
                </div>
              </div>

              {/* Следующий набор */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-3">Следующий набор</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-2">
                    <strong>Статус:</strong> {selectedClient.nextSetStatus}
                  </div>
                  <div>
                    <strong>Описание:</strong>
                  </div>
                  <div className="whitespace-pre-line text-sm">
                    {selectedClient.nextSet}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
