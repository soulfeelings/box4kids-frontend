FROM node:20-alpine

# Установка make, curl и yarn
RUN apk add --no-cache make curl && \
    npm install -g yarn@1.22.22 serve

WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000
