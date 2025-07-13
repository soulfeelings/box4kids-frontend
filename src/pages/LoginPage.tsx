// import React, { useState, useEffect } from "react";
// import { UserData } from "../types";
// import { PhoneStep } from "../components/auth/PhoneStep";
// import { CodeStep } from "../components/auth/CodeStep";
// import { WelcomeStep } from "../components/auth/WelcomeStep";
// import { RegisterStep } from "../components/auth/RegisterStep";
// import { ChildStep } from "../components/auth/ChildStep";
// import { CategoriesStep } from "../components/auth/CategoriesStep";
// import { SubscriptionStep } from "../components/auth/SubscriptionStep";
// import {
//   UserResponse,
//   InterestResponse,
//   SkillResponse,
//   InterestsListResponse,
//   SkillsListResponse,
//   ChildResponse,
//   ToyCategoryConfigResponse,
//   SubscriptionPlanResponse,
//   SubscriptionPlansListResponse,
//   SubscriptionCreateRequest,
//   SubscriptionCreateResponse,
//   DeliveryInfoCreate,
//   DeliveryInfoResponse,
//   BatchPaymentCreateRequest,
//   BatchPaymentResponse,
//   PaymentProcessResponse,
// } from "../types/api";
// import { DeliveryStep } from "../components/auth/DeliveryStep";
// import { PaymentStep } from "../components/auth/PaymentStep";
// import { SuccessStep } from "../components/auth/SuccessStep";

// // Step enums for clarity
// enum Step {
//   Phone = 0,
//   Code = 1,
//   Welcome = 2,
//   Register = 3,
//   Child = 4,
//   Categories = 5,
//   Subscription = 6,
//   Delivery = 7,
//   Payment = 8,
//   Success = 9,
// }

// // API types moved to ../types/api.ts

// interface LoginPageProps {
//   onNavigateToKidsPage: (data: UserData, userId?: number) => void;
// }

// export const LoginPage: React.FC<LoginPageProps> = ({
//   onNavigateToKidsPage,
// }) => {
//   const [step, setStep] = useState<Step>(Step.Phone);

//   // Helper function to calculate age from birth date
//   const calculateAge = (birthDate: string): string => {
//     const birth = parseDateFromFormat(birthDate);
//     if (!birth) return "";

//     const today = new Date();
//     const diffTime = Math.abs(today.getTime() - birth.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     const months = Math.floor(diffDays / 30);
//     const years = Math.floor(months / 12);

//     if (years > 0) {
//       const remainingMonths = months % 12;
//       return remainingMonths > 0
//         ? `${years} г. ${remainingMonths} мес.`
//         : `${years} г.`;
//     } else {
//       return `${months} мес.`;
//     }
//   };

//   // Helper functions for date formatting
//   const formatDateForDelivery = (date: string): string => {
//     // Convert from DD.MM to display format
//     return date;
//   };

//   const formatDateForBirth = (date: string): string => {
//     // Convert from DD.MM.YYYY to display format
//     return date;
//   };

//   const parseDateFromFormat = (dateString: string): Date | null => {
//     if (!dateString) return null;

//     // Handle DD.MM.YYYY format
//     if (dateString.includes(".")) {
//       const parts = dateString.split(".");
//       if (parts.length === 3) {
//         const day = parseInt(parts[0], 10);
//         const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
//         const year = parseInt(parts[2], 10);
//         return new Date(year, month, day);
//       }
//     }

//     // Handle DD/MM/YYYY format (fallback for existing data)
//     if (dateString.includes("/")) {
//       const parts = dateString.split("/");
//       if (parts.length === 3) {
//         const day = parseInt(parts[0], 10);
//         const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
//         const year = parseInt(parts[2], 10);
//         return new Date(year, month, day);
//       }
//     }

//     // Handle YYYY-MM-DD format (fallback for existing data)
//     if (dateString.includes("-")) {
//       return new Date(dateString);
//     }

//     return null;
//   };

//   const formatDateInput = (
//     value: string,
//     isFullDate: boolean = true
//   ): string => {
//     // Remove non-digits
//     const digits = value.replace(/\D/g, "");

//     if (isFullDate) {
//       // Format as DD.MM.YYYY
//       if (digits.length <= 2) {
//         return digits;
//       } else if (digits.length <= 4) {
//         return `${digits.slice(0, 2)}.${digits.slice(2)}`;
//       } else {
//         return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(
//           4,
//           8
//         )}`;
//       }
//     } else {
//       // Format as DD.MM
//       if (digits.length <= 2) {
//         return digits;
//       } else {
//         return `${digits.slice(0, 2)}.${digits.slice(2, 4)}`;
//       }
//     }
//   };

//   // Tag component for interests and skills
//   const Tag: React.FC<{ children: React.ReactNode; selected?: boolean }> = ({
//     children,
//     selected = false,
//   }) => (
//     <span
//       className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
//         selected ? "text-gray-700" : "bg-gray-100 text-gray-700"
//       }`}
//       style={{
//         fontFamily: "Nunito, sans-serif",
//         backgroundColor: selected ? "#F2F2F2" : undefined,
//       }}
//     >
//       {children}
//     </span>
//   );

//   // Get plan items based on subscription type from API data
//   const getPlanItems = (subscription: "base" | "premium" | "") => {
//     if (!subscription) return [];
//     const plan = getPlanByType(subscription);
//     if (!plan) return [];

