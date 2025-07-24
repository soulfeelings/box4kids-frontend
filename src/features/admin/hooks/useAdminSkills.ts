import { useState, useEffect } from "react";
import { getAllSkills } from "../api/adminApi";

export interface Skill {
  id: number;
  name: string;
}

export const useAdminSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllSkills();
      setSkills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки навыков");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return {
    skills,
    isLoading,
    error,
    fetchSkills,
  };
};
