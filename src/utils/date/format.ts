// Функция форматирования даты
export const formatDateInput = (value: string): string => {
  const numericValue = value.replace(/\D/g, "");

  if (numericValue.length <= 2) {
    return numericValue;
  } else if (numericValue.length <= 4) {
    return `${numericValue.slice(0, 2)}.${numericValue.slice(2)}`;
  } else {
    return `${numericValue.slice(0, 2)}.${numericValue.slice(
      2,
      4
    )}.${numericValue.slice(4, 8)}`;
  }
};
