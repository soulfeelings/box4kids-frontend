import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from "../hooks/useAdminAuth";
import { AdminAuthForm } from "./AdminAuthForm";
import { AdminUsersTable } from "./AdminUsersTable";
import { AdminInventoryTable } from "./AdminInventoryTable";
import { AdminMappingsTable } from "./AdminMappingsTable";
import { AdminDeliveryDates } from "./AdminDeliveryDates";

type AdminTab = "users" | "inventory" | "mappings" | "deliveryDates";

export const AdminLayout: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("users");

  if (!isAuthenticated) {
    return (
      <AdminAuthForm
        onSuccess={() => {
          window.location.reload();
        }}
      />
    );
  }

  const tabs = [
    { id: "users" as AdminTab, name: t('users'), icon: "👥" },
    { id: "inventory" as AdminTab, name: t('inventory'), icon: "📦" },
    { id: "mappings" as AdminTab, name: t('mapping'), icon: "🔗" },
    { id: "deliveryDates" as AdminTab, name: t('allowed_delivery_dates'), icon: "📅" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return <AdminUsersTable />;
      case "inventory":
        return <AdminInventoryTable />;
      case "mappings":
        return <AdminMappingsTable />;
      case "deliveryDates":
        return <AdminDeliveryDates />;
      default:
        return <AdminUsersTable />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{t('admin_panel')}</h1>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">{renderTabContent()}</div>
      </div>
    </div>
  );
};
