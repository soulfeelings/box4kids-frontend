import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetAllUsersAdminUsersGet } from "../../../api-client";
import { AdminUserResponse } from "../../../api-client/model/adminUserResponse";

export const AdminUsersTable: React.FC = () => {
  const { t } = useTranslation();
  const { data: users, refetch } = useGetAllUsersAdminUsersGet();
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  const toggleUserExpansion = (userId: number) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      console.log("userId", userId);
      console.log("newRole", newRole);
      // API call to change role
      await refetch();
    } catch (err) {
      console.error("Ошибка изменения роли:", err);
    }
  };

  const handleBoxStatusChange = async (boxId: number, newStatus: string) => {
    try {
      console.log("boxId", boxId);
      console.log("newStatus", newStatus);
      // API call to change box status
      await refetch();
    } catch (err) {
      console.error("Ошибка изменения статуса:", err);
    }
  };

  if (!users) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {t("users")}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("name")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("phone")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("role")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("children")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("subscriptions")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user: AdminUserResponse) => (
              <React.Fragment key={user.id}>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phone_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="border-gray-300 rounded text-sm"
                    >
                      <option value="user">{t("user")}</option>
                      <option value="admin">{t("administrator")}</option>
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
                      {expandedUser === user.id ? t("hide") : t("details")}
                    </button>
                  </td>
                </tr>

                {expandedUser === user.id && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">
                          {t("children")}:
                        </h4>
                        {user.children.map((child) => (
                          <div
                            key={child.id}
                            className="ml-4 border-l-2 border-gray-200 pl-4"
                          >
                            <div className="font-medium">
                              {child.name} ({t("age")}: {child.date_of_birth})
                            </div>

                            {child.current_box && (
                              <div className="mt-2">
                                <div className="text-sm font-medium text-gray-700">
                                  {t("current_set")}:
                                </div>
                                <div className="text-sm text-gray-600">
                                  {t("status")}:
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
                                      {t("preparing")}
                                    </option>
                                    <option value="delivered">
                                      {t("delivered")}
                                    </option>
                                    <option value="returned">
                                      {t("returned")}
                                    </option>
                                  </select>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {t("toys")}:{" "}
                                  {child.current_box.items
                                    ?.map(
                                      (item) =>
                                        `${t("toy_category")} ${
                                          item.toy_category_id
                                        } (${item.quantity})`
                                    )
                                    .join(", ") || t("no_toys")}
                                </div>
                              </div>
                            )}

                            {child.next_box && (
                              <div className="mt-2">
                                <div className="text-sm font-medium text-gray-700">
                                  {t("next_set")}:
                                </div>
                                <div className="text-sm text-gray-600">
                                  {t("toys")}:{" "}
                                  {child.next_box.items
                                    ?.map(
                                      (item) =>
                                        `${t("toy_category")} ${
                                          item.category_id
                                        } (${item.quantity})`
                                    )
                                    .join(", ") || t("no_toys")}
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
