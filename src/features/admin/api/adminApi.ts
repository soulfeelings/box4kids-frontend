import {
  AdminUser,
  AdminInventoryItem,
  AdminMapping,
  UpdateInventoryRequest,
  AddMappingRequest,
  AdminLoginRequest,
  AdminLoginResponse,
} from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Auth API
export const adminLogin = async (
  credentials: AdminLoginRequest
): Promise<AdminLoginResponse> => {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Ошибка авторизации");
  }

  return response.json();
};

// Admin Delivery Dates API
export const getAllowedDeliveryDates = async (): Promise<string[]> => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/delivery-dates/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Ошибка получения дат доставки");
  const data = await response.json();
  return data.dates ?? [];
};

export const addAllowedDeliveryDate = async (dateIso: string): Promise<string[]> => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/delivery-dates/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ date: dateIso }),
  });
  if (!response.ok) throw new Error("Ошибка добавления даты доставки");
  const data = await response.json();
  return data.dates ?? [];
};

export const removeAllowedDeliveryDate = async (dateIso: string): Promise<string[]> => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/delivery-dates/${dateIso}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Ошибка удаления даты доставки");
  const data = await response.json();
  return data.dates ?? [];
};



// Admin Delivery Times API
export interface AllowedDeliveryTimesResponse {
  ranges: string[];
  hours: string[];
}

export const getAllowedDeliveryTimes = async (): Promise<AllowedDeliveryTimesResponse> => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/delivery-times/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Ошибка получения времени доставки");
  const data = await response.json();
  return {
    ranges: data?.ranges ?? [],
    hours: data?.hours ?? [],
  };
};

export const addAllowedDeliveryTimeRange = async (range: string): Promise<AllowedDeliveryTimesResponse> => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/delivery-times/range`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ range }),
  });
  if (!response.ok) throw new Error("Ошибка добавления интервала времени");
  const data = await response.json();
  return {
    ranges: data?.ranges ?? [],
    hours: data?.hours ?? [],
  };
};

export const removeAllowedDeliveryTimeRange = async (range: string): Promise<AllowedDeliveryTimesResponse> => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/delivery-times/range/${encodeURIComponent(range)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Ошибка удаления интервала времени");
  const data = await response.json();
  return {
    ranges: data?.ranges ?? [],
    hours: data?.hours ?? [],
  };
};

export const addAllowedDeliveryHour = async (hour: string): Promise<AllowedDeliveryTimesResponse> => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/delivery-times/hour`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ hour }),
  });
  if (!response.ok) throw new Error("Ошибка добавления часа доставки");
  const data = await response.json();
  return {
    ranges: data?.ranges ?? [],
    hours: data?.hours ?? [],
  };
};

export const removeAllowedDeliveryHour = async (hour: string): Promise<AllowedDeliveryTimesResponse> => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/delivery-times/hour/${encodeURIComponent(hour)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Ошибка удаления часа доставки");
  const data = await response.json();
  return {
    ranges: data?.ranges ?? [],
    hours: data?.hours ?? [],
  };
};

// Admin Interests API
export const getAllInterests = async (): Promise<
  Array<{ id: number; name: string }>
> => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/interests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Ошибка получения интересов");
  }

  return response.json();
};

// Admin Skills API
export const getAllSkills = async (): Promise<
  Array<{ id: number; name: string }>
> => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/skills`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Ошибка получения навыков");
  }

  return response.json();
};

// Users API
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Ошибка получения пользователей");
  }

  return response.json();
};

export const updateUserRole = async (
  userId: number,
  newRole: string
): Promise<void> => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ new_role: newRole }),
  });

  if (!response.ok) {
    throw new Error("Ошибка обновления роли");
  }
};

export const updateToyBoxStatus = async (
  boxId: number,
  newStatus: string
): Promise<void> => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/toy-boxes/${boxId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ new_status: newStatus }),
  });

  if (!response.ok) {
    throw new Error("Ошибка обновления статуса набора");
  }
};

export const getUserToyBoxes = async (userId: number) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/users/${userId}/toy-boxes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Ошибка получения заказов пользователя");
  }
  return response.json();
};

// Inventory API
export const getAdminInventory = async (): Promise<AdminInventoryItem[]> => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  const response = await fetch(`${API_BASE}/admin/inventory`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Ошибка получения остатков");
  }

  return response.json();
};

export const updateInventory = async (
  categoryId: number,
  data: UpdateInventoryRequest
): Promise<void> => {
  const token = localStorage.getItem("adminToken");
  const response = await fetch(`${API_BASE}/admin/inventory/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Ошибка обновления остатков");
  }
};

// Mappings API
export const getAdminMappings = async (): Promise<AdminMapping[]> => {
  const token = localStorage.getItem("adminToken");
  const response = await fetch(`${API_BASE}/admin/category-mappings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Ошибка получения маппингов");
  }

  return response.json();
};

export const addInterestToCategory = async (
  categoryId: number,
  data: AddMappingRequest
): Promise<void> => {
  const token = localStorage.getItem("adminToken");
  const response = await fetch(
    `${API_BASE}/admin/category-mappings/${categoryId}/interests`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Ошибка добавления интереса");
  }
};

export const addSkillToCategory = async (
  categoryId: number,
  data: AddMappingRequest
): Promise<void> => {
  const token = localStorage.getItem("adminToken");
  const response = await fetch(
    `${API_BASE}/admin/category-mappings/${categoryId}/skills`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Ошибка добавления навыка");
  }
};

export const removeInterestFromCategory = async (
  categoryId: number,
  interestId: number
): Promise<void> => {
  const token = localStorage.getItem("adminToken");
  const response = await fetch(
    `${API_BASE}/admin/category-mappings/${categoryId}/interests/${interestId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Ошибка удаления интереса");
  }
};

export const removeSkillFromCategory = async (
  categoryId: number,
  skillId: number
): Promise<void> => {
  const token = localStorage.getItem("adminToken");
  const response = await fetch(
    `${API_BASE}/admin/category-mappings/${categoryId}/skills/${skillId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Ошибка удаления навыка");
  }
};
