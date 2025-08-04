#!/bin/bash

SERVER="ubuntu@ec2-13-51-85-137.eu-north-1.compute.amazonaws.com"
KEY="../demo-box4kids.pem"
APP_NAME="box4kids-frontend"
REMOTE_DIR="/home/ubuntu/$APP_NAME"
ARCHIVE_NAME="build.tar.gz"
PORT=3000

make build

echo "📦 Архивируем build..."
tar -czf $ARCHIVE_NAME build

echo "🔄 Создаем директорию на сервере..."
ssh -i "$KEY" "$SERVER" "mkdir -p $REMOTE_DIR"

echo "🚀 Копируем архив на сервер..."
scp -i "$KEY" "$ARCHIVE_NAME" "$SERVER:$REMOTE_DIR/"

echo "🔄 Настраиваем и запускаем на сервере..."
ssh -i "$KEY" "$SERVER" << EOF
  set -e

  cd $REMOTE_DIR

  echo "📂 Распаковываем архив..."
  tar -xzf $ARCHIVE_NAME --warning=no-unknown-keyword
  rm $ARCHIVE_NAME

  echo "📦 Устанавливаем serve и pm2, если нужно..."
  command -v serve >/dev/null || npm install -g serve
  command -v pm2 >/dev/null || npm install -g pm2

  echo "🔁 Перезапускаем процесс в pm2..."
  pm2 delete $APP_NAME || true
  pm2 start serve --name $APP_NAME -- -s $REMOTE_DIR/build -l $PORT
  pm2 save
EOF

echo "🧹 Удаляем локальный архив..."
rm $ARCHIVE_NAME

echo "✅ Деплой завершен! Приложение работает на порту $PORT"
