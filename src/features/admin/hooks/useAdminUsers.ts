import { useState, useEffect } from "react";
import {
  getAdminUsers,
  updateUserRole,
  updateToyBoxStatus,
} from "../api/adminApi";
import { AdminUser } from "../types";

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка загрузки пользователей"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const changeUserRole = async (userId: number, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      await fetchUsers(); // Обновляем список
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка изменения роли");
      throw err;
    }
  };

  const changeToyBoxStatus = async (boxId: number, newStatus: string) => {
    try {
      await updateToyBoxStatus(boxId, newStatus);
      await fetchUsers(); // Обновляем список
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка изменения статуса");
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    changeUserRole,
    changeToyBoxStatus,
  };
};
