// Функция конвертации даты из DD.MM.YYYY в YYYY-MM-DD
export const convertDateToISO = (dateString: string): string => {
  if (!dateString) return "";

  const parts = dateString.split(".");
  if (parts.length !== 3) return "";

  const day = parts[0].padStart(2, "0");
  const month = parts[1].padStart(2, "0");
  const year = parts[2];

  return `${year}-${month}-${day}`;
};

// Функция конвертации даты из YYYY-MM-DD в DD.MM.YYYY
export const convertDateFromISO = (isoDateString: string): string => {
  if (!isoDateString) return "";

  const parts = isoDateString.split("-");
  if (parts.length !== 3) return "";

  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  return `${day}.${month}.${year}`;
};

// Функция конвертации даты доставки из DD.MM в YYYY-MM-DD
export const convertDeliveryDateToISO = (dateString: string): string => {
  if (!dateString) return "";

  const parts = dateString.split(".");
  if (parts.length !== 2) return "";

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);

  if (isNaN(day) || isNaN(month)) return "";

  const today = new Date();
  const currentYear = today.getFullYear();

  // Создаем дату с текущим годом
  const deliveryDate = new Date(currentYear, month - 1, day);

  // Если дата уже прошла в текущем году, используем следующий год
  if (deliveryDate < today) {
    deliveryDate.setFullYear(currentYear + 1);
  }

  const year = deliveryDate.getFullYear();
  const formattedDay = deliveryDate.getDate().toString().padStart(2, "0");
  const formattedMonth = (deliveryDate.getMonth() + 1)
    .toString()
    .padStart(2, "0");

  return `${year}-${formattedMonth}-${formattedDay}`;
};
