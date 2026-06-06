# Next X Tweet Demo

Небольшой X-клон на Next.js App Router с Feature-Sliced Design, демо-авторизацией и локальным JSON-хранилищем.

## Возможности

- домашняя лента и публикация твитов через Server Actions;
- публичные профили, поиск, тренды и фильтрация;
- лайки, закладки, репосты и цепочки ответов;
- защищённый dashboard и демо-сессия через cookie;
- валидация форм через Zod;
- базовые тесты Vitest.

## Структура

```text
app/          # Next.js App Router: маршруты, layouts и route-файлы
pages/        # пустая защита от обнаружения src/pages как Pages Router
src/
  app/        # FSD App: глобальные стили и инфраструктура приложения
  pages/      # FSD Pages: экранные слайсы
  widgets/    # крупные самостоятельные блоки интерфейса
  features/   # пользовательские действия
  entities/   # бизнес-сущности tweet и user
  shared/     # общий UI, конфигурация и адаптер данных shared/db
```

Файлы в корневом `app` служат адаптерами Next.js и реэкспортируют страницы из `src/pages`. Корневая папка `pages` содержит только README и не используется как Pages Router.

Alias `@/*` указывает на `src/*`.

Интерактивная лента находится в `widgets/tweet-feed`: она объединяет UI сущности твита с feature actions. JSON-хранилище и его независимые persistence-типы находятся в `shared/db`; запись и связанная ревалидация выполняются рядом в entity-мутациях.

## Запуск

```bash
npm install
npm run dev
```

Приложение будет доступно на `http://localhost:3000`.

## Команды

```bash
npm run dev
npm run lint
npm run test
npm run build
```

По умолчанию `dev` и `build` используют Webpack. Для проверки Turbopack доступны `npm run dev:turbo` и `npm run build:turbo`.

## Данные

Локальная демо-база хранится в `data/demo-db.json`. Для тестов путь можно изменить через переменную `DEMO_DB_PATH`.

## Deploy

https://next-x-tweet.vercel.app/
