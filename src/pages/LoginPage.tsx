import React, { useState, useEffect } from "react";
import { UserData } from "../types";

// Step enums for clarity
enum Step {
  Phone = 0,
  Code = 1,
  Welcome = 2,
  Register = 3,
  Child = 4,
  Categories = 5,
  Subscription = 6,
  Delivery = 7,
  Payment = 8,
  Success = 9,
}

// API types
interface UserResponse {
  id: number;
  phone_number: string;
  name: string | null;
  role: string;
}

interface InterestResponse {
  id: number;
  name: string;
}

interface SkillResponse {
  id: number;
  name: string;
}

interface InterestsListResponse {
  interests: InterestResponse[];
}

interface SkillsListResponse {
  skills: SkillResponse[];
}

interface ChildResponse {
  id: number;
  name: string;
  date_of_birth: string;
  gender: "male" | "female";
  has_limitations: boolean;
  comment: string | null;
  parent_id: number;
  interests: InterestResponse[];
  skills: SkillResponse[];
  age: number;
}

interface ToyCategoryConfigResponse {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  quantity: number;
}

interface SubscriptionPlanResponse {
  id: number;
  name: string;
  price_monthly: number;
  toy_count: number;
  description: string | null;
  toy_configurations: ToyCategoryConfigResponse[];
}

interface SubscriptionPlansListResponse {
  plans: SubscriptionPlanResponse[];
}

interface SubscriptionCreateRequest {
  child_id: number;
  plan_id: number;
  delivery_info_id?: number;
}

interface SubscriptionCreateResponse {
  subscription_id: number;
  payment_id: number | null;
  status: string;
  individual_price: number;
  message: string;
}

interface DeliveryInfoCreate {
  name: string;
  address: string;
  delivery_time_preference?: string;
  courier_comment?: string;
}

interface DeliveryInfoResponse {
  id: number;
  name: string;
  address: string;
  delivery_time_preference: string | null;
  courier_comment: string | null;
  user_id: number;
  created_at: string;
}

interface BatchPaymentCreateRequest {
  subscription_ids: number[];
}

interface BatchPaymentResponse {
  payment_id: number;
  external_payment_id: string;
  payment_url: string;
  amount: number;
  currency: string;
  subscription_count: number;
  message: string;
}

interface PaymentProcessResponse {
  status: "success" | "failed";
  message: string;
}

