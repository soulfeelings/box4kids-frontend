import { useRegistrationStore } from "../store/registrationStore";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { AUTH_STEPS } from "../constants/auth";
import {
  InterestsListResponse,
  SkillsListResponse,
  SubscriptionPlansListResponse,
} from "../types/api";

// Базовый URL для API
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Хук для работы с API авторизации
export const useAuthApi = () => {
  const navigate = useNavigate();
  const {
    setLoading,
    setError,
    setPhoneData,
    setRegisterData,
    setChildData,
    setCategoriesData,
    setSubscriptionData,
    setDeliveryData,
    setPaymentData,
    setUserId,
    phoneData,
    registerData,
    childData,
    categoriesData,
    subscriptionData,
    deliveryData,
    paymentData,
  } = useRegistrationStore();

  // Базовый API запрос
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Получить код для dev режима
  const getDevCode = async (phoneNumber: string): Promise<string | null> => {
    try {
      const response = await apiRequest(
        `/auth/dev-get-code?phone=${phoneNumber}`
      );
      return response.code;
    } catch (error) {
      console.error("Dev code error:", error);
      return null;
    }
  };

  // Отправить код подтверждения
  const sendCode = async (phone: string) => {
    try {
      await apiRequest("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone_number: phone }),
      });

      setPhoneData({ phone });
      navigate(ROUTES.AUTH.CODE);
    } catch (error) {
      console.error("Send code error:", error);
    }
  };

  // Проверить код
  const verifyCode = async (code: string) => {
    try {
      const response = await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          phone_number: phoneData.phone,
          otp: code,
        }),
      });

      setPhoneData({ code, verified: true });

      // Если пользователь уже существует - переходим в приложение
      if (response.user) {
        setUserId(response.user.id);
        navigate(ROUTES.APP.ROOT);
      } else {
        // Новый пользователь - продолжаем регистрацию
        navigate(ROUTES.AUTH.WELCOME);
      }
    } catch (error) {
      console.error("Verify code error:", error);
    }
  };

  // Повторно отправить код
  const resendCode = async () => {
    await sendCode(phoneData.phone);
  };

  // Создать пользователя
  const createUser = async (name: string) => {
    try {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          phone_number: phoneData.phone,
          name,
        }),
      });

      setRegisterData({ name });
      setUserId(response.user.id);
      navigate(ROUTES.AUTH.CHILD);
    } catch (error) {
      console.error("Create user error:", error);
    }
  };

  // Создать ребенка
  const createChild = async () => {
    try {
      const response = await apiRequest("/children", {
        method: "POST",
        body: JSON.stringify({
          name: childData.name,
          birth_date: childData.birthDate,
          gender: childData.gender,
          health_limitations: childData.limitations,
          parent_comment: childData.comment,
        }),
      });

      setChildData({ ...childData });
      navigate(ROUTES.AUTH.CATEGORIES);
    } catch (error) {
      console.error("Create child error:", error);
    }
  };

  // Загрузка списка интересов
  const loadInterests = async (): Promise<InterestsListResponse | null> => {
    try {
      const response = await apiRequest("/interests");
      return response as InterestsListResponse;
    } catch (error) {
      console.error("Load interests error:", error);
      return null;
    }
  };

  // Загрузка списка навыков
  const loadSkills = async (): Promise<SkillsListResponse | null> => {
    try {
      const response = await apiRequest("/skills");
      return response as SkillsListResponse;
    } catch (error) {
      console.error("Load skills error:", error);
      return null;
    }
  };

  // Загрузка планов подписки
  const loadSubscriptionPlans =
    async (): Promise<SubscriptionPlansListResponse | null> => {
      try {
        const response = await apiRequest("/subscriptions/plans");
        return response as SubscriptionPlansListResponse;
      } catch (error) {
        console.error("Load subscription plans error:", error);
        return null;
      }
    };

  // Обновить интересы и навыки ребенка
  const updateChildCategories = async (
    childId: number,
    interestIds: number[],
    skillIds: number[]
  ) => {
    try {
      await apiRequest(`/children/${childId}/categories`, {
        method: "PUT",
        body: JSON.stringify({
          interest_ids: interestIds,
          skill_ids: skillIds,
        }),
      });

      setCategoriesData({ interestIds, skillIds });
      navigate(ROUTES.AUTH.SUBSCRIPTION);
    } catch (error) {
      console.error("Update categories error:", error);
    }
  };

  // Создать подписку
  const createSubscription = async (childId: number, planId: number) => {
    try {
      const response = await apiRequest("/subscriptions", {
        method: "POST",
        body: JSON.stringify({
          child_id: childId,
          plan_id: planId,
        }),
      });

      setSubscriptionData({
        subscriptionId: response.subscription.id,
        plan: response.plan.name === "Базовый" ? "base" : "premium",
      });
      navigate(ROUTES.AUTH.DELIVERY);
    } catch (error) {
      console.error("Create subscription error:", error);
    }
  };

  // Создать адрес доставки
  const createDeliveryAddress = async () => {
    try {
      const response = await apiRequest("/delivery-info", {
        method: "POST",
        body: JSON.stringify({
          address: deliveryData.address,
          delivery_date: deliveryData.date,
          delivery_time: deliveryData.time,
          courier_comment: deliveryData.comment,
        }),
      });

      // @ts-ignore
      setDeliveryData({ ...deliveryData, deliveryId: response.delivery.id });
      navigate(ROUTES.AUTH.PAYMENT);
    } catch (error) {
      console.error("Create delivery error:", error);
    }
  };

  // Создать платеж
  const createPayment = async (subscriptionIds: number[]) => {
    try {
      const response = await apiRequest("/payments/create-batch", {
        method: "POST",
        body: JSON.stringify({
          subscription_ids: subscriptionIds,
        }),
      });

      setPaymentData({
        paymentId: response.payment.id,
        // @ts-ignore
        amount: response.payment.amount,
        paymentUrl: response.payment.confirmation_url,
      });
    } catch (error) {
      console.error("Create payment error:", error);
    }
  };

  // Обработать платеж
  const processPayment = async (paymentId: number) => {
    try {
      await apiRequest(`/payments/${paymentId}/process`, {
        method: "POST",
      });

      navigate(ROUTES.AUTH.SUCCESS);
    } catch (error) {
      console.error("Process payment error:", error);
    }
  };

  return {
    apiRequest,
    getDevCode,
    sendCode,
    verifyCode,
    resendCode,
    createUser,
    createChild,
    loadInterests,
    loadSkills,
    loadSubscriptionPlans,
    updateChildCategories,
    createSubscription,
    createDeliveryAddress,
    createPayment,
    processPayment,
  };
};
