export class DateManager {
  private readonly monthNames = [
    "янв",
    "фев",
    "мар",
    "апр",
    "мая",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
  ];

  private readonly monthNamesFull = [
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

  private readonly dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  /**
   * Конвертирует дату в любой формате в ISO (YYYY-MM-DD)
   */
  toISO(dateString: string): string {
    if (!dateString) return "";

    // Если уже ISO формат
    if (this.isISOFormat(dateString)) {
      return dateString;
    }

    // Если формат DD.MM.YYYY
    if (this.isFullDateFormat(dateString)) {
      return this.convertFullDateToISO(dateString);
    }

    // Если формат DD.MM (для дат доставки)
    if (this.isShortDateFormat(dateString)) {
      return this.convertShortDateToISO(dateString);
    }

    return "";
  }

  /**
   * Конвертирует ISO дату в формат DD.MM.YYYY
   */
  toDisplay(isoDate: string): string {
    if (!isoDate || !this.isISOFormat(isoDate)) return "";

    const [year, month, day] = isoDate.split("-");
    return `${day}.${month}.${year}`;
  }

  /**
   * Конвертирует ISO дату в формат DD.MM
   */
  toShort(isoDate: string): string {
    if (!isoDate || !this.isISOFormat(isoDate)) return "";

    const [, month, day] = isoDate.split("-");
    return `${day}.${month}`;
  }

  /**
   * Форматирует дату для отображения (например: "21 июля, Пн")
   */
  toFormatted(isoDate: string): string {
    if (!isoDate || !this.isISOFormat(isoDate)) return "";

    const date = new Date(isoDate);
    const day = date.getDate();
    const month = this.monthNamesFull[date.getMonth()];
    const dayOfWeek = this.dayNames[date.getDay()];

    return `${day} ${month}, ${dayOfWeek}`;
  }

  /**
   * Генерирует опции дат для селекта (следующие 14 дней)
   */
  generateDateOptions() {
    const options = [{ value: "", label: "Выберите дату" }];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const value = `${day}.${month}`;
      const dayOfWeek = this.dayNames[date.getDay()];
      const monthName = this.monthNames[date.getMonth()];

      let label;
      if (i === 0) {
        label = `Сегодня, ${day} ${monthName}`;
      } else if (i === 1) {
        label = `Завтра, ${day} ${monthName}`;
      } else {
        label = `${dayOfWeek}, ${day} ${monthName}`;
      }

      options.push({ value, label });
    }

    return options;
  }

  /**
   * Валидирует дату рождения (DD.MM.YYYY)
   */
  validateBirthDate(dateString: string): { isValid: boolean; error: string } {
    if (!dateString) return { isValid: false, error: "" };

    if (!this.isFullDateFormat(dateString)) {
      return { isValid: false, error: "Неверный формат даты" };
    }

    const [day, month, year] = dateString.split(".").map(Number);

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
  }

  /**
   * Валидирует дату доставки (DD.MM)
   */
  validateDeliveryDate(dateString: string): {
    isValid: boolean;
    error: string;
  } {
    if (!dateString) return { isValid: false, error: "Выберите дату" };

    if (!this.isShortDateFormat(dateString)) {
      return { isValid: false, error: "Неверный формат даты" };
    }

    const [day, month] = dateString.split(".").map(Number);

    if (isNaN(day) || isNaN(month)) {
      return { isValid: false, error: "Неверный формат даты" };
    }

    if (day < 1 || day > 31) {
      return { isValid: false, error: "Неверный день" };
    }

    if (month < 1 || month > 12) {
      return { isValid: false, error: "Неверный месяц" };
    }

    // Проверка на валидную дату
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, month - 1, day);

    if (date.getDate() !== day || date.getMonth() !== month - 1) {
      return { isValid: false, error: "Такой даты не существует" };
    }

    return { isValid: true, error: "" };
  }

  /**
   * Форматирует ввод даты (автоматически добавляет точки)
   */
  formatDateInput(value: string): string {
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
  }

  /**
   * Вычисляет возраст по дате рождения
   */
  calculateAge(dateOfBirth: string): number {
    if (!this.isFullDateFormat(dateOfBirth)) return 0;

    const [day, month, year] = dateOfBirth.split(".").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return Math.max(0, age);
  }

  /**
   * Возвращает возраст с правильным склонением (год/года/лет)
   */
  getAgeWithDeclension(dateOfBirth: string): string {
    const age = this.calculateAge(dateOfBirth);

    if (age === 1) {
      return `${age} год`;
    } else if (age >= 2 && age <= 4) {
      return `${age} года`;
    } else {
      return `${age} лет`;
    }
  }

  /**
   * Форматирует дату доставки (например: "21 июля, Пн")
   */
  formatDeliveryDate(dateString: string | null | undefined): string {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = this.monthNamesFull[date.getMonth()];
    const weekday = this.dayNames[date.getDay()];
    return `${day} ${month}, ${weekday}`;
  }

  /**
   * Форматирует время доставки (например: "14:00 – 18:00")
   */
  formatDeliveryTime(time?: string): string {
    return time || "14:00 – 18:00";
  }

  /**
   * Форматирует дату и время доставки в одну строку
   */
  formatFullDeliveryDateTime(
    dateString: string | null | undefined,
    time?: string
  ): string {
    const formattedDate = this.formatDeliveryDate(dateString);
    const formattedTime = this.formatDeliveryTime(time);
    if (formattedDate === "Не указано") return formattedDate;
    return `${formattedDate} • ${formattedTime}`;
  }

  // Приватные методы для определения форматов
  private isISOFormat(dateString: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  }

  private isFullDateFormat(dateString: string): boolean {
    return /^\d{2}\.\d{2}\.\d{4}$/.test(dateString);
  }

  private isShortDateFormat(dateString: string): boolean {
    return /^\d{2}\.\d{2}$/.test(dateString);
  }

  private convertFullDateToISO(dateString: string): string {
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`;
  }

  private convertShortDateToISO(dateString: string): string {
    const [day, month] = dateString.split(".").map(Number);
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
  }
}

// Экспортируем единственный экземпляр для использования во всем приложении
export const dateManager = new DateManager();
