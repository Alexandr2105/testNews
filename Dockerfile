FROM node:20.9.0

#Устанавливает пользователя, от имени которого будут выполняться последующие инструкции
#можно поставить root при создании образа первый раз
USER node

#Создает директорию внутри контейнера.
RUN mkdir -p /home/node/dist/test_for_news

#Устанавливает рабочий каталог
WORKDIR /home/node/dist/test_for_news

#Копирует файлы
COPY --chown=node package*.json ./
COPY --chown=node yarn.lock ./

# Запускает команду установки зависимостей Node.js с использованием Yarn.
#Флаг --frozen-lockfile гарантирует, что Yarn использует замороженный файл блокировки для установки зависимостей,
#что обеспечивает повторяемость установки.
RUN yarn install --frozen-lockfile

ENV PORT=3000

COPY --chown=node . .

RUN yarn build

EXPOSE ${PORT}

CMD ["yarn","start"]