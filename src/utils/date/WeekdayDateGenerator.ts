export class WeekdayDateGenerator {
  /**
   * Генерирует даты для указанных дней недели в течение следующих 4 недель
   * @param weekdays массив дней недели (0 = воскресенье, 1 = понедельник, ..., 6 = суббота)
   * @returns массив дат в формате YYYY-MM-DD
   */
  static generateDatesForWeekdays(weekdays: number[]): string[] {
    if (weekdays.length === 0) return [];

    const dates: string[] = [];
    const today = new Date();
    
    // Генерируем даты на следующие 4 недели
    for (let week = 0; week < 4; week++) {
      for (const weekday of weekdays) {
        const date = new Date(today);
        
        // Находим следующий день недели
        const currentDay = date.getDay();
        const daysToAdd = (weekday - currentDay + 7) % 7 + (week * 7);
        
        date.setDate(date.getDate() + daysToAdd);
        
        // Форматируем дату в YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}`;
        
        // Добавляем только если дата еще не добавлена
        if (!dates.includes(formattedDate)) {
          dates.push(formattedDate);
        }
      }
    }
    
    // Сортируем даты по возрастанию
    return dates.sort();
  }

  /**
   * Проверяет, является ли дата одним из указанных дней недели
   * @param date дата в формате YYYY-MM-DD
   * @param weekdays массив дней недели
   * @returns true если дата соответствует одному из дней недели
   */
  static isDateInWeekdays(date: string, weekdays: number[]): boolean {
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    return weekdays.includes(dayOfWeek);
  }

  /**
   * Получает название дня недели для даты
   * @param date дата в формате YYYY-MM-DD
   * @returns название дня недели
   */
  static getDayName(date: string): string {
    const dateObj = new Date(date);
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[dateObj.getDay()];
  }

  /**
   * Получает короткое название дня недели для даты
   * @param date дата в формате YYYY-MM-DD
   * @returns короткое название дня недели
   */
  static getShortDayName(date: string): string {
    const dateObj = new Date(date);
    const shortDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return shortDays[dateObj.getDay()];
  }
}
