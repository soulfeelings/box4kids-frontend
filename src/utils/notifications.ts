import toast from "react-hot-toast";

export const notifications = {
  success: (message: string) => {
    toast.success(message);
  },

  error: (message: string) => {
    toast.error(message);
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  // Специфичные для приложения уведомления
  childAdded: () => {
    toast.success("Ребенок успешно добавлен!");
  },

  childUpdated: () => {
    toast.success("Данные ребенка обновлены!");
  },

  childRemoved: () => {
    toast.success("Ребенок удален");
  },

  subscriptionCreated: () => {
    toast.success("Подписка создана!");
  },

  paymentSuccess: () => {
    toast.success("Оплата прошла успешно!");
  },

  paymentError: () => {
    toast.error("Ошибка при оплате. Попробуйте еще раз.");
  },

  reviewSubmitted: () => {
    toast.success("Спасибо за отзыв!");
  },

  dataSaved: () => {
    toast.success("Данные сохранены");
  },

  networkError: () => {
    toast.error("Ошибка сети. Проверьте соединение.");
  },

  authError: () => {
    toast.error("Ошибка авторизации");
  },
};
