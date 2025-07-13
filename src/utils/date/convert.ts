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
