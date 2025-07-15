import React, { useState } from "react";
import { DeliveryHistoryPage } from "./DeliveryHistoryPage";
import { SupportPage } from "./SupportPage";
import { BottomNavigation } from "../features/BottomNavigation";
import { clearPersistedStore, useStore } from "../store/store";
import { EditNamePage } from "./EditNamePage";
import { EditPhonePage } from "./EditPhonePage";
import { ProfileItem } from "../components/profile/ProfileItem";
import { DeliveryProfileSections } from "../features/DeliveryProfileSections";
import { PaymentDataPage } from "./PaymentDataPage";

export const ProfilePage: React.FC = () => {
  const { user } = useStore();
  const [showDeliveryHistory, setShowDeliveryHistory] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [showEditPhone, setShowEditPhone] = useState(false);
  const [showPaymentData, setShowPaymentData] = useState(false);
  // Handle delivery history click
  const handleDeliveryHistoryClick = () => {
    setShowDeliveryHistory(true);
  };

  // Handle support click
  const handleSupportClick = () => {
    setShowSupport(true);
  };

  const handlePaymentDataClick = () => {
    setShowPaymentData(true);
  };

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
          label="Имя"
          value={user?.name}
          isEditable={true}
          customRadius="rounded-[24px]"
          onEditClick={() => setShowEditName(true)}
        />

        {/* Phone */}
        <ProfileItem
          label="Номер"
          value={user?.phone}
          isEditable={true}
          customRadius="rounded-[24px]"
          onEditClick={() => setShowEditPhone(true)}
        />

        {/* Delivery */}
        <DeliveryProfileSections
          user={user || undefined}
          deliveryAddresses={user?.deliveryAddresses}
          onEditDelivery={(addressId) => {
            console.log("Edit delivery address:", addressId);
          }}
        />

        {/* Menu Items */}
        <div className="mt-6">
          <div onClick={handleDeliveryHistoryClick} className="cursor-pointer">
            <ProfileItem
              label="История доставок"
              hasArrow={true}
              isMenuItem={true}
            />
          </div>

          <div onClick={handlePaymentDataClick} className="cursor-pointer">
            <ProfileItem
              label="Платёжные данные"
              hasArrow={true}
              isMenuItem={true}
            />
          </div>

          <div onClick={handleSupportClick} className="cursor-pointer">
            <ProfileItem label="Поддержка" hasArrow={true} isMenuItem={true} />
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
          <ProfileItem label="Выйти" isLogout={true} />
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