interface LoginPageProps {
  onNavigateToKidsPage: (data: UserData) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToKidsPage,
}) => {
  const [step, setStep] = useState<Step>(Step.Phone);

  // Helper function to calculate age from birth date
  const calculateAge = (birthDate: string): string => {
    const birth = parseDateFromFormat(birthDate);
    if (!birth) return "";

    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      const remainingMonths = months % 12;
      return remainingMonths > 0
        ? `${years} г. ${remainingMonths} мес.`
        : `${years} г.`;
    } else {
      return `${months} мес.`;
    }
  };

  // Helper functions for date formatting
  const formatDateForDelivery = (date: string): string => {
    // Convert from DD.MM to display format
    return date;
  };

  const formatDateForBirth = (date: string): string => {
    // Convert from DD.MM.YYYY to display format
    return date;
  };

  const parseDateFromFormat = (dateString: string): Date | null => {
    if (!dateString) return null;

    // Handle DD.MM.YYYY format
    if (dateString.includes(".")) {
      const parts = dateString.split(".");
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }

    // Handle DD/MM/YYYY format (fallback for existing data)
    if (dateString.includes("/")) {
      const parts = dateString.split("/");
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }

    // Handle YYYY-MM-DD format (fallback for existing data)
    if (dateString.includes("-")) {
      return new Date(dateString);
    }

    return null;
  };

  const formatDateInput = (
    value: string,
    isFullDate: boolean = true
  ): string => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");

    if (isFullDate) {
      // Format as DD.MM.YYYY
      if (digits.length <= 2) {
        return digits;
      } else if (digits.length <= 4) {
        return `${digits.slice(0, 2)}.${digits.slice(2)}`;
      } else {
        return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(
          4,
          8
        )}`;
      }
    } else {
      // Format as DD.MM
      if (digits.length <= 2) {
        return digits;
      } else {
        return `${digits.slice(0, 2)}.${digits.slice(2, 4)}`;
      }
    }
  };

  // Tag component for interests and skills
  const Tag: React.FC<{ children: React.ReactNode; selected?: boolean }> = ({
    children,
    selected = false,
  }) => (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
        selected ? "text-gray-700" : "bg-gray-100 text-gray-700"
      }`}
      style={{
        fontFamily: "Nunito, sans-serif",
        backgroundColor: selected ? "#F2F2F2" : undefined,
      }}
    >
      {children}
    </span>
  );

  // Get plan items based on subscription type from API data
  const getPlanItems = (subscription: "base" | "premium" | "") => {
    if (!subscription) return [];
    const plan = getPlanByType(subscription);
    if (!plan) return [];

    return plan.toy_configurations.map((config) => ({
      icon: config.icon || "🎯",
      count: config.quantity,
      name: config.name,
      color: "#A4B9ED", // Default color, can be enhanced later
    }));
  };

  // Interest icons mapping
  const interestIcons: Record<string, string> = {
    Конструкторы: "🧱",
    Плюшевые: "🧸",
    Ролевые: "🎭",
    Развивающие: "🧠",
    Техника: "⚙️",
    Творчество: "🎨",
  };

  // Skills icons mapping
  const skillIcons: Record<string, string> = {
    Моторика: "✋",
    Логика: "🧩",
    Воображение: "💭",
    Творчество: "🎨",
    Речь: "🗣",
  };

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [resendTimer, setResendTimer] = useState(0);
  const [welcomeIndex, setWelcomeIndex] = useState(0); // 0, 1, 2

  // API states
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    phone: string;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  // Reference data states
  const [availableInterests, setAvailableInterests] = useState<
    InterestResponse[]
  >([]);
  const [availableSkills, setAvailableSkills] = useState<SkillResponse[]>([]);
  const [isLoadingReferenceData, setIsLoadingReferenceData] = useState(false);

  // Subscription plans states
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlanResponse[]
  >([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  // Current child states for API
  const [currentChildId, setCurrentChildId] = useState<number | null>(null);

  // Subscription tracking - map child IDs to their subscription IDs
  const [childSubscriptions, setChildSubscriptions] = useState<
    Map<number, { subscriptionId: number; planId: number }>
  >(new Map());

  // Delivery address data
  const [deliveryAddressData, setDeliveryAddressData] =
    useState<DeliveryInfoResponse | null>(null);

  // Payment processing state
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState<number | null>(null);

  // Child data states
  const [childName, setChildName] = useState("");
  const [childBirthDate, setChildBirthDate] = useState("");
  const [childGender, setChildGender] = useState<"male" | "female" | "">("");
  const [childLimitations, setChildLimitations] = useState<
    "none" | "has_limitations" | ""
  >("");
  const [childComment, setChildComment] = useState("");

  // Categories data states
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Subscription data states
  const [selectedSubscription, setSelectedSubscription] = useState<
    "base" | "premium" | ""
  >("");

  // Delivery data states
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryComments, setDeliveryComments] = useState("");

  // Children management
  const [children, setChildren] = useState<
    Array<{
      id: number;
      name: string;
      birthDate: string;
      gender: "male" | "female";
      limitations: "none" | "has_limitations";
      comment: string;
      interests: string[];
      skills: string[];
      subscription: "base" | "premium" | "";
    }>
  >([]);

  // Edit mode states
  const [editingChildId, setEditingChildId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<"data" | "subscription" | null>(
    null
  );

  // Birth date validation helper
  const validateBirthDate = (dateString: string) => {
    if (!dateString) return { isValid: false, error: "Введите дату рождения" };

    // Check if format is correct DD.MM.YYYY
    const datePattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = dateString.match(datePattern);

    if (!match) {
      return { isValid: false, error: "Формат: ДД.ММ.ГГГГ" };
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    // Validate day, month ranges
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return { isValid: false, error: "Некорректная дата" };
    }

    const birthDate = parseDateFromFormat(dateString);
    if (!birthDate || isNaN(birthDate.getTime())) {
      return { isValid: false, error: "Введите корректную дату" };
    }

    const today = new Date();
    const sixMonthsAgo = new Date();
    const eighteenYearsAgo = new Date();

    sixMonthsAgo.setMonth(today.getMonth() - 6);
    eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

    if (birthDate > today) {
      return { isValid: false, error: "Дата рождения не может быть в будущем" };
    }

    if (birthDate < eighteenYearsAgo) {
      return { isValid: false, error: "Ребенок не может быть старше 18 лет" };
    }

    if (birthDate > sixMonthsAgo) {
      return { isValid: false, error: "Ребенок должен быть старше 6 месяцев" };
    }

    return { isValid: true, error: "" };
  };

  // API helper function
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  };

  // Dev helper: Get OTP code for development
  const getDevCode = async (phoneNumber: string): Promise<string | null> => {
    try {
      const response = await apiRequest(`/auth/dev-get-code`, {
        method: "POST",
        body: JSON.stringify({ phone_number: phoneNumber }),
      });
      return response.code || null;
    } catch (error) {
      console.error("Failed to get dev code:", error);
      return null;
    }
  };

  // Load reference data (interests and skills)
  const loadReferenceData = async () => {
    if (availableInterests.length > 0 && availableSkills.length > 0) {
      return; // Already loaded
    }

    setIsLoadingReferenceData(true);
    try {
      const [interestsResponse, skillsResponse] = await Promise.all([
        apiRequest("/interests/"),
        apiRequest("/skills/"),
      ]);

      setAvailableInterests(interestsResponse.interests);
      setAvailableSkills(skillsResponse.skills);
    } catch (error) {
      console.error("Failed to load reference data:", error);
      setError("Не удалось загрузить данные");
    } finally {
      setIsLoadingReferenceData(false);
    }
  };

  // Create child via API
  const createChild = async () => {
    if (!currentUser) {
      setError("Пользователь не найден");
      return null;
    }

    try {
      const response = await apiRequest(
        `/children/?parent_id=${currentUser.id}`,
        {
          method: "POST",
          body: JSON.stringify({
            name: childName,
            date_of_birth: childBirthDate.split(".").reverse().join("-"), // Convert DD.MM.YYYY to YYYY-MM-DD
            gender: childGender,
            has_limitations: childLimitations === "has_limitations",
            comment: childComment.trim() || null,
          }),
        }
      );

      setCurrentChildId(response.id);
      return response;
    } catch (error) {
      console.error("Failed to create child:", error);
      throw error;
    }
  };

  // Update child with interests and skills
  const updateChildWithCategories = async (
    childId: number,
    interestIds: number[],
    skillIds: number[]
  ) => {
    try {
      const response = await apiRequest(`/children/${childId}`, {
        method: "PUT",
        body: JSON.stringify({
          interest_ids: interestIds,
          skill_ids: skillIds,
        }),
      });

      return response;
    } catch (error) {
      console.error("Failed to update child categories:", error);
      throw error;
    }
  };

  // Update child basic data only (name, birth date, gender, limitations, comment)
  const updateChildBasicData = async (childId: number) => {
    try {
      const response = await apiRequest(`/children/${childId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: childName,
          date_of_birth: childBirthDate.split(".").reverse().join("-"), // Convert DD.MM.YYYY to YYYY-MM-DD
          gender: childGender,
          has_limitations: childLimitations === "has_limitations",
          comment: childComment.trim() || null,
        }),
      });

      return response;
    } catch (error) {
      console.error("Failed to update child basic data:", error);
      throw error;
    }
  };

  // Full update child with all data
  const updateChildFull = async (childId: number) => {
    try {
      // Map selected interests/skills names to IDs
      const selectedInterestIds = selectedInterests
        .map((interestName) => {
          const interest = availableInterests.find((i) =>
            i.name.includes(interestName)
          );
          return interest?.id;
        })
        .filter((id) => id !== undefined) as number[];

      const selectedSkillIds = selectedSkills
        .map((skillName) => {
          const skill = availableSkills.find((s) => s.name.includes(skillName));
          return skill?.id;
        })
        .filter((id) => id !== undefined) as number[];

      const response = await apiRequest(`/children/${childId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: childName,
          date_of_birth: childBirthDate.split(".").reverse().join("-"), // Convert DD.MM.YYYY to YYYY-MM-DD
          gender: childGender,
          has_limitations: childLimitations === "has_limitations",
          comment: childComment.trim() || null,
          interest_ids: selectedInterestIds,
          skill_ids: selectedSkillIds,
        }),
      });

      return response;
    } catch (error) {
      console.error("Failed to update child:", error);
      throw error;
    }
  };

  // Load subscription plans
  const loadSubscriptionPlans = async () => {
    if (subscriptionPlans.length > 0) {
      return; // Already loaded
    }

    setIsLoadingPlans(true);
    try {
      const response: SubscriptionPlansListResponse = await apiRequest(
        "/subscription-plans/"
      );
      setSubscriptionPlans(response.plans);
    } catch (error) {
      console.error("Failed to load subscription plans:", error);
      setError("Не удалось загрузить планы подписки");
    } finally {
      setIsLoadingPlans(false);
    }
  };

  // Create subscription for child
  const createSubscription = async (childId: number, planId: number) => {
    try {
      const request: SubscriptionCreateRequest = {
        child_id: childId,
        plan_id: planId,
      };

      const response: SubscriptionCreateResponse = await apiRequest(
        "/subscriptions/",
        {
          method: "POST",
          body: JSON.stringify(request),
        }
      );

      // Track the subscription
      setChildSubscriptions((prev) => {
        const newMap = new Map(prev);
        newMap.set(childId, {
          subscriptionId: response.subscription_id,
          planId,
        });
        return newMap;
      });

      return response;
    } catch (error) {
      console.error("Failed to create subscription:", error);
      throw error;
    }
  };

  // Create delivery address via API
  const createDeliveryAddress = async () => {
    if (!currentUser) {
      setError("Пользователь не найден");
      return null;
    }

    try {
      const response: DeliveryInfoResponse = await apiRequest(
        `/delivery-addresses/?user_id=${currentUser.id}`,
        {
          method: "POST",
          body: JSON.stringify({
            name: "Основной адрес",
            address: deliveryAddress,
            delivery_time_preference: deliveryTime || null,
            courier_comment: deliveryComments || null,
          }),
        }
      );

      setDeliveryAddressData(response);
      return response;
    } catch (error) {
      console.error("Failed to create delivery address:", error);
      throw error;
    }
  };

  // Create batch payment via API
  const createBatchPayment = async (subscriptionIds: number[]) => {
    try {
      const response: BatchPaymentResponse = await apiRequest(
        "/payments/create-batch",
        {
          method: "POST",
          body: JSON.stringify({
            subscription_ids: subscriptionIds,
          }),
        }
      );

      return response;
    } catch (error) {
      console.error("Failed to create batch payment:", error);
      if (
        error instanceof Error &&
        error.message.includes("уже привязана к платежу")
      ) {
        setError("Подписка уже привязана к платежу");
        return null;
      }
      throw error;
    }
  };

  // Delete child via API
  const deleteChild = async (childId: number) => {
    try {
      await apiRequest(`/children/${childId}`, {
        method: "DELETE",
      });
      return true;
    } catch (error) {
      console.error("Failed to delete child:", error);
      throw error;
    }
  };

  // Process payment via API
  const processPayment = async (paymentId: number) => {
    try {
      const response: PaymentProcessResponse = await apiRequest(
        `/payments/${paymentId}/process`,
        {
          method: "POST",
        }
      );

      return response;
    } catch (error) {
      console.error("Failed to process payment:", error);
      throw error;
    }
  };

  // Map subscription plan names to our UI types
  const mapPlanNameToType = (planName: string): "base" | "premium" => {
    return planName.toLowerCase().includes("премиум") ||
      planName.toLowerCase().includes("premium")
      ? "premium"
      : "base";
  };

  // Get plan by name type
  const getPlanByType = (
    type: "base" | "premium"
  ): SubscriptionPlanResponse | undefined => {
    return subscriptionPlans.find(
      (plan) => mapPlanNameToType(plan.name) === type
    );
  };

  // Сброс таймера при переходе на шаг кода
  useEffect(() => {
    if (step === Step.Code) {
      setResendTimer(60);
    }
  }, [step]);

  // Тикание таймера
  useEffect(() => {
    if (step === Step.Code && resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, resendTimer]);

  // Send OTP code
  const handleSendCode = async () => {
    setError(null);

    if (phone.length < 7) {
      setError("Введите корректный номер телефона");
      return;
    }

    setIsLoading(true);

    try {
      await apiRequest("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone_number: phone }),
      });

      setStep(Step.Code);

      // DEV MODE: Start auto-fill immediately after successful send
      setIsAutoFilling(true);
      setTimeout(async () => {
        try {
          const devCode = await getDevCode(phone);
          if (devCode) {
            setCode(devCode);
          }
        } catch (error) {
          console.error("Dev code auto-fill failed:", error);
        } finally {
          setIsAutoFilling(false);
        }
      }, 2000);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Не удалось отправить код"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP code
  const handleCheckCode = async () => {
    setError(null);

    if (code.length !== 4) {
      setError("Введите 4-значный код");
      return;
    }

    setIsLoading(true);

    try {
      const userResponse: UserResponse = await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          phone_number: phone,
          code: code,
        }),
      });

      // Save user data
      setCurrentUser({
        id: userResponse.id,
        phone: userResponse.phone_number,
        name: userResponse.name || "",
      });

      // Set name if user already has one
      if (userResponse.name) {
        setName(userResponse.name);
      }

      // Check if new user (no name)
      if (!userResponse.name) {
        setWelcomeIndex(0);
        setStep(Step.Welcome);
      } else {
        setStep(Step.Success);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Неверный код");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    setError(null);
    setCode("");

    setIsLoading(true);

    try {
      await apiRequest("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone_number: phone }),
      });

      setResendTimer(60);

      // DEV MODE: Start auto-fill immediately after successful resend
      setIsAutoFilling(true);
      setTimeout(async () => {
        try {
          const devCode = await getDevCode(phone);
          if (devCode) {
            setCode(devCode);
            alert(`🛠️ DEV MODE: Код автоматически заполнен: ${devCode}`);
          }
        } catch (error) {
          console.error("Dev code auto-fill failed:", error);
        } finally {
          setIsAutoFilling(false);
        }
      }, 2000);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Не удалось отправить код"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-verify code when it's 4 digits (removed for real API)
  // React.useEffect(() => {
  //   if (code.length === 4) {
  //     handleCheckCode();
  //   }
  // }, [code]);

  // Update user profile with name
  const handleRegister = async () => {
    setError(null);

    if (!name.trim()) {
      setError("Введите имя");
      return;
    }

    if (!currentUser) {
      setError("Ошибка: пользователь не найден");
      return;
    }

    setIsLoading(true);

    try {
      await apiRequest(`/users/profile/${currentUser.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: name.trim() }),
      });

      // Update local user data
      setCurrentUser({
        ...currentUser,
        name: name.trim(),
      });

      setStep(Step.Child);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Не удалось сохранить имя"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle child data submission
  const handleChildSubmit = async () => {
    setError(null);
    if (!childName.trim()) {
      setError("Введите имя ребенка");
      return;
    }

    const birthDateValidation = validateBirthDate(childBirthDate);
    if (!birthDateValidation.isValid) {
      setError(birthDateValidation.error);
      return;
    }

    if (!childGender) {
      setError("Выберите пол ребенка");
      return;
    }
    if (!childLimitations) {
      setError("Выберите особенности ребенка");
      return;
    }
    if (childLimitations === "has_limitations" && !childComment.trim()) {
      setError("Напишите ограничения ребенка");
      return;
    }

    // If editing, update basic data and go to categories to edit interests and skills
    if (editingChildId && editMode === "data") {
      setIsLoading(true);
      try {
        // Update child basic data via API
        const childIdToUpdate = children.find(
          (child) => child.id === editingChildId
        )?.id;
        if (childIdToUpdate) {
          await updateChildBasicData(childIdToUpdate);
        }

        // Update local state with basic data
        setChildren((prev) =>
          prev.map((child) =>
            child.id === editingChildId
              ? {
                  ...child,
                  name: childName,
                  birthDate: childBirthDate,
                  gender: childGender as "male" | "female",
                  limitations: childLimitations as "none" | "has_limitations",
                  comment: childComment,
                }
              : child
          )
        );

        // Load reference data and go to categories
        await loadReferenceData();
        setStep(Step.Categories);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Не удалось обновить данные ребенка"
        );
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    try {
      // Create child via API
      const childResponse = await createChild();
      if (childResponse) {
        // Load reference data and go to categories
        await loadReferenceData();
        setStep(Step.Categories);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Не удалось создать ребенка"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle categories submission
  const handleCategoriesSubmit = async () => {
    setError(null);
    if (selectedInterests.length === 0) {
      setError("Выберите хотя бы один интерес");
      return;
    }
    if (selectedSkills.length === 0) {
      setError("Выберите хотя бы один навык для развития");
      return;
    }

    // Map selected interests/skills names to IDs
    const selectedInterestIds = selectedInterests
      .map((interestName) => {
        const interest = availableInterests.find((i) =>
          i.name.includes(interestName)
        );
        return interest?.id;
      })
      .filter((id) => id !== undefined) as number[];

    const selectedSkillIds = selectedSkills
      .map((skillName) => {
        const skill = availableSkills.find((s) => s.name.includes(skillName));
        return skill?.id;
      })
      .filter((id) => id !== undefined) as number[];

    if (selectedInterestIds.length === 0 || selectedSkillIds.length === 0) {
      setError("Не удалось найти соответствующие интересы или навыки");
      return;
    }

    // If editing, update existing child and return to subscription view
    if (editingChildId && editMode === "data") {
      setIsLoading(true);
      try {
        // Update child interests and skills via API
        const childIdToUpdate = children.find(
          (child) => child.id === editingChildId
        )?.id;
        if (childIdToUpdate) {
          await updateChildWithCategories(
            childIdToUpdate,
            selectedInterestIds,
            selectedSkillIds
          );
        }

        // Update local state with interests and skills
        setChildren((prev) =>
          prev.map((child) =>
            child.id === editingChildId
              ? {
                  ...child,
                  interests: selectedInterests,
                  skills: selectedSkills,
                }
              : child
          )
        );

        // Reset edit mode and return to subscription view
        setEditingChildId(null);
        setEditMode(null);
        setStep(Step.Subscription);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Не удалось обновить интересы и навыки ребенка"
        );
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // For new child, update via API
    if (currentChildId) {
      setIsLoading(true);
      try {
        await updateChildWithCategories(
          currentChildId,
          selectedInterestIds,
          selectedSkillIds
        );

        // Save current child data (for new child)
        const currentChild = {
          id: currentChildId,
          name: childName,
          birthDate: childBirthDate,
          gender: childGender as "male" | "female",
          limitations: childLimitations as "none" | "has_limitations",
          comment: childComment,
          interests: selectedInterests,
          skills: selectedSkills,
          subscription: "" as "base" | "premium" | "",
        };

        setChildren((prev) => [...prev, currentChild]);

        // Load subscription plans and go to subscription step
        await loadSubscriptionPlans();
        setStep(Step.Subscription);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Не удалось сохранить интересы и навыки"
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Ошибка: ребенок не был создан");
    }
  };

  // Handle subscription submission
  const handleSubscriptionSubmit = async () => {
    setError(null);

    // Check if we're in children overview with all subscriptions set and user wants to proceed
    const allChildrenHaveSubscriptions = children.every(
      (child) => child.subscription !== ""
    );
    const isInOverviewMode =
      children.length > 0 && allChildrenHaveSubscriptions && !editingChildId;

    // If we're in overview mode and all have subscriptions, proceed to delivery
    if (isInOverviewMode) {
      setStep(Step.Delivery);
      return;
    }

    // Otherwise, validate subscription selection for single child or edit mode
    if (!selectedSubscription) {
      setError("Выберите тариф");
      return;
    }

    setIsLoading(true);
    try {
      const selectedPlan = getPlanByType(selectedSubscription);
      if (!selectedPlan) {
        setError("Выбранный план не найден");
        return;
      }

      // If editing subscription, update specific child
      if (editingChildId && editMode === "subscription") {
        const child = children.find((c) => c.id === editingChildId);
        if (child) {
          await createSubscription(child.id, selectedPlan.id);
        }

        setChildren((prev) =>
          prev.map((child) =>
            child.id === editingChildId
              ? { ...child, subscription: selectedSubscription }
              : child
          )
        );

        // Reset edit mode and stay on subscription view
        setEditingChildId(null);
        setEditMode(null);
        return;
      }

      // Create subscription for new child
      if (currentChildId) {
        await createSubscription(currentChildId, selectedPlan.id);

        // Update current child with subscription (for new child creation)
        setChildren((prev) => {
          const lastChild = prev[prev.length - 1];
          return prev.map((child) =>
            child.id === lastChild?.id
              ? { ...child, subscription: selectedSubscription }
              : child
          );
        });

        // Clear form data
        setChildName("");
        setChildBirthDate("");
        setChildGender("");
        setChildLimitations("");
        setChildComment("");
        setSelectedInterests([]);
        setSelectedSkills([]);
        setSelectedSubscription("");
        setCurrentChildId(null);

        // After adding subscription, always stay on subscription step to show overview
        // User can add more children or proceed to delivery
      } else {
        setError("Ребенок не найден");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Не удалось создать подписку"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delivery submission
  const handleDeliverySubmit = async () => {
    setError(null);
    if (!deliveryAddress.trim()) {
      setError("Введите адрес доставки");
      return;
    }
    if (!deliveryDate) {
      setError("Выберите дату доставки");
      return;
    }
    if (!deliveryTime) {
      setError("Выберите время доставки");
      return;
    }

    setIsLoading(true);

    try {
      // Create delivery address via API
      const deliveryResponse = await createDeliveryAddress();
      if (!deliveryResponse) {
        setError("Не удалось создать адрес доставки");
        return;
      }

      setStep(Step.Payment);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Не удалось создать адрес доставки"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Collect all subscription IDs from childSubscriptions
      const subscriptionIds = Array.from(childSubscriptions.values()).map(
        (sub) => sub.subscriptionId
      );

      if (subscriptionIds.length === 0) {
        setError("Нет подписок для оплаты");
        return;
      }

      // Create batch payment
      const paymentResponse = await createBatchPayment(subscriptionIds);
      if (!paymentResponse) {
        setError("Не удалось создать платеж");
        return;
      }
      setPaymentId(paymentResponse.payment_id);

      // Start payment processing
      setPaymentProcessing(true);
      setIsLoading(false); // Stop general loading, show payment processing

      // Process the payment (this will take 5-15 seconds)
      const processResponse = await processPayment(paymentResponse.payment_id);

      if (processResponse.status === "success") {
        setStep(Step.Success);
      } else {
        setError(processResponse.message || "Платеж не прошел");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Не удалось создать платеж"
      );
    } finally {
      setIsLoading(false);
      setPaymentProcessing(false);
    }
  };

  // Handle success completion and navigate to kids interface
  const handleSuccessComplete = () => {
    // Prepare user data to pass to kids interface
    const userData: UserData = {
      name,
      phone,
      children,
      deliveryAddress,
      deliveryDate,
      deliveryTime,
      subscriptionStatus: "just_subscribed",
      nextSetStatus: "not_determined",
      subscriptionDate: new Date().toISOString(),
    };
    onNavigateToKidsPage(userData);
  };

  // Handle adding another child
  const handleAddChild = () => {
    // Reset form for new child
    setChildName("");
    setChildBirthDate("");
    setChildGender("");
    setChildLimitations("");
    setChildComment("");
    setSelectedInterests([]);
    setSelectedSkills([]);
    setSelectedSubscription("");
    setEditingChildId(null);
    setEditMode(null);
    setStep(Step.Child);
  };

  // Handle editing child data
  const handleEditChildData = (childId: number) => {
    const child = children.find((c) => c.id === childId);
    if (child) {
      // Pre-fill form with child data
      setChildName(child.name);
      setChildBirthDate(child.birthDate);
      setChildGender(child.gender);
      setChildLimitations(child.limitations);
      setChildComment(child.comment);
      setSelectedInterests(child.interests);
      setSelectedSkills(child.skills);
      setSelectedSubscription(child.subscription);

      // Set edit mode
      setEditingChildId(childId);
      setEditMode("data");
      setStep(Step.Child);
    }
  };

  // Handle editing child subscription
  const handleEditChildSubscription = async (childId: number) => {
    const child = children.find((c) => c.id === childId);
    if (child) {
      // Load subscription plans first
      await loadSubscriptionPlans();

      // Set current subscription selection
      setSelectedSubscription(child.subscription);

      // Set edit mode
      setEditingChildId(childId);
      setEditMode("subscription");
      setStep(Step.Subscription);
    }
  };

  // Step navigation
  const handleBack = () => {
    setError(null);

    // If in edit mode, return to subscription view and reset edit mode
    if (
      editingChildId &&
      (editMode === "data" || editMode === "subscription")
    ) {
      setEditingChildId(null);
      setEditMode(null);
      setStep(Step.Subscription);
      return;
    }

    if (step === Step.Code) setStep(Step.Phone);
    else if (step === Step.Register) setStep(Step.Code);
    else if (step === Step.Child) setStep(Step.Register);
    else if (step === Step.Categories) setStep(Step.Child);
    else if (step === Step.Subscription) setStep(Step.Categories);
    else if (step === Step.Delivery) setStep(Step.Subscription);
    else if (step === Step.Payment) setStep(Step.Delivery);
    else if (step === Step.Success) setStep(Step.Phone);
  };

  const welcomeScreens = [
    {
      img: "/illustrations/welcome1.png",
      title: "Игрушки, которые радуют!",
      desc: "Настройте персональную коробку с игрушками для вашего ребенка.",
    },
    {
      img: "/illustrations/welcome2.png",
      title: "Чисто и безопасно!",
      desc: "Каждая игрушка проходит полную дезинфекцию перед доставкой. Всё безопасно даже для малышей.",
    },
    {
      img: "/illustrations/welcome3.png",
      title: "Всё просто и без стресса!",
      desc: "Новый набор — каждые 2 недели. Любимые игрушки можно оставить.",
    },
  ];

  // UI for each step
  const renderStep = () => {
    switch (step) {
      case Step.Phone:
        const isPhoneValid = phone.length >= 10;
        return (
          <div
            className="flex flex-col gap-4"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {/* Title and Description */}
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-xl font-medium text-gray-900">
                Войдите или зарегистрируйтесь
              </h1>
              <p className="text-base font-medium text-gray-600">
                Введите номер телефона и мы отправим код подтверждения
              </p>
            </div>

            {/* Spacer */}
            <div className="h-4"></div>

            {/* Phone Input */}
            <div className="flex flex-col gap-1">
              <div
                className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
                  phone
                    ? "border-[#7782F5]"
                    : "border-gray-200 focus-within:border-[#7782F5]"
                }`}
              >
                <input
                  type="tel"
                  className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
                  placeholder="+998"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/[^\d+]/g, ""))
                  }
                  maxLength={17}
                  inputMode="tel"
                  autoFocus
                  style={{ fontFamily: "Nunito, sans-serif" }}
                />
              </div>
            </div>

            {/* Send Code Button */}
            <button
              onClick={handleSendCode}
              disabled={!isPhoneValid || isLoading}
              className={`w-full py-4 rounded-full font-medium text-base transition-all ${
                isPhoneValid && !isLoading
                  ? "text-white hover:opacity-80"
                  : "bg-gray-200 text-gray-500"
              }`}
              style={{
                fontFamily: "Nunito, sans-serif",
                backgroundColor:
                  isPhoneValid && !isLoading ? "#747EEC" : undefined,
              }}
            >
              {isLoading ? "Отправляем..." : "Получить код"}
            </button>

            {/* Spacer */}
            <div className="h-8"></div>

            {/* Legal Text */}
            <p className="text-sm font-medium text-gray-500 text-center leading-relaxed">
              Нажимая кнопку «Получить код», вы принимаете условия Политики
              конфиденциальности и Пользовательского соглашения.
            </p>
          </div>
        );
      case Step.Code:
        const isCodeValid = code.length === 4;
        return (
          <div
            className="flex flex-col gap-4"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {/* Title and Description */}
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-xl font-medium text-gray-900">
                Подтвердите номер
              </h1>
              <p className="text-base font-medium text-gray-500">
                Мы отправили код подтверждения на номер {phone}
              </p>
              <button
                onClick={handleBack}
                disabled={isLoading}
                className={`text-base font-medium transition-colors ${
                  isLoading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-indigo-600 hover:text-indigo-700"
                }`}
              >
                Изменить номер
              </button>
            </div>

            {/* Spacer */}
            <div className="h-4"></div>

            {/* Dev Mode Auto-fill Indicator */}
            {isAutoFilling && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
                  <p
                    className="text-sm font-medium text-yellow-700"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    🛠️ DEV MODE: Получаем код автоматически...
                  </p>
                </div>
              </div>
            )}

            {/* Code Input */}
            <div className="flex flex-col gap-1">
              <div
                className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
                  error
                    ? "border-red-400"
                    : code
                    ? "border-[#7782F5]"
                    : "border-gray-200 focus-within:border-[#7782F5]"
                }`}
              >
                <input
                  type="text"
                  className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 text-center tracking-widest"
                  placeholder="••••"
                  value={code}
                  onChange={(e) => {
                    setError(null);
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 4));
                  }}
                  maxLength={4}
                  inputMode="numeric"
                  autoFocus
                  style={{ fontFamily: "Nunito, sans-serif" }}
                />
              </div>
              {error && (
                <p
                  className="text-red-500 text-sm font-medium px-3"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {error}
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleCheckCode}
              disabled={!isCodeValid || isLoading || isAutoFilling}
              className={`w-full py-4 rounded-full font-medium text-base transition-all ${
                isCodeValid && !isLoading && !isAutoFilling
                  ? "text-white hover:opacity-80"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              style={{
                fontFamily: "Nunito, sans-serif",
                backgroundColor:
                  isCodeValid && !isLoading && !isAutoFilling
                    ? "#747EEC"
                    : undefined,
              }}
            >
              {isLoading
                ? "Проверяем..."
                : isAutoFilling
                ? "Получаем код..."
                : "Подтвердить"}
            </button>

            {/* Resend Timer */}
            <button
              onClick={resendTimer > 0 ? undefined : handleResendCode}
              disabled={resendTimer > 0 || isLoading || isAutoFilling}
              className={`w-full py-4 font-medium text-base transition-all ${
                resendTimer > 0 || isLoading || isAutoFilling
                  ? "text-gray-500 cursor-not-allowed bg-transparent"
                  : "text-indigo-600 hover:text-indigo-700 bg-transparent"
              }`}
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              {isLoading
                ? "Отправляем..."
                : isAutoFilling
                ? "Получаем код..."
                : resendTimer > 0
                ? `Получить новый код через ${resendTimer} ${
                    resendTimer === 1
                      ? "секунду"
                      : resendTimer < 5
                      ? "секунды"
                      : "секунд"
                  }`
                : "Отправить код повторно"}
            </button>
          </div>
        );
      case Step.Welcome:
        const w = welcomeScreens[welcomeIndex];
        return (
          <div
            className="fixed inset-0 w-full h-full flex flex-col"
            style={{
              background: "linear-gradient(180deg, #747EEC 0%, #9098F0 100%)",
            }}
          >
            {/* Header with company name and close button */}
            <div className="flex justify-center items-center px-4 py-4 relative z-10">
              <h1
                className="text-white font-semibold text-base"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                BOX4BABY
              </h1>
              <button
                // onClick={() => setStep(Step.Phone)}
                className="absolute right-4 w-6 h-6 rounded-lg bg-white flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
                style={{ color: "#6667C4" }}
              >
                ×
              </button>
            </div>

            {/* Illustration area - takes remaining space above bottom container */}
            <div
              className="relative flex-1 overflow-hidden"
              style={{ height: "calc(100vh - 33.33vh - 4rem)" }}
            >
              <img
                src={w.img}
                alt="welcome"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>

            {/* Bottom container with text and button - fixed at 1/3 of screen */}
            <div
              className="bg-[#747EEC] px-4 py-6 flex flex-col justify-center"
              style={{ height: "33.33vh", minHeight: "280px" }}
            >
              <h2
                className="font-bold text-2xl mb-4 text-white text-center"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                {w.title}
              </h2>
              <p
                className="text-base text-white/90 text-center mb-6 max-w-sm mx-auto"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                {w.desc}
              </p>

              <div className="px-4">
                <button
                  onClick={() => {
                    if (welcomeIndex < welcomeScreens.length - 1) {
                      setWelcomeIndex(welcomeIndex + 1);
                    } else {
                      setStep(Step.Register);
                    }
                  }}
                  className="w-full bg-white text-[#747EEC] py-4 rounded-[32px] font-semibold text-base"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  {welcomeIndex < welcomeScreens.length - 1
                    ? "Далее"
                    : "Начать"}
                </button>
              </div>
            </div>
          </div>
        );
      case Step.Register:
        return (
          <div className="flex flex-col min-h-screen bg-white">
            {/* Header with step indicator */}
            <div className="flex items-center justify-between px-4 py-2 h-16">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <span
                className="text-gray-700 font-semibold text-base"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Шаг 1/6
              </span>

              <button
                onClick={() => setStep(Step.Phone)}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col px-4">
              {/* Title */}
              <div className="text-center mt-4 mb-6">
                <h1
                  className="text-xl font-medium text-gray-900 mb-0"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Давайте познакомимся!
                </h1>
              </div>

              {/* Input section */}
              <div className="flex flex-col gap-1">
                <label
                  className="text-sm font-medium text-gray-600 px-3"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Как к вам обращаться?
                </label>
                <div
                  className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
                    name
                      ? "border-[#7782F5]"
                      : "border-gray-200 focus-within:border-[#7782F5]"
                  }`}
                >
                  <input
                    className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
                    placeholder=""
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={32}
                    autoFocus
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  />
                </div>
              </div>

              <div className="flex-1"></div>
            </div>

            {/* Bottom action button */}
            <div className="px-4 pb-6">
              <button
                className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
                  name.trim() && !isLoading
                    ? "text-white shadow-sm"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!name.trim() || isLoading}
                onClick={handleRegister}
                style={{
                  fontFamily: "Nunito, sans-serif",
                  backgroundColor:
                    name.trim() && !isLoading ? "#30313D" : undefined,
                }}
              >
                {isLoading ? "Сохраняем..." : "Продолжить"}
              </button>
            </div>
          </div>
        );
      case Step.Child:
        const birthDateValidation = validateBirthDate(childBirthDate);
        const isFormValid =
          childName.trim() &&
          birthDateValidation.isValid &&
          childGender &&
          childLimitations &&
          (childLimitations === "none" ||
            (childLimitations === "has_limitations" && childComment.trim()));

        return (
          <div className="flex flex-col min-h-screen bg-white">
            {/* Header with step indicator */}
            <div className="flex items-center justify-between px-4 py-2 h-16">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <span
                className="text-gray-700 font-semibold text-base"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Шаг 2/6
              </span>

              <button
                onClick={() => setStep(Step.Phone)}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col px-4 pb-24 overflow-y-auto">
              {/* Title */}
              <div className="text-center mt-4 mb-6">
                <h1
                  className="text-xl font-medium text-gray-900"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {editingChildId && editMode === "data"
                    ? "Редактирование данных ребёнка"
                    : "Кому собираем набор?"}
                </h1>
              </div>

              <div className="space-y-6">
                {/* Child Name */}
                <div className="flex flex-col gap-1">
                  <label
                    className="text-sm font-medium text-gray-600 px-3"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Имя ребенка
                  </label>
                  <div
                    className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
                      childName
                        ? "border-[#7782F5]"
                        : "border-gray-200 focus-within:border-[#7782F5]"
                    }`}
                  >
                    <input
                      className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
                      placeholder=""
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      maxLength={32}
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    />
                  </div>
                </div>

                {/* Birth Date */}
                <div className="flex flex-col gap-1">
                  <label
                    className="text-sm font-medium text-gray-600 px-3"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Дата рождения
                  </label>
                  <div
                    className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
                      childBirthDate && !birthDateValidation.isValid
                        ? "border-red-400"
                        : childBirthDate && birthDateValidation.isValid
                        ? "border-green-400"
                        : childBirthDate
                        ? "border-[#7782F5]"
                        : "border-gray-200 focus-within:border-[#7782F5]"
                    }`}
                  >
                    <input
                      type="text"
                      className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
                      placeholder=""
                      value={childBirthDate}
                      onChange={(e) => {
                        const formatted = formatDateInput(e.target.value, true);
                        setChildBirthDate(formatted);
                      }}
                      maxLength={10}
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    />
                  </div>
                  {childBirthDate && !birthDateValidation.isValid && (
                    <p
                      className="text-sm text-red-400 px-3"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {birthDateValidation.error}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold text-gray-900"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Пол ребенка
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setChildGender("male")}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        childGender === "male"
                          ? "bg-indigo-400 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      Мужской
                    </button>
                    <button
                      onClick={() => setChildGender("female")}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        childGender === "female"
                          ? "bg-indigo-400 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      Женский
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold text-gray-900"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Особенности
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setChildLimitations("none")}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        childLimitations === "none"
                          ? "bg-indigo-400 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      Нет
                    </button>
                    <button
                      onClick={() => setChildLimitations("has_limitations")}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        childLimitations === "has_limitations"
                          ? "bg-indigo-400 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      Есть ограничения
                    </button>
                  </div>
                </div>

                {/* Comment */}
                <div className="flex flex-col gap-1">
                  <label
                    className="text-sm font-medium text-gray-600 px-3"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Комментарий
                  </label>
                  <div
                    className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
                      childLimitations === "has_limitations" &&
                      !childComment.trim()
                        ? "border-red-400"
                        : childComment
                        ? "border-[#7782F5]"
                        : "border-gray-200 focus-within:border-[#7782F5]"
                    }`}
                  >
                    <textarea
                      className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 resize-none"
                      placeholder={
                        childLimitations === "has_limitations"
                          ? "Опишите ограничения ребенка..."
                          : "Дополнительная информация о ребенке..."
                      }
                      value={childComment}
                      onChange={(e) => setChildComment(e.target.value)}
                      rows={3}
                      maxLength={200}
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    />
                  </div>
                  {childLimitations === "has_limitations" &&
                    !childComment.trim() && (
                      <p
                        className="text-sm text-red-400 px-3"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        Напишите ограничения ребенка
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
              <button
                className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
                  isFormValid && !isLoading
                    ? "text-white shadow-sm"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!isFormValid || isLoading}
                onClick={handleChildSubmit}
                style={{
                  fontFamily: "Nunito, sans-serif",
                  backgroundColor:
                    isFormValid && !isLoading ? "#30313D" : undefined,
                }}
              >
                {isLoading
                  ? "Сохраняем..."
                  : editingChildId && editMode === "data"
                  ? "Сохранить изменения"
                  : "Продолжить"}
              </button>
            </div>
          </div>
        );
      case Step.Categories:
        // Map API interests to UI format
        const interestItems = availableInterests.map((interest) => {
          // Extract emoji and label from API response like "🧱 Конструкторы"
          const match = interest.name.match(/^(\S+)\s+(.+)$/);
          if (match) {
            return { emoji: match[1], label: match[2], id: interest.id };
          }
          return { emoji: "🎯", label: interest.name, id: interest.id };
        });

        const skillItems = availableSkills.map((skill) => {
          // Extract emoji and label from API response like "✋ Моторика"
          const match = skill.name.match(/^(\S+)\s+(.+)$/);
          if (match) {
            return { emoji: match[1], label: match[2], id: skill.id };
          }
          return { emoji: "⭐", label: skill.name, id: skill.id };
        });

        const toggleInterest = (interest: string) => {
          setSelectedInterests((prev) =>
            prev.includes(interest)
              ? prev.filter((i) => i !== interest)
              : [...prev, interest]
          );
        };

        const toggleSkill = (skill: string) => {
          setSelectedSkills((prev) =>
            prev.includes(skill)
              ? prev.filter((s) => s !== skill)
              : [...prev, skill]
          );
        };

        const isCategoriesFormValid =
          selectedInterests.length > 0 &&
          selectedSkills.length > 0 &&
          !isLoadingReferenceData;

        return (
          <div className="flex flex-col min-h-screen bg-white">
            {/* Header with step indicator */}
            <div className="flex items-center justify-between px-4 py-2 h-16">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <span
                className="text-sm font-medium text-gray-600"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Шаг 3/6
              </span>

              <button
                onClick={() => setStep(Step.Phone)}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col px-4 pb-24 overflow-y-auto">
              {/* Title */}
              <div className="text-center mt-4 mb-6">
                <h1
                  className="text-xl font-medium text-gray-900"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {editingChildId && editMode === "data"
                    ? `Редактирование интересов и навыков`
                    : "Что интересно вашему ребёнку?"}
                </h1>
              </div>

              <div className="space-y-8">
                {/* Loading indicator */}
                {isLoadingReferenceData && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                      <span
                        className="text-gray-600 font-medium"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        Загружаем интересы и навыки...
                      </span>
                    </div>
                  </div>
                )}

                {/* Interests */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold text-gray-900"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Интересы
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {interestItems.map((interest) => (
                      <button
                        key={interest.label}
                        onClick={() => toggleInterest(interest.label)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                          selectedInterests.includes(interest.label)
                            ? "bg-indigo-400 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        style={{ fontFamily: "Nunito, sans-serif" }}
                        disabled={isLoading || isLoadingReferenceData}
                      >
                        <span className="text-base">{interest.emoji}</span>
                        <span>{interest.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold text-gray-900"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Навыки для развития
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {skillItems.map((skill) => (
                      <button
                        key={skill.label}
                        onClick={() => toggleSkill(skill.label)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                          selectedSkills.includes(skill.label)
                            ? "bg-indigo-400 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        style={{ fontFamily: "Nunito, sans-serif" }}
                        disabled={isLoading || isLoadingReferenceData}
                      >
                        <span className="text-base">{skill.emoji}</span>
                        <span>{skill.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
              <button
                className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
                  isCategoriesFormValid && !isLoading
                    ? "text-white shadow-sm"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!isCategoriesFormValid || isLoading}
                onClick={handleCategoriesSubmit}
                style={{
                  fontFamily: "Nunito, sans-serif",
                  backgroundColor:
                    isCategoriesFormValid && !isLoading ? "#30313D" : undefined,
                }}
              >
                {isLoading
                  ? "Сохраняем..."
                  : editingChildId && editMode === "data"
                  ? "Сохранить изменения"
                  : "Продолжить"}
              </button>
            </div>
          </div>
        );
      case Step.Subscription:
        const currentChild = children[children.length - 1];
        const hasMultipleChildren = children.length > 1;
        const allChildrenHaveSubscriptions = children.every(
          (child) => child.subscription !== ""
        );
        const isSubscriptionValid = selectedSubscription !== "";
        const shouldShowOverview =
          children.length > 0 &&
          allChildrenHaveSubscriptions &&
          !editingChildId;

        return (
          <div
            className="flex flex-col min-h-screen"
            style={{
              backgroundColor:
                hasMultipleChildren &&
                !editingChildId &&
                allChildrenHaveSubscriptions
                  ? "#F2F2F2"
                  : "white",
            }}
          >
            {/* Header with step indicator */}
            <div className="flex items-center justify-between px-4 py-2 h-16 bg-white">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <span
                className="text-sm font-medium text-gray-600"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Шаг 4/6
              </span>

              <button
                onClick={() => setStep(Step.Phone)}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col px-4 pb-24 overflow-y-auto">
              {/* Title */}
              <div className="text-center mt-4 mb-6">
                <h1
                  className="text-xl font-medium text-gray-900"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {editingChildId && editMode === "subscription"
                    ? `Изменение тарифа для ${
                        children.find((c) => c.id === editingChildId)?.name
                      }`
                    : shouldShowOverview
                    ? `Проверьте составы набора Ваших детей`
                    : `Какой набор подойдёт ${
                        currentChild?.name || "ребёнку"
                      }?`}
                </h1>
              </div>

              <div className="space-y-4">
                {/* Info Alert */}
                <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                  <p
                    className="text-sm font-medium text-indigo-700 text-center"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Мы подбираем игрушки вручную, с учётом интересов. Хотите
                    поменять состав набора? Просто обновите интересы ребёнка
                  </p>
                </div>

                {shouldShowOverview ? (
                  // Multiple children view
                  <div className="space-y-6">
                    {children.map((child, index) => {
                      const planItems = getPlanItems(child.subscription);
                      return (
                        <div
                          key={child.id}
                          className="bg-white rounded-3xl border border-gray-100 shadow-sm"
                        >
                          {/* Header */}
                          <div className="flex items-center gap-3 p-6 border-b border-gray-100">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-2xl">
                                {child.gender === "male" ? "👦🏻" : "👩🏻"}
                              </span>
                            </div>
                            <div>
                              <h1
                                className="font-semibold text-gray-900"
                                style={{ fontFamily: "Nunito, sans-serif" }}
                              >
                                {child.name}, {calculateAge(child.birthDate)}
                              </h1>
                            </div>
                          </div>

                          <div className="p-6 space-y-6">
                            {/* Интересы */}
                            <div>
                              <h2
                                className="text-lg font-semibold text-gray-900 mb-3"
                                style={{ fontFamily: "Nunito, sans-serif" }}
                              >
                                Интересы
                              </h2>
                              <div className="flex flex-wrap gap-2">
                                {child.interests.map((interest, idx) => (
                                  <Tag key={idx} selected={true}>
                                    <span className="mr-1">
                                      {interestIcons[interest] || "🎯"}
                                    </span>
                                    {interest}
                                  </Tag>
                                ))}
                              </div>
                            </div>

                            {/* Навыки для развития */}
                            <div>
                              <h2
                                className="text-lg font-semibold text-gray-900 mb-3"
                                style={{ fontFamily: "Nunito, sans-serif" }}
                              >
                                Навыки для развития
                              </h2>
                              <div className="flex flex-wrap gap-2">
                                {child.skills.map((skill, idx) => (
                                  <Tag key={idx} selected={true}>
                                    <span className="mr-1">
                                      {skillIcons[skill] || "⭐"}
                                    </span>
                                    {skill}
                                  </Tag>
                                ))}
                              </div>
                            </div>

                            {/* Тариф */}
                            <div>
                              <h2
                                className="text-lg font-semibold text-gray-900 mb-3"
                                style={{ fontFamily: "Nunito, sans-serif" }}
                              >
                                Тариф
                              </h2>
                              <div
                                className="bg-gray-50 rounded-xl p-4"
                                style={{ borderRadius: "12px" }}
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <span
                                    className="font-medium text-gray-900"
                                    style={{ fontFamily: "Nunito, sans-serif" }}
                                  >
                                    {child.subscription === "premium"
                                      ? "Премиум"
                                      : "Базовый"}
                                  </span>
                                  <span className="text-gray-500">•</span>
                                  <span
                                    className="text-gray-700"
                                    style={{ fontFamily: "Nunito, sans-serif" }}
                                  >
                                    {child.subscription === "premium"
                                      ? "9"
                                      : "6"}{" "}
                                    игрушек
                                  </span>
                                  <span className="text-gray-500">•</span>
                                  <span
                                    className="text-gray-700"
                                    style={{ fontFamily: "Nunito, sans-serif" }}
                                  >
                                    $
                                    {child.subscription
                                      ? getPlanByType(child.subscription)
                                          ?.price_monthly || 0
                                      : 0}
                                    /мес.
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Состав набора игрушек */}
                            <div>
                              <h3
                                className="text-gray-600 text-sm mb-3"
                                style={{ fontFamily: "Nunito, sans-serif" }}
                              >
                                Состав набора игрушек
                              </h3>
                              <div className="space-y-3">
                                {planItems.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3"
                                  >
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                                        !item.color.startsWith("#")
                                          ? item.color
                                          : ""
                                      }`}
                                      style={{
                                        backgroundColor: item.color.startsWith(
                                          "#"
                                        )
                                          ? item.color
                                          : undefined,
                                      }}
                                    >
                                      {item.icon}
                                    </div>
                                    <span
                                      className="text-gray-700 font-medium"
                                      style={{
                                        fontFamily: "Nunito, sans-serif",
                                      }}
                                    >
                                      x{item.count}
                                    </span>
                                    <span
                                      className="text-gray-800"
                                      style={{
                                        fontFamily: "Nunito, sans-serif",
                                      }}
                                    >
                                      {item.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Кнопки действий */}
                            <div className="space-y-3 pt-4">
                              <button
                                className="w-full py-3 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                                style={{
                                  fontFamily: "Nunito, sans-serif",
                                  borderRadius: "32px",
                                  backgroundColor: "#E3E3E3",
                                }}
                                onClick={() => handleEditChildData(child.id)}
                              >
                                Изменить данные ребёнка
                              </button>
                              <button
                                className="w-full py-3 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                                style={{
                                  fontFamily: "Nunito, sans-serif",
                                  borderRadius: "32px",
                                  backgroundColor: "#E3E3E3",
                                }}
                                onClick={() =>
                                  handleEditChildSubscription(child.id)
                                }
                              >
                                Изменить тариф
                              </button>
                              <button
                                className="w-full py-3 bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors"
                                style={{
                                  fontFamily: "Nunito, sans-serif",
                                  borderRadius: "32px",
                                }}
                                onClick={async () => {
                                  if (
                                    window.confirm(
                                      `Удалить данные ребёнка ${child.name}?`
                                    )
                                  ) {
                                    setIsLoading(true);
                                    try {
                                      await deleteChild(child.id);

                                      // Remove child from subscription tracking
                                      setChildSubscriptions((prev) => {
                                        const newMap = new Map(prev);
                                        newMap.delete(child.id);
                                        return newMap;
                                      });

                                      // Remove child from local state
                                      setChildren((prev) =>
                                        prev.filter((c) => c.id !== child.id)
                                      );
                                    } catch (error) {
                                      setError(
                                        error instanceof Error
                                          ? error.message
                                          : "Не удалось удалить ребенка"
                                      );
                                    } finally {
                                      setIsLoading(false);
                                    }
                                  }
                                }}
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Single child subscription selection or edit mode
                  <div className="space-y-4">
                    {/* Loading plans indicator */}
                    {isLoadingPlans && (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center gap-2">
                          <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                          <span
                            className="text-gray-600 font-medium"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            Загружаем планы подписки...
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Render subscription plans from API */}
                    {subscriptionPlans.map((plan) => {
                      const planType = mapPlanNameToType(plan.name);
                      const isSelected = selectedSubscription === planType;

                      return (
                        <div
                          key={plan.id}
                          className={`rounded-3xl p-6 shadow-sm border transition-all cursor-pointer ${
                            isSelected
                              ? "border-indigo-400"
                              : "border-gray-100 hover:border-gray-300"
                          }`}
                          style={{
                            backgroundColor: "#F2F2F2",
                          }}
                          onClick={() => setSelectedSubscription(planType)}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <h3
                              className="text-lg font-semibold text-gray-900"
                              style={{ fontFamily: "Nunito, sans-serif" }}
                            >
                              {plan.name}
                            </h3>
                            <span className="text-gray-500">•</span>
                            <span
                              className="text-gray-700"
                              style={{ fontFamily: "Nunito, sans-serif" }}
                            >
                              {plan.toy_count} игрушек
                            </span>
                            <span className="text-gray-500">•</span>
                            <div className="text-right">
                              <span
                                className="text-gray-700"
                                style={{ fontFamily: "Nunito, sans-serif" }}
                              >
                                ${plan.price_monthly}/мес.
                              </span>
                            </div>
                          </div>

                          <div className="mb-6">
                            <p
                              className="text-gray-600 text-sm mb-3"
                              style={{ fontFamily: "Nunito, sans-serif" }}
                            >
                              Состав набора игрушек
                            </p>
                            <div className="space-y-3">
                              {plan.toy_configurations.map((config) => (
                                <div
                                  key={config.id}
                                  className="flex items-center gap-3"
                                >
                                  <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                                    style={{ backgroundColor: "#A4B9ED" }}
                                  >
                                    {config.icon || "🎯"}
                                  </div>
                                  <span
                                    className="text-gray-700 font-medium"
                                    style={{ fontFamily: "Nunito, sans-serif" }}
                                  >
                                    x{config.quantity}
                                  </span>
                                  <span
                                    className="text-gray-800"
                                    style={{ fontFamily: "Nunito, sans-serif" }}
                                  >
                                    {config.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            className={`w-full py-3 rounded-xl font-medium transition-colors ${
                              isSelected
                                ? "bg-indigo-400 text-white"
                                : "text-gray-700 hover:opacity-80"
                            }`}
                            style={{
                              fontFamily: "Nunito, sans-serif",
                              backgroundColor: isSelected
                                ? undefined
                                : "#E3E3E3",
                            }}
                            disabled={isLoadingPlans || isLoading}
                          >
                            {isSelected ? "Выбрано" : "Выбрать"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Child Banner */}
                {shouldShowOverview && (
                  <div className="bg-indigo-400 rounded-3xl p-6 text-center">
                    <p
                      className="text-lg font-semibold text-white mb-4"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      Добавьте ещё одного ребёнка и получите скидку 20% на
                      следующий набор
                    </p>
                    <button
                      onClick={handleAddChild}
                      className="bg-white bg-opacity-30 text-white py-3 px-6 rounded-full text-sm font-medium hover:bg-opacity-40 transition-all"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {children.length === 1
                        ? "Добавить ребёнка"
                        : "Добавить ещё ребёнка"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom action button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
              {(() => {
                const isEditingWithoutSubscription =
                  editingChildId &&
                  editMode === "subscription" &&
                  !selectedSubscription;
                const isButtonEnabled =
                  (shouldShowOverview || isSubscriptionValid) &&
                  !isEditingWithoutSubscription &&
                  !isLoadingPlans;

                return (
                  <button
                    className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
                      isButtonEnabled
                        ? "text-white shadow-sm"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    style={{
                      fontFamily: "Nunito, sans-serif",
                      backgroundColor: isButtonEnabled ? "#30313D" : undefined,
                    }}
                    disabled={!isButtonEnabled}
                    onClick={handleSubscriptionSubmit}
                  >
                    {isLoading
                      ? "Создаем подписку..."
                      : isLoadingPlans
                      ? "Загружаем планы..."
                      : editingChildId && editMode === "subscription"
                      ? "Сохранить изменения"
                      : "Перейти к оформлению"}
                  </button>
                );
              })()}
            </div>
          </div>
        );
      case Step.Delivery:
        const timeOptions = [
          { value: "", label: "Выберите время" },
          { value: "9-12", label: "9:00 - 12:00" },
          { value: "12-15", label: "12:00 - 15:00" },
          { value: "15-18", label: "15:00 - 18:00" },
          { value: "18-21", label: "18:00 - 21:00" },
        ];

        // Generate date options for next 14 days
        const generateDateOptions = () => {
          const options = [{ value: "", label: "Выберите дату" }];
          const today = new Date();

          for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();

            const value = `${day}.${month}`;
            const dayOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][
              date.getDay()
            ];
            const monthName = [
              "янв",
              "фев",
              "мар",
              "апр",
              "мая",
              "июн",
              "июл",
              "авг",
              "сен",
              "окт",
              "ноя",
              "дек",
            ][date.getMonth()];

            let label;
            if (i === 0) {
              label = `Сегодня, ${day} ${monthName}`;
            } else if (i === 1) {
              label = `Завтра, ${day} ${monthName}`;
            } else {
              label = `${dayOfWeek}, ${day} ${monthName}`;
            }

            options.push({ value, label });
          }

          return options;
        };

        const dateOptions = generateDateOptions();

        const isDeliveryFormValid =
          deliveryAddress.trim() && deliveryDate && deliveryTime;

        return (
          <div className="flex flex-col min-h-screen bg-white">
            {/* Header with step indicator */}
            <div className="flex items-center justify-between px-4 py-2 h-16 bg-white">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <span
                className="text-sm font-medium text-gray-600"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Шаг 5/6
              </span>

              <button
                onClick={() => setStep(Step.Phone)}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col px-4 pb-24 overflow-y-auto">
              {/* Title */}
              <div className="text-center mt-4 mb-6">
                <h1
                  className="text-xl font-medium text-gray-900"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Куда доставить набор?
                </h1>
              </div>

              <div className="space-y-6">
                {/* Адрес */}
                <div>
                  <label
                    className="block text-gray-600 text-sm mb-3 px-3"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Адрес
                  </label>
                  <div
                    className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all relative ${
                      deliveryAddress
                        ? "border-[#7782F5]"
                        : "border-gray-200 focus-within:border-[#7782F5]"
                    }`}
                  >
                    <input
                      type="text"
                      className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 pr-9"
                      placeholder="Введите адрес доставки"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    />
                    <svg
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Дата доставки */}
                <div>
                  <label
                    className="block text-gray-600 text-sm mb-3 px-3"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Дата доставки
                  </label>
                  <div className="relative">
                    <select
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 appearance-none focus:outline-none focus:border-[#7782F5] pr-12"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {dateOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Время доставки */}
                <div>
                  <label
                    className="block text-gray-600 text-sm mb-3 px-3"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Время доставки
                  </label>
                  <div className="relative">
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 appearance-none focus:outline-none focus:border-[#7782F5] pr-12"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {timeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Комментарий для курьера */}
                <div>
                  <label
                    className="block text-gray-600 text-sm mb-3 px-3"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Комментарий для курьера
                  </label>
                  <div
                    className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
                      deliveryComments
                        ? "border-[#7782F5]"
                        : "border-gray-200 focus-within:border-[#7782F5]"
                    }`}
                  >
                    <textarea
                      className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 resize-none"
                      placeholder="Дополнительная информация для курьера"
                      value={deliveryComments}
                      onChange={(e) => setDeliveryComments(e.target.value)}
                      rows={4}
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
              <button
                className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
                  isDeliveryFormValid && !isLoading
                    ? "text-white shadow-sm"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!isDeliveryFormValid || isLoading}
                onClick={handleDeliverySubmit}
                style={{
                  fontFamily: "Nunito, sans-serif",
                  backgroundColor:
                    isDeliveryFormValid && !isLoading ? "#30313D" : undefined,
                }}
              >
                {isLoading ? "Создаем адрес..." : "Продолжить"}
              </button>
            </div>

            {/* Синий элемент справа */}
            <div className="fixed right-0 top-1/2 transform -translate-y-1/2 w-1 h-24 bg-indigo-400 rounded-l-full"></div>
          </div>
        );
      case Step.Payment:
        // Calculate total for all children
        const totalPrice = children.reduce((sum, child, index) => {
          return (
            sum +
            (child.subscription
              ? getPlanByType(child.subscription)?.price_monthly || 0
              : 0)
          );
        }, 0);

        return (
          <div className="flex flex-col min-h-screen bg-white">
            {/* Header with step indicator */}
            <div className="flex items-center justify-between px-4 py-2 h-16 bg-white">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <span
                className="text-sm font-medium text-gray-600"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Шаг 6/6
              </span>

              <button
                onClick={() => setStep(Step.Phone)}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col px-6 pb-24 overflow-y-auto">
              {/* Title */}
              <div className="pt-6 pb-8">
                <h1
                  className="text-xl font-semibold text-gray-900"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Подтвердите и оплатите подписку
                </h1>
              </div>

              <div className="space-y-6">
                {/* Наборы для детей */}
                {children.map((child, index) => {
                  const planItems = getPlanItems(child.subscription);
                  const price = child.subscription
                    ? getPlanByType(child.subscription)?.price_monthly || 0
                    : 0;

                  return (
                    <div key={child.id} className="bg-gray-100 rounded-xl p-4">
                      <h2
                        className="text-lg font-semibold text-gray-900 mb-3"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        Набор для {child.name}
                      </h2>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span
                            className="text-gray-700"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            Игрушек в наборе
                          </span>
                          <span
                            className="text-gray-900 font-medium"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            {planItems.reduce(
                              (sum, item) => sum + item.count,
                              0
                            )}{" "}
                            шт
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span
                            className="text-gray-700"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            Стоимость
                          </span>
                          <span
                            className="text-gray-900 font-medium"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            ${price} / мес.
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Общая сумма */}
                <div className="mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span
                      className="text-xl font-semibold text-gray-900"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      Общая сумма
                    </span>
                    <span
                      className="text-xl font-bold text-gray-900"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      ${totalPrice} / мес.
                    </span>
                  </div>
                </div>

                {/* Информация об отмене */}
                <div className="mb-8">
                  <p
                    className="text-gray-500 text-sm leading-relaxed"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Можно отменить или поставить подписку на паузу в любое время
                    через приложение
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom section */}
            <div className="px-6 pb-6">
              <button
                className="w-full py-4 text-white rounded-full font-medium text-lg hover:opacity-80 transition-all mb-3"
                onClick={handlePaymentSubmit}
                disabled={isLoading || paymentProcessing}
                style={{
                  fontFamily: "Nunito, sans-serif",
                  backgroundColor:
                    isLoading || paymentProcessing ? "#9ca3af" : "#30313D",
                }}
              >
                {isLoading
                  ? "Создаем платеж..."
                  : paymentProcessing
                  ? "Обрабатываем платеж..."
                  : "Оплатить и активировать"}
              </button>

              {/* Payment processing indicator */}
              {paymentProcessing && (
                <div className="text-center mt-3">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span
                      className="text-sm text-gray-600"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      Обработка может занять до 15 секунд...
                    </span>
                  </div>
                </div>
              )}

              <p
                className="text-center text-gray-500 text-xs leading-relaxed"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Вы будете перенаправлены в платёжный сервис для безопасной
                оплаты
              </p>
            </div>

            {/* Синий элемент справа */}
            <div className="fixed right-0 top-1/2 transform -translate-y-1/2 w-1 h-24 bg-indigo-400 rounded-l-full"></div>
          </div>
        );
      case Step.Success:
        return (
          <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <div className="flex justify-center items-center p-4 relative">
              <span
                className="text-lg font-bold text-gray-900 tracking-wider"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                BOX4BABY
              </span>
              <button
                className="absolute right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={handleSuccessComplete}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Success Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              {/* Success Icon */}
              <div className="mb-8">
                <img
                  src="/illustrations/ok.png"
                  alt="Success"
                  className="w-32 h-32 mx-auto"
                />
              </div>

              {/* Success Message */}
              <h1
                className="text-xl font-semibold text-gray-900 mb-4"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Подписка активирована!
              </h1>

              <p
                className="text-gray-600 leading-relaxed max-w-xs"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Мы уже начали собирать коробку для вашего ребёнка. Вы получите
                уведомление, когда она будет готова к доставке.
              </p>
            </div>

            {/* Bottom Button */}
            <div className="px-6 pb-6">
              <button
                className="w-full py-4 text-white rounded-full font-medium text-lg transition-colors"
                onClick={handleSuccessComplete}
                style={{
                  fontFamily: "Nunito, sans-serif",
                  backgroundColor: "#30313D",
                }}
              >
                Перейти на главную
              </button>
            </div>

            {/* Синий элемент справа */}
            <div className="fixed right-0 top-1/2 transform -translate-y-1/2 w-1 h-24 bg-indigo-400 rounded-l-full"></div>
          </div>
        );
      default:
        return null;
    }
  };

  // Full screen steps that handle their own layout
  if (
    step === Step.Welcome ||
    step === Step.Register ||
    step === Step.Child ||
    step === Step.Categories ||
    step === Step.Subscription ||
    step === Step.Delivery ||
    step === Step.Payment ||
    step === Step.Success
  ) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        {error && (
          <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm mb-2 text-center fixed top-0 left-0 right-0 z-50">
            {error}
          </div>
        )}
        {renderStep()}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header - скрывать на welcome экранах */}
      <div className="flex items-center justify-center px-4 py-3 h-16 relative">
        <span className="font-bold text-lg text-gray-800">BOX4BABY</span>
        <button
          className="absolute right-4 bg-gray-100 rounded-lg p-1"
          onClick={() => setStep(Step.Phone)}
        >
          <span className="sr-only">Закрыть</span>
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#30313D"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
      </div>
      {/* Content */}
      <div className="flex flex-col flex-1 px-4 py-8 gap-4 max-w-md w-full mx-auto">
        {error && (
          <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm mb-2 text-center">
            {error}
          </div>
        )}
        {renderStep()}
      </div>
    </div>
  );
};
