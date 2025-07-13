import {
  UserProfileResponse,
  SubscriptionWithDetailsResponse,
  ToyBoxResponse,
  ChildResponse,
  DeliveryInfoResponse,
} from "../types/api";
import { UserData } from "../types";

// Преобразование данных API в формат фронтенда
export const transformMainScreenData = (
  userProfile: UserProfileResponse,
  subscriptions: SubscriptionWithDetailsResponse[],
  deliveryAddresses: DeliveryInfoResponse[],
  currentBoxes: Map<number, ToyBoxResponse>,
  nextBoxes: Map<number, ToyBoxResponse>
): UserData => {
  // Определяем статус подписки
  const getSubscriptionStatus = ():
    | "not_subscribed"
    | "just_subscribed"
    | "active" => {
    if (subscriptions.length === 0) return "not_subscribed";

    // Проверяем активные подписки
    const activeSubscriptions = subscriptions.filter(
      (sub) => sub.status === "active"
    );
    if (activeSubscriptions.length === 0) return "not_subscribed";

    // Проверяем, была ли подписка создана недавно (условная логика)
    const recentSubscription = activeSubscriptions.find((sub) => {
      const createdAt = new Date(sub.created_at);
      const now = new Date();
      const diffHours =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      return diffHours <= 2;
    });

    if (recentSubscription) return "just_subscribed";

    return "active";
  };

  // Определяем статус следующего набора
  const getNextSetStatus = (): "not_determined" | "determined" => {
    // Если есть следующие наборы для детей, то определен
    return nextBoxes.size > 0 ? "determined" : "not_determined";
  };

  // Преобразуем детей используя полные данные
  const transformedChildren = userProfile.children.map(
    (child: ChildResponse) => ({
      id: child.id,
      name: child.name,
      birthDate: child.date_of_birth, // Реальная дата из API
      gender: child.gender,
      limitations: (child.has_limitations ? "has_limitations" : "none") as
        | "has_limitations"
        | "none",
      comment: child.comment || "",
      interests: child.interests.map((interest: any) =>
        interest.name.split(" ").slice(1).join(" ")
      ), // Убираем эмодзи из названия
      skills: child.skills.map((skill: any) =>
        skill.name.split(" ").slice(1).join(" ")
      ), // Убираем эмодзи из названия
      subscription:
        subscriptions.length > 0
          ? ("base" as const) // TODO: определить тип подписки из данных подписки
          : ("" as const),
    })
  );

  // Получаем основной адрес доставки (первый из списка)
  const primaryAddress = deliveryAddresses[0];

  return {
    name: userProfile.name || "",
    phone: userProfile.phone_number,
    children: transformedChildren,
    deliveryAddress: primaryAddress?.address || "",
    deliveryDate: "", // TODO: получить из данных о доставке
    deliveryTime: primaryAddress?.delivery_time_preference || "",
    subscriptionStatus: getSubscriptionStatus(),
    nextSetStatus: getNextSetStatus(),
    subscriptionDate:
      subscriptions.length > 0
        ? subscriptions[0].expires_at || undefined
        : undefined,
  };
};

// Преобразование данных набора игрушек
export const transformToyBoxToToys = (toyBox: ToyBoxResponse) => {
  return toyBox.items.map((item) => ({
    icon: getToyIcon(item.toy_category_id), // TODO: создать маппинг
    count: item.quantity,
    name: getToyName(item.toy_category_id), // TODO: создать маппинг
    color: getToyColor(item.toy_category_id), // TODO: создать маппинг
  }));
};

// Вспомогательные функции (TODO: получать с бекенда)
// TODO: Доработать ToyBoxItemResponse чтобы включать category_name и category_icon с бекенда
// Сейчас в ToyBoxItemResponse только toy_category_id, а нужна полная информация как в NextBoxItemResponse
const getToyIcon = (categoryId: number): string => {
  // Временная реализация до доработки API
  const icons = ["🔧", "🎨", "🧸", "🧠", "🎪"];
  return icons[categoryId % icons.length];
};

const getToyName = (categoryId: number): string => {
  // Временная реализация до доработки API
  const names = [
    "Конструктор",
    "Творческий набор",
    "Мягкая игрушка",
    "Головоломка",
    "Игра",
  ];
  return names[categoryId % names.length];
};

const getToyColor = (categoryId: number): string => {
  // Временная реализация
  const colors = ["#F8CAAF", "#D4E8C0", "#FFD8BE", "#F6E592", "#E8D3F0"];
  return colors[categoryId % colors.length];
};