//     return plan.toy_configurations.map((config) => ({
//       icon: config.icon || "🎯",
//       count: config.quantity,
//       name: config.name,
//       color: "#A4B9ED", // Default color, can be enhanced later
//     }));
//   };

//   // Interest icons mapping
//   const interestIcons: Record<string, string> = {
//     Конструкторы: "🧱",
//     Плюшевые: "🧸",
//     Ролевые: "🎭",
//     Развивающие: "🧠",
//     Техника: "⚙️",
//     Творчество: "🎨",
//   };

//   // Skills icons mapping
//   const skillIcons: Record<string, string> = {
//     Моторика: "✋",
//     Логика: "🧩",
//     Воображение: "💭",
//     Творчество: "🎨",
//     Речь: "🗣",
//   };

//   const [phone, setPhone] = useState("");
//   const [code, setCode] = useState("");
//   const [name, setName] = useState("");
//   const [error, setError] = useState<string | null>(null);

//   const [resendTimer, setResendTimer] = useState(0);
//   const [welcomeIndex, setWelcomeIndex] = useState(0); // 0, 1, 2

//   // API states
//   const [currentUser, setCurrentUser] = useState<{
//     id: number;
//     phone: string;
//     name: string;
//   } | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isAutoFilling, setIsAutoFilling] = useState(false);

//   // Reference data states
//   const [availableInterests, setAvailableInterests] = useState<
//     InterestResponse[]
//   >([]);
//   const [availableSkills, setAvailableSkills] = useState<SkillResponse[]>([]);
//   const [isLoadingReferenceData, setIsLoadingReferenceData] = useState(false);

//   // Subscription plans states
//   const [subscriptionPlans, setSubscriptionPlans] = useState<
//     SubscriptionPlanResponse[]
//   >([]);
//   const [isLoadingPlans, setIsLoadingPlans] = useState(false);

//   // Current child states for API
//   const [currentChildId, setCurrentChildId] = useState<number | null>(null);

//   // Subscription tracking - map child IDs to their subscription IDs
//   const [childSubscriptions, setChildSubscriptions] = useState<
//     Map<number, { subscriptionId: number; planId: number }>
//   >(new Map());

//   // Delivery address data
//   const [deliveryAddressData, setDeliveryAddressData] =
//     useState<DeliveryInfoResponse | null>(null);

//   // Payment processing state
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
//   const [paymentId, setPaymentId] = useState<number | null>(null);

//   // Child data states
//   const [childName, setChildName] = useState("");
//   const [childBirthDate, setChildBirthDate] = useState("");
//   const [childGender, setChildGender] = useState<"male" | "female" | "">("");
//   const [childLimitations, setChildLimitations] = useState<
//     "none" | "has_limitations" | ""
//   >("");
//   const [childComment, setChildComment] = useState("");

//   // Categories data states
//   const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
//   const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

//   // Subscription data states
//   const [selectedSubscription, setSelectedSubscription] = useState<
//     "base" | "premium" | ""
//   >("");

//   // Delivery data states
//   const [deliveryAddress, setDeliveryAddress] = useState("");
//   const [deliveryDate, setDeliveryDate] = useState("");
//   const [deliveryTime, setDeliveryTime] = useState("");
//   const [deliveryComments, setDeliveryComments] = useState("");

//   // Children management
//   const [children, setChildren] = useState<
//     Array<{
//       id: number;
//       name: string;
//       birthDate: string;
//       gender: "male" | "female";
//       limitations: "none" | "has_limitations";
//       comment: string;
//       interests: string[];
//       skills: string[];
//       subscription: "base" | "premium" | "";
//     }>
//   >([]);

//   // Edit mode states
//   const [editingChildId, setEditingChildId] = useState<number | null>(null);
//   const [editMode, setEditMode] = useState<"data" | "subscription" | null>(
//     null
//   );

//   // Birth date validation helper
//   const validateBirthDate = (dateString: string) => {
//     if (!dateString) return { isValid: false, error: "Введите дату рождения" };

//     // Check if format is correct DD.MM.YYYY
//     const datePattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;
//     const match = dateString.match(datePattern);

//     if (!match) {
//       return { isValid: false, error: "Формат: ДД.ММ.ГГГГ" };
//     }

//     const day = parseInt(match[1], 10);
//     const month = parseInt(match[2], 10);
//     const year = parseInt(match[3], 10);

//     // Validate day, month ranges
//     if (day < 1 || day > 31 || month < 1 || month > 12) {
//       return { isValid: false, error: "Некорректная дата" };
//     }

//     const birthDate = parseDateFromFormat(dateString);
//     if (!birthDate || isNaN(birthDate.getTime())) {
//       return { isValid: false, error: "Введите корректную дату" };
//     }

//     const today = new Date();
//     const sixMonthsAgo = new Date();
//     const eighteenYearsAgo = new Date();

//     sixMonthsAgo.setMonth(today.getMonth() - 6);
//     eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

//     if (birthDate > today) {
//       return { isValid: false, error: "Дата рождения не может быть в будущем" };
//     }

//     if (birthDate < eighteenYearsAgo) {
//       return { isValid: false, error: "Ребенок не может быть старше 18 лет" };
//     }

//     if (birthDate > sixMonthsAgo) {
//       return { isValid: false, error: "Ребенок должен быть старше 6 месяцев" };
//     }

//     return { isValid: true, error: "" };
//   };

