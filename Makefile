# Box4Kids Frontend Makefile
# Удобные команды для разработки

.PHONY: start build test preview ts-check api-sync api-gen api-upd install clean menu deploy-dev reset-env build-image

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
	@echo "  $(YELLOW)4)$(NC)  Предпросмотр сборки"
	@echo ""
	@echo "$(BLUE)TypeScript:$(NC)"
	@echo "  $(YELLOW)5)$(NC)  Проверить типы"
	@echo ""
	@echo "$(BLUE)API команды:$(NC)"
	@echo "  $(YELLOW)6)$(NC)  Скачать OpenAPI JSON"
	@echo "  $(YELLOW)7)$(NC)  Сгенерировать API клиент"
	@echo "  $(YELLOW)8)$(NC)  Обновить API (sync + gen)"
	@echo ""
	@echo "$(BLUE)Деплой:$(NC)"
	@echo "  $(YELLOW)9)$(NC)  Деплой в dev"
	@echo "  $(YELLOW)10)$(NC) Сброс окружения"
	@echo "  $(YELLOW)11)$(NC) Сборка образа"
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
		4) make preview ;; \
		5) make ts-check ;; \
		6) make api-sync ;; \
		7) make api-gen ;; \
		8) make api-upd ;; \
		9) make deploy-dev ;; \
		10) make reset-env ;; \
		11) make build-image ;; \
		12) make install ;; \
		13) make clean ;; \
		0) echo "$(GREEN)До свидания! 👋$(NC)" ;; \
		*) echo "$(RED)Неверный выбор. Попробуйте снова.$(NC)" && make menu ;; \
	esac



# Основные команды
start:
	@echo "$(GREEN)🚀 Запускаю dev сервер...$(NC)"
	yarn dev

build:
	@echo "$(GREEN)🔨 Собираю для продакшена...$(NC)"
	yarn build

test:
	@echo "$(GREEN)🧪 Запускаю тесты...$(NC)"
	yarn test

preview:
	@echo "$(GREEN)👁️  Запускаю предпросмотр сборки...$(NC)"
	yarn preview

# TypeScript
ts-check:
	@echo "$(GREEN)🔍 Проверяю типы TypeScript...$(NC)"
	yarn ts-check

# API команды
api-sync:
	@echo "$(GREEN)📥 Скачиваю OpenAPI JSON...$(NC)"
	yarn api:sync

api-gen:
	@echo "$(GREEN)⚙️  Генерирую API клиент...$(NC)"
	yarn api:gen

api-upd:
	@echo "$(GREEN)🔄 Обновляю API (sync + gen)...$(NC)"
	yarn api:upd

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



# Утилиты
install:
	@echo "$(GREEN)📦 Устанавливаю зависимости...$(NC)"
	yarn install

clean:
	@echo "$(RED)🧹 Очищаю node_modules...$(NC)"
	rm -rf node_modules yarn.lock
	@echo "$(GREEN)📦 Переустанавливаю зависимости...$(NC)"
	yarn install

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