import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { ROUTES } from "../constants/routes";

// Типы для параметров навигации
type NavigateState = Record<string, any>;

interface NavigateToEditChildParams {
  childId: number;
  state?: NavigateState;
}

interface NavigateToCancelSubscriptionParams {
  subscriptionId: number;
  state?: NavigateState;
}

interface NavigateToOnboardingParams {
  step?: string;
  state?: NavigateState;
}

interface NavigateParams {
  state?: NavigateState;
}

// Хуки для навигации с параметрами
export const useNavigateToEditChild = () => {
  const navigate = useNavigate();

  return useCallback(
    ({ childId, state }: NavigateToEditChildParams) => {
      navigate(ROUTES.APP.EDIT_CHILD.replace(":childId", childId.toString()), {
        state,
      });
    },
    [navigate]
  );
};

export const useNavigateToCancelSubscription = () => {
  const navigate = useNavigate();

  return useCallback(
    ({ subscriptionId, state }: NavigateToCancelSubscriptionParams) => {
      navigate(
        ROUTES.APP.CANCEL_SUBSCRIPTION.replace(
          ":subscriptionId",
          subscriptionId.toString()
        ),
        { state }
      );
    },
    [navigate]
  );
};

// Хуки для навигации без параметров
export const useNavigateToHome = () => {
  const navigate = useNavigate();

  return useCallback(
    (state?: NavigateState) => {
      navigate(ROUTES.HOME, { state });
    },
    [navigate]
  );
};

export const useNavigateToApp = () => {
  const navigate = useNavigate();

  return useCallback(
    (state?: NavigateState) => {
      navigate(ROUTES.APP.ROOT, { state });
    },
    [navigate]
  );
};

export const useNavigateToOnboarding = () => {
  const navigate = useNavigate();

  return useCallback(
    ({ step, state }: NavigateToOnboardingParams) => {
      navigate(ROUTES.AUTH.ONBOARDING, {
        state: { ...state, ...(step ? { step } : {}) }, // eslint-disable-line
      });
    },
    [navigate]
  );
};

export const useNavigateToChildren = () => {
  const navigate = useNavigate();

  return useCallback(
    (state?: NavigateState) => {
      navigate(ROUTES.APP.CHILDREN, { state });
    },
    [navigate]
  );
};

export const useNavigateToProfile = () => {
  const navigate = useNavigate();

  return useCallback(
    (state?: NavigateState) => {
      navigate(ROUTES.APP.PROFILE, { state });
    },
    [navigate]
  );
};

export const useNavigateToDeliveryHistory = () => {
  const navigate = useNavigate();

  return useCallback(
    (state?: NavigateState) => {
      navigate(ROUTES.APP.DELIVERY_HISTORY, { state });
    },
    [navigate]
  );
};

export const useNavigateToSupport = () => {
  const navigate = useNavigate();

  return useCallback(
    ({ state }: NavigateParams) => {
      navigate(ROUTES.APP.SUPPORT, { state });
    },
    [navigate]
  );
};

export const useNavigateToAdmin = () => {
  const navigate = useNavigate();

  return useCallback(
    (state?: NavigateState) => {
      navigate(ROUTES.ADMIN, { state });
    },
    [navigate]
  );
};
export const useNavigateBack = () => {
  const navigate = useNavigate();

  return useCallback(() => {
    navigate(-1);
  }, [navigate]);
};
