# Box4Kids Frontend Makefile
# Удобные команды для разработки

.PHONY: start build test eject ts-check api-sync api-gen api-upd install clean menu deploy-dev reset-env build-image health-check

# Цвета для вывода
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
BLUE = \033[0;34m
NC = \033[0m # No Color

# Docker Compose настройки
COMPOSE_PROJECT_NAME = box4kids-frontend
COMPOSE_FILE = docker-compose.dev.yml

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
	@echo "$(BLUE)Деплой:$(NC)"
	@echo "  $(YELLOW)8)$(NC)  Деплой в dev"
	@echo "  $(YELLOW)9)$(NC)  Сброс окружения"
	@echo "  $(YELLOW)10)$(NC) Сборка образа"
	@echo "  $(YELLOW)11)$(NC) Проверка здоровья"
	@echo ""
	@echo "$(BLUE)Утилиты:$(NC)"
	@echo "  $(YELLOW)12)$(NC) Установить зависимости"
	@echo "  $(YELLOW)13)$(NC) Очистить и переустановить"
	@echo "  $(YELLOW)0)$(NC)  Выход"
	@echo ""
	@echo "$(YELLOW)Выберите команду (0-13):$(NC) "
	@read -r choice; \
	case $$choice in \
		1) make start ;; \
		2) make build ;; \
		3) make test ;; \
		4) make ts-check ;; \
		5) make api-sync ;; \
		6) make api-gen ;; \
		7) make api-upd ;; \
		8) make deploy-dev ;; \
		9) make reset-env ;; \
		10) make build-image ;; \
		11) make health-check ;; \
		12) make install ;; \
		13) make clean ;; \
		0) echo "$(GREEN)До свидания! 👋$(NC)" ;; \
		*) echo "$(RED)Неверный выбор. Попробуйте снова.$(NC)" && make menu ;; \
	esac



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

# Деплой команды
deploy-dev:
	@echo "$(GREEN)🚀 Деплой в dev окружение...$(NC)"
	COMPOSE_PROJECT_NAME=$(COMPOSE_PROJECT_NAME) docker compose -f $(COMPOSE_FILE) up -d --force-recreate

reset-env:
	@echo "$(RED)💣 Сбрасываю окружение проекта $(COMPOSE_PROJECT_NAME)...$(NC)"
	COMPOSE_PROJECT_NAME=$(COMPOSE_PROJECT_NAME) docker compose -f $(COMPOSE_FILE) down -v --remove-orphans || true
	docker image prune -f --filter label=com.docker.compose.project=$(COMPOSE_PROJECT_NAME)
	docker volume prune -f --filter label=com.docker.compose.project=$(COMPOSE_PROJECT_NAME)

build-image:
	@echo "$(GREEN)🛠 Собираю Docker образ...$(NC)"
	COMPOSE_PROJECT_NAME=$(COMPOSE_PROJECT_NAME) docker compose -f $(COMPOSE_FILE) build --no-cache

health-check:
	@echo "$(GREEN)🔍 Проверяю здоровье приложения...$(NC)"
	@for i in 1 2 3 4 5; do \
		if curl -fs http://localhost:$${PORT:-3000}/health > /dev/null; then \
			echo "$(GREEN)✅ Health check passed$(NC)"; \
			exit 0; \
		fi; \
		echo "$(YELLOW)⏳ Waiting for app... ($$i/5)$(NC)"; \
		sleep 2; \
	done; \
	echo "$(RED)❌ App failed health check$(NC)"; \
	exit 1

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
deploy: deploy-dev
reset: reset-env
build-docker: build-image
health: health-check 