import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { DeliveryHistoryPage } from "./DeliveryHistoryPage";
import { SupportPage } from "./SupportPage";
import { BottomNavigation } from "../features/BottomNavigation";
import { clearPersistedStore, useStore } from "../store/store";
import { EditNamePage } from "./EditNamePage";
import { EditPhonePage } from "./EditPhonePage";

interface ProfileItemProps {
  label: string;
  value?: string;
  hasArrow?: boolean;
  isEditable?: boolean;
  icon?: React.ReactNode;
  isDelivery?: boolean;
  isLogout?: boolean;
  deliveryAddress?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  customRadius?: string;
  isMenuItem?: boolean;
  onEditClick?: () => void;
}

const ProfileItem: React.FC<ProfileItemProps> = ({
  label,
  value,
  hasArrow = false,
  isEditable = false,
  isDelivery = false,
  isLogout = false,
  deliveryAddress,
  deliveryDate,
  deliveryTime,
  customRadius = "rounded-lg",
  isMenuItem = false,
  onEditClick,
}) => {
  const backgroundColor =
    isMenuItem || isLogout ? "bg-[#FFFFFF]" : "bg-[#F2F2F2]";

  return (
    <div className={`${backgroundColor} ${customRadius} px-4 py-3 mb-2`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div
            className={`text-sm ${
              isLogout ? "text-red-500" : "text-gray-600"
            } mb-1`}
          >
            {label}
          </div>
          {value && (
            <div
              className={`text-base ${
                isLogout ? "text-red-500" : "text-gray-900"
              }`}
            >
              {value}
            </div>
          )}
          {isDelivery && (
            <div className="mt-2">
              <div className="flex items-center text-base text-black mb-1">
                <div className="bg-[#F9F9F9] rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  <span className="text-xs">📍</span>
                </div>
                {deliveryAddress}
              </div>
              <div className="flex items-center text-base text-black">
                <div className="bg-[#F9F9F9] rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  <span className="text-xs">🗓</span>
                </div>
                {deliveryDate}, {deliveryTime}
              </div>
              <div className="mt-3">
                <button className="w-full bg-[#E3E3E3] text-sm text-black py-2 px-4 rounded-[32px] text-center hover:bg-gray-300 transition-colors">
                  Изменить адрес или дату доставки
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center ml-4">
          {isEditable && (
            <button
              onClick={onEditClick}
              className="bg-[#E3E3E3] rounded-full p-2 mr-2 hover:bg-gray-300 transition-colors"
            >
              <img
                src="/illustrations/pen.png"
                alt="Edit"
                className="w-4 h-4"
              />
            </button>
          )}
          {hasArrow && <ChevronRight className="w-5 h-5 text-gray-400" />}
        </div>
      </div>
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const { user } = useStore();
  const [showDeliveryHistory, setShowDeliveryHistory] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [showEditPhone, setShowEditPhone] = useState(false);

  // Handle delivery history click
  const handleDeliveryHistoryClick = () => {
    setShowDeliveryHistory(true);
  };

  // Handle support click
  const handleSupportClick = () => {
    setShowSupport(true);
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
        {/* <ProfileItem
          label="Доставка"
          isDelivery={true}
          deliveryAddress={user?.deliveryAddresses[0]?.address}
          deliveryDate={formatDeliveryDate(user?.deliveryAddresses[0]?.date)}
          deliveryTime={formatDeliveryTime(user?.deliveryAddresses[0]?.time)}
          customRadius="rounded-[24px]"
        /> */}

        {/* Menu Items */}
        <div className="mt-6">
          {/* <div onClick={handleDeliveryHistoryClick} className="cursor-pointer">
            <ProfileItem
              label="История доставок"
              hasArrow={true}
              isMenuItem={true}
            />
          </div> */}

          {/* <ProfileItem
            label="Платёжные данные"
            hasArrow={true}
            isMenuItem={true}
          /> */}

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