//   // API helper function
//   const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
//     const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
//     try {
//       const response = await fetch(`${API_URL}${endpoint}`, {
//         headers: { "Content-Type": "application/json" },
//         ...options,
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.detail || `API Error: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error(`API request failed: ${endpoint}`, error);
//       throw error;
//     }
//   };

//   // Dev helper: Get OTP code for development
//   const getDevCode = async (phoneNumber: string): Promise<string | null> => {
//     try {
//       const response = await apiRequest(`/auth/dev-get-code`, {
//         method: "POST",
//         body: JSON.stringify({ phone_number: phoneNumber }),
//       });
//       return response.code || null;
//     } catch (error) {
//       console.error("Failed to get dev code:", error);
//       return null;
//     }
//   };

//   // Load reference data (interests and skills)
//   const loadReferenceData = async () => {
//     if (availableInterests.length > 0 && availableSkills.length > 0) {
//       return; // Already loaded
//     }

//     setIsLoadingReferenceData(true);
//     try {
//       const [interestsResponse, skillsResponse] = await Promise.all([
//         apiRequest("/interests/"),
//         apiRequest("/skills/"),
//       ]);

//       setAvailableInterests(interestsResponse.interests);
//       setAvailableSkills(skillsResponse.skills);
//     } catch (error) {
//       console.error("Failed to load reference data:", error);
//       setError("Не удалось загрузить данные");
//     } finally {
//       setIsLoadingReferenceData(false);
//     }
//   };

//   // Create child via API
//   const createChild = async () => {
//     if (!currentUser) {
//       setError("Пользователь не найден");
//       return null;
//     }

//     try {
//       const response = await apiRequest(
//         `/children/?parent_id=${currentUser.id}`,
//         {
//           method: "POST",
//           body: JSON.stringify({
//             name: childName,
//             date_of_birth: childBirthDate.split(".").reverse().join("-"), // Convert DD.MM.YYYY to YYYY-MM-DD
//             gender: childGender,
//             has_limitations: childLimitations === "has_limitations",
//             comment: childComment.trim() || null,
//           }),
//         }
//       );

//       setCurrentChildId(response.id);
//       return response;
//     } catch (error) {
//       console.error("Failed to create child:", error);
//       throw error;
//     }
//   };

//   // Update child with interests and skills
//   const updateChildWithCategories = async (
//     childId: number,
//     interestIds: number[],
//     skillIds: number[]
//   ) => {
//     try {
//       const response = await apiRequest(`/children/${childId}`, {
//         method: "PUT",
//         body: JSON.stringify({
//           interest_ids: interestIds,
//           skill_ids: skillIds,
//         }),
//       });

//       return response;
//     } catch (error) {
//       console.error("Failed to update child categories:", error);
//       throw error;
//     }
//   };

//   // Update child basic data only (name, birth date, gender, limitations, comment)
//   const updateChildBasicData = async (childId: number) => {
//     try {
//       const response = await apiRequest(`/children/${childId}`, {
//         method: "PUT",
//         body: JSON.stringify({
//           name: childName,
//           date_of_birth: childBirthDate.split(".").reverse().join("-"), // Convert DD.MM.YYYY to YYYY-MM-DD
//           gender: childGender,
//           has_limitations: childLimitations === "has_limitations",
//           comment: childComment.trim() || null,
//         }),
//       });

//       return response;
//     } catch (error) {
//       console.error("Failed to update child basic data:", error);
//       throw error;
//     }
//   };

//   // Full update child with all data
//   const updateChildFull = async (childId: number) => {
//     try {
//       // Map selected interests/skills names to IDs
//       const selectedInterestIds = selectedInterests
//         .map((interestName) => {
//           const interest = availableInterests.find((i) =>
//             i.name.includes(interestName)
//           );
//           return interest?.id;
//         })
//         .filter((id) => id !== undefined) as number[];

//       const selectedSkillIds = selectedSkills
//         .map((skillName) => {
//           const skill = availableSkills.find((s) => s.name.includes(skillName));
//           return skill?.id;
//         })
//         .filter((id) => id !== undefined) as number[];

//       const response = await apiRequest(`/children/${childId}`, {
//         method: "PUT",
//         body: JSON.stringify({
//           name: childName,
//           date_of_birth: childBirthDate.split(".").reverse().join("-"), // Convert DD.MM.YYYY to YYYY-MM-DD
//           gender: childGender,
//           has_limitations: childLimitations === "has_limitations",
//           comment: childComment.trim() || null,
//           interest_ids: selectedInterestIds,
//           skill_ids: selectedSkillIds,
//         }),
//       });

//       return response;
//     } catch (error) {
//       console.error("Failed to update child:", error);
//       throw error;
//     }
//   };

//   // Load subscription plans
//   const loadSubscriptionPlans = async () => {
//     if (subscriptionPlans.length > 0) {
//       return; // Already loaded
//     }

//     setIsLoadingPlans(true);
//     try {
//       const response: SubscriptionPlansListResponse = await apiRequest(
//         "/subscription-plans/"
//       );
//       setSubscriptionPlans(response.plans);
//     } catch (error) {
//       console.error("Failed to load subscription plans:", error);
//       setError("Не удалось загрузить планы подписки");
//     } finally {
//       setIsLoadingPlans(false);
//     }
//   };

//   // Create subscription for child
//   const createSubscription = async (childId: number, planId: number) => {
//     try {
//       const request: SubscriptionCreateRequest = {
//         child_id: childId,
//         plan_id: planId,
//       };

//       const response: SubscriptionCreateResponse = await apiRequest(
//         "/subscriptions/",
//         {
//           method: "POST",
//           body: JSON.stringify(request),
//         }
//       );

//       // Track the subscription
//       setChildSubscriptions((prev) => {
//         const newMap = new Map(prev);
//         newMap.set(childId, {
//           subscriptionId: response.subscription_id,
//           planId,
//         });
//         return newMap;
//       });

//       return response;
//     } catch (error) {
//       console.error("Failed to create subscription:", error);
//       throw error;
//     }
//   };

//   // Create delivery address via API
//   const createDeliveryAddress = async () => {
//     if (!currentUser) {
//       setError("Пользователь не найден");
//       return null;
//     }

//     try {
//       const response: DeliveryInfoResponse = await apiRequest(
//         `/delivery-addresses/?user_id=${currentUser.id}`,
//         {
//           method: "POST",
//           body: JSON.stringify({
//             name: "Основной адрес",
//             address: deliveryAddress,
//             delivery_time_preference: deliveryTime || null,
//             courier_comment: deliveryComments || null,
//           }),
//         }
//       );

//       setDeliveryAddressData(response);
//       return response;
//     } catch (error) {
//       console.error("Failed to create delivery address:", error);
//       throw error;
//     }
//   };

//   // Create batch payment via API
//   const createBatchPayment = async (subscriptionIds: number[]) => {
//     try {
//       const response: BatchPaymentResponse = await apiRequest(
//         "/payments/create-batch",
//         {
//           method: "POST",
//           body: JSON.stringify({
//             subscription_ids: subscriptionIds,
//           }),
//         }
//       );

//       return response;
//     } catch (error) {
//       console.error("Failed to create batch payment:", error);
//       if (
//         error instanceof Error &&
//         error.message.includes("уже привязана к платежу")
//       ) {
//         setError("Подписка уже привязана к платежу");
//         return null;
//       }
//       throw error;
//     }
//   };

//   // Delete child via API
//   const deleteChild = async (childId: number) => {
//     try {
//       await apiRequest(`/children/${childId}`, {
//         method: "DELETE",
//       });
//       return true;
//     } catch (error) {
//       console.error("Failed to delete child:", error);
//       throw error;
//     }
//   };

//   // Process payment via API
//   const processPayment = async (paymentId: number) => {
//     try {
//       const response: PaymentProcessResponse = await apiRequest(
//         `/payments/${paymentId}/process`,
//         {
//           method: "POST",
//         }
//       );

//       return response;
//     } catch (error) {
//       console.error("Failed to process payment:", error);
//       throw error;
//     }
//   };

//   // Map subscription plan names to our UI types
//   const mapPlanNameToType = (planName: string): "base" | "premium" => {
//     return planName.toLowerCase().includes("премиум") ||
//       planName.toLowerCase().includes("premium")
//       ? "premium"
//       : "base";
//   };

//   // Get plan by name type
//   const getPlanByType = (
//     type: "base" | "premium"
//   ): SubscriptionPlanResponse | undefined => {
//     return subscriptionPlans.find(
//       (plan) => mapPlanNameToType(plan.name) === type
//     );
//   };

//   // Сброс таймера при переходе на шаг кода
//   useEffect(() => {
//     if (step === Step.Code) {
//       setResendTimer(60);
//     }
//   }, [step]);

//   // Тикание таймера
//   useEffect(() => {
//     if (step === Step.Code && resendTimer > 0) {
//       const interval = setInterval(() => {
//         setResendTimer((t) => t - 1);
//       }, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [step, resendTimer]);

//   // Send OTP code
//   const handleSendCode = async () => {
//     setError(null);

//     if (phone.length < 7) {
//       setError("Введите корректный номер телефона");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await apiRequest("/auth/send-otp", {
//         method: "POST",
//         body: JSON.stringify({ phone_number: phone }),
//       });

//       setStep(Step.Code);

//       // DEV MODE: Start auto-fill immediately after successful send
//       setIsAutoFilling(true);
//       setTimeout(async () => {
//         try {
//           const devCode = await getDevCode(phone);
//           if (devCode) {
//             setCode(devCode);
//           }
//         } catch (error) {
//           console.error("Dev code auto-fill failed:", error);
//         } finally {
//           setIsAutoFilling(false);
//         }
//       }, 2000);
//     } catch (error) {
//       setError(
//         error instanceof Error ? error.message : "Не удалось отправить код"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Verify OTP code
//   const handleCheckCode = async () => {
//     setError(null);

//     if (code.length !== 4) {
//       setError("Введите 4-значный код");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const userResponse: UserResponse = await apiRequest("/auth/verify-otp", {
//         method: "POST",
//         body: JSON.stringify({
//           phone_number: phone,
//           code: code,
//         }),
//       });

//       // Save user data
//       setCurrentUser({
//         id: userResponse.id,
//         phone: userResponse.phone_number,
//         name: userResponse.name || "",
//       });

//       // Set name if user already has one
//       if (userResponse.name) {
//         setName(userResponse.name);
//       }

//       // Check if new user (no name)
//       if (!userResponse.name) {
//         setWelcomeIndex(0);
//         setStep(Step.Welcome);
//       } else {
//         setStep(Step.Success);
//       }
//     } catch (error) {
//       setError(error instanceof Error ? error.message : "Неверный код");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle resend code
//   const handleResendCode = async () => {
//     setError(null);
//     setCode("");

//     setIsLoading(true);

//     try {
//       await apiRequest("/auth/send-otp", {
//         method: "POST",
//         body: JSON.stringify({ phone_number: phone }),
//       });

//       setResendTimer(60);

//       // DEV MODE: Start auto-fill immediately after successful resend
//       setIsAutoFilling(true);
//       setTimeout(async () => {
//         try {
//           const devCode = await getDevCode(phone);
//           if (devCode) {
//             setCode(devCode);
//             alert(`🛠️ DEV MODE: Код автоматически заполнен: ${devCode}`);
//           }
//         } catch (error) {
//           console.error("Dev code auto-fill failed:", error);
//         } finally {
//           setIsAutoFilling(false);
//         }
//       }, 2000);
//     } catch (error) {
//       setError(
//         error instanceof Error ? error.message : "Не удалось отправить код"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Auto-verify code when it's 4 digits (removed for real API)
//   // React.useEffect(() => {
//   //   if (code.length === 4) {
//   //     handleCheckCode();
//   //   }
//   // }, [code]);

//   // Update user profile with name
//   const handleRegister = async () => {
//     setError(null);

//     if (!name.trim()) {
//       setError("Введите имя");
//       return;
//     }

//     if (!currentUser) {
//       setError("Ошибка: пользователь не найден");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await apiRequest(`/users/profile/${currentUser.id}`, {
//         method: "PUT",
//         body: JSON.stringify({ name: name.trim() }),
//       });

//       // Update local user data
//       setCurrentUser({
//         ...currentUser,
//         name: name.trim(),
//       });

//       setStep(Step.Child);
//     } catch (error) {
//       setError(
//         error instanceof Error ? error.message : "Не удалось сохранить имя"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle child data submission
//   const handleChildSubmit = async () => {
//     setError(null);
//     if (!childName.trim()) {
//       setError("Введите имя ребенка");
//       return;
//     }

//     const birthDateValidation = validateBirthDate(childBirthDate);
//     if (!birthDateValidation.isValid) {
//       setError(birthDateValidation.error);
//       return;
//     }

//     if (!childGender) {
//       setError("Выберите пол ребенка");
//       return;
//     }
//     if (!childLimitations) {
//       setError("Выберите особенности ребенка");
//       return;
//     }
//     if (childLimitations === "has_limitations" && !childComment.trim()) {
//       setError("Напишите ограничения ребенка");
//       return;
//     }

//     // If editing, update basic data and go to categories to edit interests and skills
//     if (editingChildId && editMode === "data") {
//       setIsLoading(true);
//       try {
//         // Update child basic data via API
//         const childIdToUpdate = children.find(
//           (child) => child.id === editingChildId
//         )?.id;
//         if (childIdToUpdate) {
//           await updateChildBasicData(childIdToUpdate);
//         }

//         // Update local state with basic data
//         setChildren((prev) =>
//           prev.map((child) =>
//             child.id === editingChildId
//               ? {
//                   ...child,
//                   name: childName,
//                   birthDate: childBirthDate,
//                   gender: childGender as "male" | "female",
//                   limitations: childLimitations as "none" | "has_limitations",
//                   comment: childComment,
//                 }
//               : child
//           )
//         );

//         // Load reference data and go to categories
//         await loadReferenceData();
//         setStep(Step.Categories);
//       } catch (error) {
//         setError(
//           error instanceof Error
//             ? error.message
//             : "Не удалось обновить данные ребенка"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Create child via API
//       const childResponse = await createChild();
//       if (childResponse) {
//         // Load reference data and go to categories
//         await loadReferenceData();
//         setStep(Step.Categories);
//       }
//     } catch (error) {
//       setError(
//         error instanceof Error ? error.message : "Не удалось создать ребенка"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle categories submission
//   const handleCategoriesSubmit = async () => {
//     setError(null);
//     if (selectedInterests.length === 0) {
//       setError("Выберите хотя бы один интерес");
//       return;
//     }
//     if (selectedSkills.length === 0) {
//       setError("Выберите хотя бы один навык для развития");
//       return;
//     }

//     // Map selected interests/skills names to IDs
//     const selectedInterestIds = selectedInterests
//       .map((interestName) => {
//         const interest = availableInterests.find((i) =>
//           i.name.includes(interestName)
//         );
//         return interest?.id;
//       })
//       .filter((id) => id !== undefined) as number[];

//     const selectedSkillIds = selectedSkills
//       .map((skillName) => {
//         const skill = availableSkills.find((s) => s.name.includes(skillName));
//         return skill?.id;
//       })
//       .filter((id) => id !== undefined) as number[];

//     if (selectedInterestIds.length === 0 || selectedSkillIds.length === 0) {
//       setError("Не удалось найти соответствующие интересы или навыки");
//       return;
//     }

//     // If editing, update existing child and return to subscription view
//     if (editingChildId && editMode === "data") {
//       setIsLoading(true);
//       try {
//         // Update child interests and skills via API
//         const childIdToUpdate = children.find(
//           (child) => child.id === editingChildId
//         )?.id;
//         if (childIdToUpdate) {
//           await updateChildWithCategories(
//             childIdToUpdate,
//             selectedInterestIds,
//             selectedSkillIds
//           );
//         }

//         // Update local state with interests and skills
//         setChildren((prev) =>
//           prev.map((child) =>
//             child.id === editingChildId
//               ? {
//                   ...child,
//                   interests: selectedInterests,
//                   skills: selectedSkills,
//                 }
//               : child
//           )
//         );

//         // Reset edit mode and return to subscription view
//         setEditingChildId(null);
//         setEditMode(null);
//         setStep(Step.Subscription);
//       } catch (error) {
//         setError(
//           error instanceof Error
//             ? error.message
//             : "Не удалось обновить интересы и навыки ребенка"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//       return;
//     }

//     // For new child, update via API
//     if (currentChildId) {
//       setIsLoading(true);
//       try {
//         await updateChildWithCategories(
//           currentChildId,
//           selectedInterestIds,
//           selectedSkillIds
//         );

//         // Save current child data (for new child)
//         const currentChild = {
//           id: currentChildId,
//           name: childName,
//           birthDate: childBirthDate,
//           gender: childGender as "male" | "female",
//           limitations: childLimitations as "none" | "has_limitations",
//           comment: childComment,
//           interests: selectedInterests,
//           skills: selectedSkills,
//           subscription: "" as "base" | "premium" | "",
//         };

//         setChildren((prev) => [...prev, currentChild]);

//         // Load subscription plans and go to subscription step
//         await loadSubscriptionPlans();
//         setStep(Step.Subscription);
//       } catch (error) {
//         setError(
//           error instanceof Error
//             ? error.message
//             : "Не удалось сохранить интересы и навыки"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       setError("Ошибка: ребенок не был создан");
//     }
//   };

//   // Handle subscription submission
//   const handleSubscriptionSubmit = async () => {
//     setError(null);

//     // Check if we're in children overview with all subscriptions set and user wants to proceed
//     const allChildrenHaveSubscriptions = children.every(
//       (child) => child.subscription !== ""
//     );
//     const isInOverviewMode =
//       children.length > 0 && allChildrenHaveSubscriptions && !editingChildId;

//     // If we're in overview mode and all have subscriptions, proceed to delivery
//     if (isInOverviewMode) {
//       setStep(Step.Delivery);
//       return;
//     }

//     // Otherwise, validate subscription selection for single child or edit mode
//     if (!selectedSubscription) {
//       setError("Выберите тариф");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const selectedPlan = getPlanByType(selectedSubscription);
//       if (!selectedPlan) {
//         setError("Выбранный план не найден");
//         return;
//       }

//       // If editing subscription, update specific child
//       if (editingChildId && editMode === "subscription") {
//         const child = children.find((c) => c.id === editingChildId);
//         if (child) {
//           await createSubscription(child.id, selectedPlan.id);
//         }

//         setChildren((prev) =>
//           prev.map((child) =>
//             child.id === editingChildId
//               ? { ...child, subscription: selectedSubscription }
//               : child
//           )
//         );

//         // Reset edit mode and stay on subscription view
//         setEditingChildId(null);
//         setEditMode(null);
//         return;
//       }

//       // Create subscription for new child
//       if (currentChildId) {
//         await createSubscription(currentChildId, selectedPlan.id);

//         // Update current child with subscription (for new child creation)
//         setChildren((prev) => {
//           const lastChild = prev[prev.length - 1];
//           return prev.map((child) =>
//             child.id === lastChild?.id
//               ? { ...child, subscription: selectedSubscription }
//               : child
//           );
//         });

//         // Clear form data
//         setChildName("");
//         setChildBirthDate("");
//         setChildGender("");
//         setChildLimitations("");
//         setChildComment("");
//         setSelectedInterests([]);
//         setSelectedSkills([]);
//         setSelectedSubscription("");
//         setCurrentChildId(null);

//         // After adding subscription, always stay on subscription step to show overview
//         // User can add more children or proceed to delivery
//       } else {
//         setError("Ребенок не найден");
//       }
//     } catch (error) {
//       setError(
//         error instanceof Error ? error.message : "Не удалось создать подписку"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle delivery submission
//   const handleDeliverySubmit = async () => {
//     setError(null);
//     if (!deliveryAddress.trim()) {
//       setError("Введите адрес доставки");
//       return;
//     }
//     if (!deliveryDate) {
//       setError("Выберите дату доставки");
//       return;
//     }
//     if (!deliveryTime) {
//       setError("Выберите время доставки");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Create delivery address via API
//       const deliveryResponse = await createDeliveryAddress();
//       if (!deliveryResponse) {
//         setError("Не удалось создать адрес доставки");
//         return;
//       }

//       setStep(Step.Payment);
//     } catch (error) {
//       setError(
//         error instanceof Error
//           ? error.message
//           : "Не удалось создать адрес доставки"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle payment submission
//   const handlePaymentSubmit = async () => {
//     setError(null);
//     setIsLoading(true);

//     try {
//       // Collect all subscription IDs from childSubscriptions
//       const subscriptionIds = Array.from(childSubscriptions.values()).map(
//         (sub) => sub.subscriptionId
//       );

//       if (subscriptionIds.length === 0) {
//         setError("Нет подписок для оплаты");
//         return;
//       }

//       // Create batch payment
//       const paymentResponse = await createBatchPayment(subscriptionIds);
//       if (!paymentResponse) {
//         setError("Не удалось создать платеж");
//         return;
//       }
//       setPaymentId(paymentResponse.payment_id);

//       // Start payment processing
//       setPaymentProcessing(true);
//       setIsLoading(false); // Stop general loading, show payment processing

//       // Process the payment (this will take 5-15 seconds)
//       const processResponse = await processPayment(paymentResponse.payment_id);

//       if (processResponse.status === "success") {
//         setStep(Step.Success);
//       } else {
//         setError(processResponse.message || "Платеж не прошел");
//       }
//     } catch (error) {
//       setError(
//         error instanceof Error ? error.message : "Не удалось создать платеж"
//       );
//     } finally {
//       setIsLoading(false);
//       setPaymentProcessing(false);
//     }
//   };

//   // Handle success completion and navigate to kids interface
//   const handleSuccessComplete = () => {
//     // Prepare user data to pass to kids interface
//     const userData: UserData = {
//       name,
//       phone,
//       children,
//       deliveryAddress,
//       deliveryDate,
//       deliveryTime,
//       subscriptionStatus: "just_subscribed",
//       nextSetStatus: "not_determined",
//       subscriptionDate: new Date().toISOString(),
//     };
//     onNavigateToKidsPage(userData, currentUser?.id);
//   };

//   // Handle adding another child
//   const handleAddChild = () => {
//     // Reset form for new child
//     setChildName("");
//     setChildBirthDate("");
//     setChildGender("");
//     setChildLimitations("");
//     setChildComment("");
//     setSelectedInterests([]);
//     setSelectedSkills([]);
//     setSelectedSubscription("");
//     setEditingChildId(null);
//     setEditMode(null);
//     setStep(Step.Child);
//   };

//   // Handle editing child data
//   const handleEditChildData = (childId: number) => {
//     const child = children.find((c) => c.id === childId);
//     if (child) {
//       // Pre-fill form with child data
//       setChildName(child.name);
//       setChildBirthDate(child.birthDate);
//       setChildGender(child.gender);
//       setChildLimitations(child.limitations);
//       setChildComment(child.comment);
//       setSelectedInterests(child.interests);
//       setSelectedSkills(child.skills);
//       setSelectedSubscription(child.subscription);

//       // Set edit mode
//       setEditingChildId(childId);
//       setEditMode("data");
//       setStep(Step.Child);
//     }
//   };

//   // Handle editing child subscription
//   const handleEditChildSubscription = async (childId: number) => {
//     const child = children.find((c) => c.id === childId);
//     if (child) {
//       // Load subscription plans first
//       await loadSubscriptionPlans();

//       // Set current subscription selection
//       setSelectedSubscription(child.subscription);

//       // Set edit mode
//       setEditingChildId(childId);
//       setEditMode("subscription");
//       setStep(Step.Subscription);
//     }
//   };

//   // Step navigation
//   const handleBack = () => {
//     setError(null);

//     // If in edit mode, return to subscription view and reset edit mode
//     if (
//       editingChildId &&
//       (editMode === "data" || editMode === "subscription")
//     ) {
//       setEditingChildId(null);
//       setEditMode(null);
//       setStep(Step.Subscription);
//       return;
//     }

//     if (step === Step.Code) setStep(Step.Phone);
//     else if (step === Step.Register) setStep(Step.Code);
//     else if (step === Step.Child) setStep(Step.Register);
//     else if (step === Step.Categories) setStep(Step.Child);
//     else if (step === Step.Subscription) setStep(Step.Categories);
//     else if (step === Step.Delivery) setStep(Step.Subscription);
//     else if (step === Step.Payment) setStep(Step.Delivery);
//     else if (step === Step.Success) setStep(Step.Phone);
//   };

//   // UI for each step
//   const renderStep = () => {
//     switch (step) {
//       case Step.Phone:
//         return (
//           <PhoneStep
//             phone={phone}
//             setPhone={setPhone}
//             error={error}
//             setError={setError}
//             isLoading={isLoading}
//             setIsLoading={setIsLoading}
//             setStep={setStep}
//             setCode={setCode}
//             setIsAutoFilling={setIsAutoFilling}
//             apiRequest={apiRequest}
//             getDevCode={getDevCode}
//           />
//         );
//       case Step.Code:
//         return (
//           <CodeStep
//             phone={phone}
//             code={code}
//             setCode={setCode}
//             error={error}
//             setError={setError}
//             isLoading={isLoading}
//             setIsLoading={setIsLoading}
//             isAutoFilling={isAutoFilling}
//             setIsAutoFilling={setIsAutoFilling}
//             resendTimer={resendTimer}
//             setResendTimer={setResendTimer}
//             setStep={setStep}
//             setCurrentUser={setCurrentUser}
//             setName={setName}
//             setWelcomeIndex={setWelcomeIndex}
//             apiRequest={apiRequest}
//             getDevCode={getDevCode}
//           />
//         );
//       case Step.Welcome:
//         return (
//           <WelcomeStep
//             welcomeIndex={welcomeIndex}
//             setWelcomeIndex={setWelcomeIndex}
//             setStep={setStep}
//           />
//         );
//       case Step.Register:
//         return (
//           <RegisterStep
//             name={name}
//             setName={setName}
//             isLoading={isLoading}
//             setStep={setStep}
//             handleRegister={handleRegister}
//           />
//         );
//       case Step.Child:
//         return (
//           <ChildStep
//             childName={childName}
//             setChildName={setChildName}
//             childBirthDate={childBirthDate}
//             setChildBirthDate={setChildBirthDate}
//             childGender={childGender}
//             setChildGender={setChildGender}
//             childLimitations={childLimitations}
//             setChildLimitations={setChildLimitations}
//             childComment={childComment}
//             setChildComment={setChildComment}
//             isLoading={isLoading}
//             setStep={setStep}
//             editingChildId={editingChildId}
//             editMode={editMode}
//             formatDateInput={formatDateInput}
//             validateBirthDate={validateBirthDate}
//             handleChildSubmit={handleChildSubmit}
//           />
//         );
//       case Step.Categories:
//         return (
//           <CategoriesStep
//             selectedInterests={selectedInterests}
//             setSelectedInterests={setSelectedInterests}
//             selectedSkills={selectedSkills}
//             setSelectedSkills={setSelectedSkills}
//             availableInterests={availableInterests}
//             availableSkills={availableSkills}
//             isLoadingReferenceData={isLoadingReferenceData}
//             isLoading={isLoading}
//             setStep={setStep}
//             editingChildId={editingChildId}
//             editMode={editMode}
//             handleCategoriesSubmit={handleCategoriesSubmit}
//           />
//         );
//       case Step.Subscription:
//         const currentChild = children[children.length - 1];
//         const hasMultipleChildren = children.length > 1;
//         const allChildrenHaveSubscriptions = children.every(
//           (child) => child.subscription !== ""
//         );
//         const isSubscriptionValid = selectedSubscription !== "";
//         const shouldShowOverview =
//           children.length > 0 &&
//           allChildrenHaveSubscriptions &&
//           !editingChildId;

//         return (
//           <SubscriptionStep
//             children={children}
//             selectedSubscription={selectedSubscription}
//             setSelectedSubscription={setSelectedSubscription}
//             subscriptionPlans={subscriptionPlans}
//             isLoadingPlans={isLoadingPlans}
//             editingChildId={editingChildId}
//             editMode={editMode}
//             isLoading={isLoading}
//             setStep={setStep}
//             handleSubscriptionSubmit={handleSubscriptionSubmit}
//             handleAddChild={handleAddChild}
//             handleEditChildData={handleEditChildData}
//             handleEditChildSubscription={handleEditChildSubscription}
//             deleteChild={deleteChild}
//             calculateAge={calculateAge}
//             getPlanItems={getPlanItems}
//             getPlanByType={getPlanByType}
//             mapPlanNameToType={mapPlanNameToType}
//             setChildSubscriptions={setChildSubscriptions}
//             setChildren={setChildren}
//             setError={setError}
//             setIsLoading={setIsLoading}
//             handleBack={handleBack}
//           />
//         );
//       case Step.Delivery:
//         return (
//           <DeliveryStep
//             deliveryAddress={deliveryAddress}
//             setDeliveryAddress={setDeliveryAddress}
//             deliveryDate={deliveryDate}
//             setDeliveryDate={setDeliveryDate}
//             deliveryTime={deliveryTime}
//             setDeliveryTime={setDeliveryTime}
//             deliveryComments={deliveryComments}
//             setDeliveryComments={setDeliveryComments}
//             isLoading={isLoading}
//             setStep={setStep}
//             handleDeliverySubmit={handleDeliverySubmit}
//             handleBack={handleBack}
//           />
//         );
//       case Step.Payment:
//         return (
//           <PaymentStep
//             children={children}
//             paymentProcessing={paymentProcessing}
//             isLoading={isLoading}
//             setStep={setStep}
//             handlePaymentSubmit={handlePaymentSubmit}
//             handleBack={handleBack}
//             getPlanItems={getPlanItems}
//             getPlanByType={getPlanByType}
//           />
//         );
//       case Step.Success:
//         return <SuccessStep handleSuccessComplete={handleSuccessComplete} />;
//       default:
//         return null;
//     }
//   };

//   // Full screen steps that handle their own layout
//   if (
//     step === Step.Welcome ||
//     step === Step.Register ||
//     step === Step.Child ||
//     step === Step.Categories ||
//     step === Step.Subscription ||
//     step === Step.Delivery ||
//     step === Step.Payment ||
//     step === Step.Success
//   ) {
//     return (
//       <div className="flex flex-col min-h-screen bg-white">
//         {error && (
//           <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm mb-2 text-center fixed top-0 left-0 right-0 z-50">
//             {error}
//           </div>
//         )}
//         {renderStep()}
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-white">
//       {/* Header - скрывать на welcome экранах */}
//       <div className="flex items-center justify-center px-4 py-3 h-16 relative">
//         <span className="font-bold text-lg text-gray-800">BOX4BABY</span>
//         <button
//           className="absolute right-4 bg-gray-100 rounded-lg p-1"
//           onClick={() => setStep(Step.Phone)}
//         >
//           <span className="sr-only">Закрыть</span>
//           <svg
//             width="24"
//             height="24"
//             fill="none"
//             stroke="#30313D"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             <path d="M6 6l12 12M6 18L18 6" />
//           </svg>
//         </button>
//       </div>
//       {/* Content */}
//       <div className="flex flex-col flex-1 px-4 py-8 gap-4 max-w-md w-full mx-auto">
//         {error && (
//           <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm mb-2 text-center">
//             {error}
//           </div>
//         )}
//         {renderStep()}
//       </div>
//     </div>
//   );
// };

export const LoginPage = () => {
  return <div>LoginPage</div>;
};
