import React, { useCallback, useState, useEffect } from "react";
import { DeliveryHistoryPage } from "./DeliveryHistoryPage";
import { SupportPage } from "./SupportPage";
import { BottomNavigation } from "../features/BottomNavigation";
import { clearPersistedStore, useStore } from "../store/store";
import { EditNamePage } from "./EditNamePage";
import { EditPhonePage } from "./EditPhonePage";
import { ProfileItem } from "../components/profile/ProfileItem";
import { DeliveryProfileSections } from "../features/DeliveryProfileSections";
import { PaymentDataPage } from "./PaymentDataPage";
import { useNavigateToEditDelivery } from "../hooks/useNavigateHooks";
import { useTranslation } from 'react-i18next';
import { LoadingComponent } from "../components/common/LoadingComponent";

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useStore();
  const navigateToEditDelivery = useNavigateToEditDelivery();
  const [showDeliveryHistory, setShowDeliveryHistory] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [showEditPhone, setShowEditPhone] = useState(false);
  const [showPaymentData, setShowPaymentData] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Симулируем загрузку данных
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle delivery history click
  const handleDeliveryHistoryClick = useCallback(() => {
    setShowDeliveryHistory(true);
  }, []);

  // Handle support click
  const handleSupportClick = useCallback(() => {
    setShowSupport(true);
  }, []);

  const handlePaymentDataClick = useCallback(() => {
    setShowPaymentData(true);
  }, []);

  if (isLoading) {
    return <LoadingComponent type="profile" />;
  }

  // Show delivery history page if requested
  if (showDeliveryHistory) {
    return (
      <DeliveryHistoryPage onClose={() => setShowDeliveryHistory(false)} />
    );
  }

  // Show support page if requested
  if (showSupport) {
    return <SupportPage onClose={() => setShowSupport(false)} />;
  }

  if (showEditName) {
    return (
      <EditNamePage
        onClose={() => setShowEditName(false)}
        onSave={() => {}}
        currentName={user?.name || ""}
      />
    );
  }

  if (showEditPhone) {
    return (
      <EditPhonePage
        onClose={() => setShowEditPhone(false)}
        onSave={() => {}}
        currentPhone={user?.phone || ""}
      />
    );
  }

  if (showPaymentData) {
    return <PaymentDataPage onClose={() => setShowPaymentData(false)} />;
  }

  return (
    <div
      className="min-h-screen bg-[#FFFFFF] pb-20"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Profile Content */}
      <div className="px-4 py-6">
        {/* Name */}
        <ProfileItem
          label={t('name')}
          value={user?.name}
          isEditable={true}
          customRadius="rounded-[24px]"
          onEditClick={() => setShowEditName(true)}
        />

        {/* Phone */}
        <ProfileItem
          label={t('phone')}
          value={user?.phone}
          isEditable={true}
          customRadius="rounded-[24px]"
          onEditClick={() => setShowEditPhone(true)}
        />

        {/* Delivery */}
        <DeliveryProfileSections
          user={user || undefined}
          deliveryAddresses={user?.deliveryAddresses}
          onEditDelivery={(addressId) => navigateToEditDelivery({ addressId })}
        />

        {/* Menu Items */}
        <div className="mt-6">
          <div onClick={handleDeliveryHistoryClick} className="cursor-pointer">
            <ProfileItem
              label={t('delivery_history')}
              hasArrow={true}
              isMenuItem={true}
            />
          </div>

          <div onClick={handlePaymentDataClick} className="cursor-pointer">
            <ProfileItem
              label={t('payment_data')}
              hasArrow={true}
              isMenuItem={true}
            />
          </div>

          <div onClick={handleSupportClick} className="cursor-pointer">
            <ProfileItem label={t('support')} hasArrow={true} isMenuItem={true} />
          </div>
        </div>

        {/* Logout */}
        <div
          className="mt-6"
          onClick={() => {
            clearPersistedStore();
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          <ProfileItem label={t('logout')} isLogout={true} />
        </div>
      </div>

      <BottomNavigation
        onHomeClick={() => {}}
        onChildrenClick={() => {}}
        onProfileClick={() => {}}
      />
    </div>
  );
};
