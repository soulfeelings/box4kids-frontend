import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistrationStore } from "../../../store/registrationStore";
import { AUTH_STEPS, AuthStep } from "../../../constants/auth";
import { ROUTES } from "../../../constants/routes";

export const useOnboardingFlow = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    phoneData,
    welcomeData,
    registerData,
    categoriesData,
    subscriptionData,
    deliveryData,
    paymentData,
    user,
    isAuthenticated,
  } = useRegistrationStore();

  // Проверка доступности шага на основе имеющихся данных
  const canAccessStep = useCallback(
    (step: AuthStep): boolean => {
      switch (step) {
        case AUTH_STEPS.REGISTER:
          return (
            phoneData.verified &&
            !!welcomeData.firstName &&
            !!welcomeData.lastName
          );

        case AUTH_STEPS.CHILD:
          return (
            !!registerData.email && registerData.terms && !!registerData.name
          );

        case AUTH_STEPS.CATEGORIES:
          return true; // Ребенок может быть создан в процессе

        case AUTH_STEPS.SUBSCRIPTION:
          return categoriesData.interestIds.length > 0;

        case AUTH_STEPS.DELIVERY:
          return subscriptionData.plan !== "" && subscriptionData.plan !== null;

        case AUTH_STEPS.PAYMENT:
          return (
            !!deliveryData.address && !!deliveryData.date && !!deliveryData.time
          );

        default:
          return true;
      }
    },
    [
      phoneData.verified,
      welcomeData.firstName,
      welcomeData.lastName,
      registerData.email,
      registerData.terms,
      registerData.name,
      categoriesData.interestIds.length,
      subscriptionData.plan,
      deliveryData.address,
      deliveryData.date,
      deliveryData.time,
    ]
  );

  // Получение следующего доступного шага
  const getNextValidStep = useCallback((): AuthStep => {
    const steps = [
      AUTH_STEPS.REGISTER,
      AUTH_STEPS.CHILD,
      AUTH_STEPS.CATEGORIES,
      AUTH_STEPS.SUBSCRIPTION,
      AUTH_STEPS.DELIVERY,
      AUTH_STEPS.PAYMENT,
    ];

    for (const step of steps) {
      if (!canAccessStep(step)) {
        return step;
      }
    }

    return AUTH_STEPS.PAYMENT; // Последний шаг по умолчанию
  }, [canAccessStep]);

  // Валидация и перенаправление на корректный шаг
  const validateAndRedirect = useCallback(() => {
    // Проверяем аутентификацию
    if (!isAuthenticated) {
      navigate(ROUTES.AUTH.PHONE);
      return;
    }

    // Определяем корректный шаг
    const validStep = getNextValidStep();

    // Если текущий шаг недоступен, переходим на валидный
    if (!canAccessStep(currentStep)) {
      setCurrentStep(validStep);
    }
  }, [
    isAuthenticated,
    currentStep,
    canAccessStep,
    getNextValidStep,
    setCurrentStep,
    navigate,
  ]);

  // Переход к следующему шагу
  const goToNextStep = useCallback(() => {
    const onboardingSteps = [
      AUTH_STEPS.REGISTER,
      AUTH_STEPS.CHILD,
      AUTH_STEPS.CATEGORIES,
      AUTH_STEPS.SUBSCRIPTION,
      AUTH_STEPS.DELIVERY,
      AUTH_STEPS.PAYMENT,
    ];

    const currentStepIndex = onboardingSteps.indexOf(currentStep as any);

    // Если текущий шаг не в списке онбординга, начинаем с первого шага
    if (currentStepIndex === -1) {
      setCurrentStep(AUTH_STEPS.REGISTER);
      return;
    }

    const nextStepIndex = currentStepIndex + 1;

    if (nextStepIndex < onboardingSteps.length) {
      const nextStep = onboardingSteps[nextStepIndex];
      if (canAccessStep(nextStep)) {
        setCurrentStep(nextStep);
      }
    } else {
      // Переходим к успешному завершению
      navigate(ROUTES.AUTH.SUCCESS);
    }
  }, [currentStep, canAccessStep, setCurrentStep, navigate]);

  // Переход к предыдущему шагу
  const goToPrevStep = useCallback(() => {
    const onboardingSteps = [
      AUTH_STEPS.REGISTER,
      AUTH_STEPS.CHILD,
      AUTH_STEPS.CATEGORIES,
      AUTH_STEPS.SUBSCRIPTION,
      AUTH_STEPS.DELIVERY,
      AUTH_STEPS.PAYMENT,
    ];

    const currentStepIndex = onboardingSteps.indexOf(currentStep as any);

    // Если текущий шаг не в списке онбординга, переходим к первому шагу
    if (currentStepIndex === -1) {
      setCurrentStep(AUTH_STEPS.REGISTER);
      return;
    }

    const prevStepIndex = currentStepIndex - 1;

    if (prevStepIndex >= 0) {
      const prevStep = onboardingSteps[prevStepIndex];
      setCurrentStep(prevStep);
    }
  }, [currentStep, setCurrentStep]);

  // Проверка возможности перехода назад
  const canGoBack = useCallback(() => {
    const onboardingSteps = [
      AUTH_STEPS.REGISTER,
      AUTH_STEPS.CHILD,
      AUTH_STEPS.CATEGORIES,
      AUTH_STEPS.SUBSCRIPTION,
      AUTH_STEPS.DELIVERY,
      AUTH_STEPS.PAYMENT,
    ];

    const currentStepIndex = onboardingSteps.indexOf(currentStep as any);
    return currentStepIndex > 0;
  }, [currentStep]);

  // Проверка возможности перехода вперед
  const canGoForward = useCallback(() => {
    return canAccessStep(currentStep);
  }, [currentStep, canAccessStep]);

  // Инициализация при загрузке компонента
  useEffect(() => {
    validateAndRedirect();
  }, [validateAndRedirect]);

  return {
    currentStep,
    canAccessStep,
    goToNextStep,
    goToPrevStep,
    canGoBack,
    canGoForward,
    validateAndRedirect,
  };
};
