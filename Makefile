# Box4Kids Frontend Makefile
# Удобные команды для разработки

.PHONY: help start build test eject ts-check api-sync api-gen api-upd install clean menu

# Цвета для вывода
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
BLUE = \033[0;34m
NC = \033[0m # No Color

# Интерактивное меню
menu:
	@echo "$(GREEN)╔══════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(GREEN)║                    Box4Kids Frontend Menu                    ║$(NC)"
	@echo "$(GREEN)╚══════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(BLUE)Основные команды:$(NC)"
	@echo "  $(YELLOW)1)$(NC)  Запустить dev сервер"
	@echo "  $(YELLOW)2)$(NC)  Собрать для продакшена"
	@echo "  $(YELLOW)3)$(NC)  Запустить тесты"
	@echo ""
	@echo "$(BLUE)TypeScript:$(NC)"
	@echo "  $(YELLOW)4)$(NC)  Проверить типы"
	@echo ""
	@echo "$(BLUE)API команды:$(NC)"
	@echo "  $(YELLOW)5)$(NC)  Скачать OpenAPI JSON"
	@echo "  $(YELLOW)6)$(NC)  Сгенерировать API клиент"
	@echo "  $(YELLOW)7)$(NC)  Обновить API (sync + gen)"
	@echo ""
	@echo "$(BLUE)Утилиты:$(NC)"
	@echo "  $(YELLOW)8)$(NC)  Установить зависимости"
	@echo "  $(YELLOW)9)$(NC)  Очистить и переустановить"
	@echo "  $(YELLOW)0)$(NC)  Выход"
	@echo ""
	@echo "$(YELLOW)Выберите команду (0-9):$(NC) "
	@read -r choice; \
	case $$choice in \
		1) make start ;; \
		2) make build ;; \
		3) make test ;; \
		4) make ts-check ;; \
		5) make api-sync ;; \
		6) make api-gen ;; \
		7) make api-upd ;; \
		8) make install ;; \
		9) make clean ;; \
		0) echo "$(GREEN)До свидания! 👋$(NC)" ;; \
		*) echo "$(RED)Неверный выбор. Попробуйте снова.$(NC)" && make menu ;; \
	esac

# Помощь
help:
	@echo "$(GREEN)Box4Kids Frontend - Доступные команды:$(NC)"
	@echo ""
	@echo "$(YELLOW)Основные команды:$(NC)"
	@echo "  make start     - Запустить dev сервер (npm start)"
	@echo "  make build     - Собрать для продакшена (npm run build)"
	@echo "  make test      - Запустить тесты (npm test)"
	@echo "  make eject     - Eject из Create React App (npm run eject)"
	@echo ""
	@echo "$(YELLOW)TypeScript:$(NC)"
	@echo "  make ts-check  - Проверить типы TypeScript (npm run ts-check)"
	@echo ""
	@echo "$(YELLOW)API команды:$(NC)"
	@echo "  make api-sync  - Скачать OpenAPI JSON (npm run api:sync)"
	@echo "  make api-gen   - Сгенерировать API клиент (npm run api:gen)"
	@echo "  make api-upd   - Обновить API (sync + gen)"
	@echo ""
	@echo "$(YELLOW)Утилиты:$(NC)"
	@echo "  make install   - Установить зависимости (npm install)"
	@echo "  make clean     - Очистить node_modules и переустановить"
	@echo "  make menu      - Интерактивное меню"
	@echo "  make help      - Показать эту справку"

# Основные команды
start:
	@echo "$(GREEN)🚀 Запускаю dev сервер...$(NC)"
	npm start

build:
	@echo "$(GREEN)🔨 Собираю для продакшена...$(NC)"
	npm run build

test:
	@echo "$(GREEN)🧪 Запускаю тесты...$(NC)"
	npm test

eject:
	@echo "$(RED)⚠️  Внимание! Эта команда необратима!$(NC)"
	@echo "$(YELLOW)Вы уверены что хотите eject? (y/N)$$(NC) "
	@read -r response; \
	if [ "$$response" = "y" ] || [ "$$response" = "Y" ]; then \
		npm run eject; \
	else \
		echo "$(YELLOW)Eject отменен$(NC)"; \
	fi

# TypeScript
ts-check:
	@echo "$(GREEN)🔍 Проверяю типы TypeScript...$(NC)"
	npm run ts-check

# API команды
api-sync:
	@echo "$(GREEN)📥 Скачиваю OpenAPI JSON...$(NC)"
	npm run api:sync

api-gen:
	@echo "$(GREEN)⚙️  Генерирую API клиент...$(NC)"
	npm run api:gen

api-upd:
	@echo "$(GREEN)🔄 Обновляю API (sync + gen)...$(NC)"
	npm run api:upd

# Утилиты
install:
	@echo "$(GREEN)📦 Устанавливаю зависимости...$(NC)"
	npm install

clean:
	@echo "$(RED)🧹 Очищаю node_modules...$(NC)"
	rm -rf node_modules package-lock.json
	@echo "$(GREEN)📦 Переустанавливаю зависимости...$(NC)"
	npm install

# Алиасы для удобства
dev: start
serve: start
run: start
compile: build
check: ts-check
sync: api-sync
gen: api-gen
update: api-upd 