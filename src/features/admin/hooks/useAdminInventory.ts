import { useState, useEffect } from "react";
import { getAdminInventory, updateInventory } from "../api/adminApi";
import { AdminInventoryItem, UpdateInventoryRequest } from "../types";

export const useAdminInventory = () => {
  const [inventory, setInventory] = useState<AdminInventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAdminInventory();
      setInventory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки остатков");
    } finally {
      setIsLoading(false);
    }
  };

  const updateInventoryItem = async (categoryId: number, quantity: number) => {
    try {
      const data: UpdateInventoryRequest = { available_quantity: quantity };
      await updateInventory(categoryId, data);
      await fetchInventory(); // Обновляем список
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка обновления остатков"
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    inventory,
    isLoading,
    error,
    fetchInventory,
    updateInventoryItem,
  };
};
