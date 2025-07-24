import { useState, useEffect } from "react";
import { getAllInterests } from "../api/adminApi";

export interface Interest {
  id: number;
  name: string;
}

export const useAdminInterests = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInterests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllInterests();
      setInterests(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка загрузки интересов"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  return {
    interests,
    isLoading,
    error,
    fetchInterests,
  };
};
