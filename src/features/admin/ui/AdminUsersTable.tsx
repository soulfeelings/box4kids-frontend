import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetAllUsersAdminUsersGet } from "../../../api-client";
import { AdminUserResponse } from "../../../api-client/model/adminUserResponse";
import { AdminOrdersPage } from "./AdminOrdersPage";

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
                      <AdminOrdersPage userId={user.id} userName={user.name || undefined} onBack={() => setExpandedUser(null)} />
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
