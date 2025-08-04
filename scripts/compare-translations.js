const fs = require("fs");
const path = require("path");

// Пути к файлам переводов
const ruPath = path.join(__dirname, "../src/locales/ru/translation.json");
const uzPath = path.join(__dirname, "../src/locales/uz/translation.json");

function loadTranslationFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Ошибка чтения файла ${filePath}:`, error.message);
    return {};
  }
}

function getKeys(obj, prefix = "") {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      keys.push(...getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function compareTranslations() {
  console.log("🔍 Сравнение файлов переводов...\n");

  const ruTranslations = loadTranslationFile(ruPath);
  const uzTranslations = loadTranslationFile(uzPath);

  const ruKeys = getKeys(ruTranslations);
  const uzKeys = getKeys(uzTranslations);

  // Находим ключи, которые есть в RU, но нет в UZ
  const missingInUz = ruKeys.filter((key) => !uzKeys.includes(key));

  // Находим ключи, которые есть в UZ, но нет в RU
  const missingInRu = uzKeys.filter((key) => !ruKeys.includes(key));

  // Общие ключи
  const commonKeys = ruKeys.filter((key) => uzKeys.includes(key));

  console.log(`📊 Статистика:`);
  console.log(`   RU файл: ${ruKeys.length} ключей`);
  console.log(`   UZ файл: ${uzKeys.length} ключей`);
  console.log(`   Общих ключей: ${commonKeys.length}`);
  console.log(`   Отсутствует в UZ: ${missingInUz.length}`);
  console.log(`   Отсутствует в RU: ${missingInRu.length}\n`);

  if (missingInUz.length > 0) {
    console.log(`❌ Ключи, отсутствующие в UZ файле (${missingInUz.length}):`);
    missingInUz.forEach((key) => {
      console.log(`   - ${key}`);
    });
    console.log("");
  }

  if (missingInRu.length > 0) {
    console.log(`❌ Ключи, отсутствующие в RU файле (${missingInRu.length}):`);
    missingInRu.forEach((key) => {
      console.log(`   - ${key}`);
    });
    console.log("");
  }

  if (missingInUz.length === 0 && missingInRu.length === 0) {
    console.log("✅ Все ключи синхронизированы между файлами!");
  } else {
    console.log("💡 Рекомендации:");
    if (missingInUz.length > 0) {
      console.log(
        `   - Добавьте ${missingInUz.length} отсутствующих ключей в UZ файл`
      );
    }
    if (missingInRu.length > 0) {
      console.log(
        `   - Добавьте ${missingInRu.length} отсутствующих ключей в RU файл`
      );
    }
  }
}

// Запуск сравнения
compareTranslations();
