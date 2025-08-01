# Nuxt 3 Starter Kit

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.13.0-00DC82?style=flat-square&logo=nuxt.js)](https://nuxt.com)
[![Vue 3](https://img.shields.io/badge/Vue-3.4.0-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.12-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![PrimeVue](https://img.shields.io/badge/PrimeVue-4.0.7-6366F1?style=flat-square)](https://primevue.org)

Современный стартовый набор для создания веб-приложений на основе Nuxt 3 с готовой архитектурой, UI компонентами и системой аутентификации.

## ✨ Особенности

- 🚀 **Nuxt 3** - Последняя версия Nuxt с Vue 3 и Vite
- 🎨 **PrimeVue 4** - Богатая библиотека UI компонентов
- 🎯 **Tailwind CSS** - Utility-first CSS фреймворк
- 🔐 **Firebase Auth** - Готовая система аутентификации
- 📝 **TypeScript** - Полная типизация
- 🏗 **Готовая архитектура** - Структурированный код
- 📱 **Responsive дизайн** - Адаптивный интерфейс
- 🧪 **Тестирование** - Настроенный Vitest
- 📚 **Документация** - Подробные примеры

## 🎨 Цветовая палитра

- **Primary**: `#6237A0` - Основной цвет бренда
- **Info**: `#3B82F6` - Информационные элементы
- **Success**: `#10B981` - Успешные операции
- **Warning**: `#F59E0B` - Предупреждения
- **Danger**: `#EF4444` - Ошибки и опасные действия

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+ 
- npm или yarn

### Установка

```bash
# Клонирование репозитория
git clone https://github.com/your-username/nuxt3-starter-kit.git
cd nuxt3-starter-kit

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

### Доступные команды

```bash
npm run dev          # Запуск сервера разработки
npm run build        # Сборка для продакшена
npm run preview      # Предварительный просмотр сборки
npm run generate     # Генерация статического сайта
npm run type-check   # Проверка типов TypeScript
npm run lint         # Линтинг кода
npm run test         # Запуск тестов
```

## 📁 Структура проекта

```
starter-kit/
├── app/                    # Конфигурация приложения
├── assets/                 # Статические ресурсы
│   ├── css/               # Глобальные стили
│   └── scss/              # SCSS компоненты
├── components/            # Vue компоненты
│   ├── client/            # Клиентские компоненты
│   ├── form/              # Компоненты форм
│   └── ui/                # UI компоненты
├── composable/            # Composable функции
├── docs/                  # Документация
├── layouts/               # Макеты страниц
├── pages/                 # Страницы приложения
├── stores/                # Pinia stores
├── types/                 # TypeScript типы
└── utils/                 # Утилиты
```

## 🎯 Основные возможности

### UI Компоненты
- **AppButton** - Кнопки с различными типами и размерами
- **AppDialog** - Модальные окна
- **AppDropdown** - Выпадающие меню
- **AppIcon** - Иконки PrimeIcons
- **AppForm** - Типизированные формы с валидацией

### Система форм
- Декларативное описание форм
- Встроенная валидация
- Поддержка различных типов полей
- Типизированные интерфейсы

### Аутентификация
- Firebase Authentication
- JWT токены
- Защищенные маршруты
- Middleware для авторизации

### API интеграция
- Типизированные запросы
- Обработка ошибок
- Кэширование
- Пагинация

## 📚 Документация

Подробная документация доступна в папке [`docs/`](./docs/):

- [**Обзор**](./docs/README.md) - Введение в проект
- [**Архитектура**](./docs/architecture.md) - Структура и принципы
- [**UI Компоненты**](./docs/components/ui.md) - Документация компонентов
- [**Формы**](./docs/components/forms.md) - Работа с формами
- [**Аутентификация**](./docs/auth.md) - Система авторизации
- [**API**](./docs/api.md) - Работа с API
- [**Стилизация**](./docs/styling.md) - Цветовая палитра и стили
- [**Типизация**](./docs/types.md) - TypeScript типы
- [**Примеры**](./docs/examples.md) - Практические примеры
- [**Настройка**](./docs/setup.md) - Инструкции по установке

## 🎨 Примеры использования

### Простая кнопка
```vue
<AppButton label="Нажми меня" type="primary" />
```

### Форма с валидацией
```vue
<AppForm
  :fields="formFields"
  :submit-action="handleSubmit"
  :form-loading="loading"
>
  <template #footer="{ submitAction, disabled, loading }">
    <AppButton
      label="Отправить"
      type="primary"
      :loading="loading"
      :disabled="disabled"
      @click="submitAction"
    />
  </template>
</AppForm>
```

### Защищенная страница
```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
});
</script>
```

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env`:

```env
# API Configuration
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Firebase Configuration
NUXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# App Configuration
NUXT_PUBLIC_APP_NAME="Моё приложение"
NUXT_PUBLIC_APP_DESCRIPTION="Описание приложения"
```

### Tailwind CSS

Цветовая палитра настроена в `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#6237A0', // Основной цвет
          // ... другие оттенки
        }
      }
    }
  }
}
```

## 🧪 Тестирование

```bash
# Запуск тестов
npm run test

# Тесты с UI
npm run test:ui

# Покрытие кода
npm run test:coverage
```

## 🚀 Деплой

### Vercel
```bash
npm run build
```

### Netlify
```bash
npm run generate
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🙏 Благодарности

- [Nuxt Team](https://nuxt.com) за отличный фреймворк
- [PrimeVue](https://primevue.org) за UI компоненты
- [Tailwind CSS](https://tailwindcss.com) за CSS фреймворк
- [Firebase](https://firebase.google.com) за сервисы

## 📞 Поддержка

Если у вас есть вопросы или предложения:

- Создайте [Issue](https://github.com/odilovicc/starter-kit/issues)
- Напишите на email: your-email@example.com

---

**Создано с ❤️ для сообщества разработчиков** 