FROM node:20-alpine

WORKDIR /app

# Кэшируем зависимости: только если package.json или yarn.lock изменились
COPY package.json yarn.lock* ./
RUN yarn install

# Копируем остальной код
COPY . .

# Собираем билд
RUN yarn build

# Ставим serve как зависимость
RUN yarn add serve --dev

EXPOSE 3000

CMD ["yarn", "serve", "-s", "build", "-l", "3000"]
