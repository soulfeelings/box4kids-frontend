// Функция валидации даты
export const validateBirthDate = (
  dateString: string
): { isValid: boolean; error: string } => {
  if (!dateString) return { isValid: false, error: "" };

  const parts = dateString.split(".");
  if (parts.length !== 3) {
    return { isValid: false, error: "Неверный формат даты" };
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return { isValid: false, error: "Неверный формат даты" };
  }

  if (day < 1 || day > 31) {
    return { isValid: false, error: "Неверный день" };
  }

  if (month < 1 || month > 12) {
    return { isValid: false, error: "Неверный месяц" };
  }

  if (year < 1900 || year > new Date().getFullYear()) {
    return { isValid: false, error: "Неверный год" };
  }

  // Проверка на валидную дату
  const date = new Date(year, month - 1, day);
  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    return { isValid: false, error: "Такой даты не существует" };
  }

  // Проверка, что дата не в будущем
  if (date > new Date()) {
    return { isValid: false, error: "Дата не может быть в будущем" };
  }

  if (new Date().getFullYear() - year > 18) {
    return { isValid: false, error: "Ребёнок не может быть старше 18 лет" };
  }

  return { isValid: true, error: "" };
};
