export const formatDeliveryDate = (
  dateString: string | null | undefined
): string => {
  if (!dateString) return "Не указано";

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth();
  const weekday = date.getDay();

  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const weekdays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  return `${day} ${months[month]}, ${weekdays[weekday]}`;
};

export const formatDeliveryTime = (time?: string): string => {
  return time || "14:00 – 18:00";
};

export const formatFullDeliveryDateTime = (
  dateString: string | null | undefined,
  time?: string
): string => {
  const formattedDate = formatDeliveryDate(dateString);
  const formattedTime = formatDeliveryTime(time);

  if (formattedDate === "Не указано") return formattedDate;

  return `${formattedDate} • ${formattedTime}`;
};
