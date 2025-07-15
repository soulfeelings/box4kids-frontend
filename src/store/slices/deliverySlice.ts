import { State } from "../store";
import { DeliveryAddressData } from "../../types";
import * as deliveryMutations from "../mutations/delivery";

// Типы мутаций для доставки
export interface DeliverySlice {
  addDeliveryAddress: (addressData: DeliveryAddressData) => void;
  updateDeliveryAddress: (
    id: number,
    addressData: Partial<DeliveryAddressData>
  ) => void;
  removeDeliveryAddress: (id: number) => void;
  setSelectedDeliveryAddressId: (id: number | null) => void;
}

// Slice для доставки
export const createDeliverySlice = (
  set: (fn: (state: State) => State) => void
): DeliverySlice => ({
  // Мутаторы доставки
  addDeliveryAddress: (addressData: DeliveryAddressData) =>
    set(deliveryMutations.addDeliveryAddress(addressData)),
  updateDeliveryAddress: (
    id: number,
    addressData: Partial<DeliveryAddressData>
  ) => set(deliveryMutations.updateDeliveryAddress(id, addressData)),
  removeDeliveryAddress: (id: number) =>
    set(deliveryMutations.removeDeliveryAddress(id)),
  setSelectedDeliveryAddressId: (id: number | null) =>
    set(deliveryMutations.setSelectedDeliveryAddressId(id)),
});
