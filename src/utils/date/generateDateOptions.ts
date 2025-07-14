// Generate date options for next 14 days
export const generateDateOptions = () => {
  const options = [{ value: "", label: "Выберите дату" }];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    const value = `${day}.${month}`;
    const dayOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][date.getDay()];
    const monthName = [
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
    ][date.getMonth()];

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
};
