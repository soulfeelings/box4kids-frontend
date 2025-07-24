class ColorManager {
  private readonly colors = [
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-indigo-100",
    "bg-red-100",
    "bg-orange-100",
    "bg-teal-100",
    "bg-cyan-100",
  ];

  private readonly hexColors = [
    "#DBEAFE", // blue-100
    "#D1FAE5", // green-100
    "#FEF3C7", // yellow-100
    "#F3E8FF", // purple-100
    "#FCE7F3", // pink-100
    "#E0E7FF", // indigo-100
    "#FEE2E2", // red-100
    "#FFEDD5", // orange-100
    "#CCFBF1", // teal-100
    "#CFFAFE", // cyan-100
  ];

  /**
   * Получить Tailwind класс цвета по ID
   */
  getTailwindColor(id: number): string {
    const colorIndex = id % this.colors.length;
    return this.colors[colorIndex];
  }

  /**
   * Получить HEX цвет по ID
   */
  getHexColor(id: number): string {
    const colorIndex = id % this.hexColors.length;
    return this.hexColors[colorIndex];
  }

  /**
   * Получить цвет по ID с fallback на индекс
   */
  getColorById(id: number | undefined, fallbackIndex: number = 0): string {
    if (id !== undefined) {
      return this.getTailwindColor(id);
    }
    return this.colors[fallbackIndex % this.colors.length];
  }

  /**
   * Получить HEX цвет по ID с fallback на индекс
   */
  getHexColorById(id: number | undefined, fallbackIndex: number = 0): string {
    if (id !== undefined) {
      return this.getHexColor(id);
    }
    return this.hexColors[fallbackIndex % this.hexColors.length];
  }
}

export const colorManager = new ColorManager();
