import { State } from "../store";
import { DeliveryAddressData } from "../../types";

// Мутаторы для управления адресами доставки
export const addDeliveryAddress =
  (addressData: DeliveryAddressData) =>
  (state: State): State => {
    if (!state.user) {
      console.error("addDeliveryAddress: User not found");
      return state;
    }
    return {
      ...state,
      user: {
        ...state.user,
        deliveryAddresses: [...state.user.deliveryAddresses, addressData],
      },
      selectedDeliveryAddressId: addressData.id,
    };
  };

export const updateDeliveryAddress =
  (id: number, addressData: Partial<DeliveryAddressData>) =>
  (state: State): State => {
    if (!state.user) {
      console.error("updateDeliveryAddress: User not found");
      return state;
    }

    const addressIndex = state.user.deliveryAddresses.findIndex(
      (address) => address.id === id
    );
    if (addressIndex === -1) {
      console.error(`updateDeliveryAddress: Address with id ${id} not found`);
      return state;
    }

    const updatedAddresses = [...state.user.deliveryAddresses];
    updatedAddresses[addressIndex] = {
      ...updatedAddresses[addressIndex],
      ...addressData,
    };

    return {
      ...state,
      user: {
        ...state.user,
        deliveryAddresses: updatedAddresses,
      },
    };
  };

export const removeDeliveryAddress =
  (id: number) =>
  (state: State): State => {
    if (!state.user) {
      console.error("removeDeliveryAddress: User not found");
      return state;
    }

    const addressExists = state.user.deliveryAddresses.some(
      (address) => address.id === id
    );
    if (!addressExists) {
      console.error(`removeDeliveryAddress: Address with id ${id} not found`);
      return state;
    }

    return {
      ...state,
      user: {
        ...state.user,
        deliveryAddresses: state.user.deliveryAddresses.filter(
          (address) => address.id !== id
        ),
      },
    };
  };

export const setSelectedDeliveryAddressId =
  (id: number | null) =>
  (state: State): State => {
    return { ...state, selectedDeliveryAddressId: id };
  };
