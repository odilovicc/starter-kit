# Настройка и установка

## Обзор

Этот раздел содержит подробные инструкции по настройке и установке Nuxt 3 Starter Kit на вашем проекте.

## 🚀 Быстрый старт

### Предварительные требования

- **Node.js** версии 18 или выше
- **npm** или **yarn** пакетный менеджер
- **Git** для управления версиями

### Проверка версий

```bash
# Проверка версии Node.js
node --version

# Проверка версии npm
npm --version

# Проверка версии Git
git --version
```

## 📦 Установка

### 1. Клонирование репозитория

```bash
# Клонирование с GitHub
git clone https://github.com/odilovicc/starter-kit
cd nuxt3-starter-kit

# Или создание нового проекта
npx nuxi@latest init my-project
cd my-project
```

### 2. Установка зависимостей

```bash
# Использование npm
npm install

# Или использование yarn
yarn install

# Или использование pnpm
pnpm install
```

### 3. Установка дополнительных плагинов Tailwind

```bash
npm install @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
```

## ⚙️ Конфигурация

### 1. Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# API Configuration
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Firebase Configuration (если используется)
NUXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NUXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# App Configuration
NUXT_PUBLIC_APP_NAME="Моё приложение"
NUXT_PUBLIC_APP_DESCRIPTION="Описание приложения"
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Конфигурация Nuxt

Обновите `nuxt.config.ts`:

```typescript
import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  // Основная конфигурация
  app: {
    head: {
      title: process.env.NUXT_PUBLIC_APP_NAME || 'Nuxt 3 App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          hid: 'description', 
          name: 'description', 
          content: process.env.NUXT_PUBLIC_APP_DESCRIPTION || 'Nuxt 3 Application' 
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Модули
  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  // PrimeVue конфигурация
  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: "app-dark"
        }
      }
    }
  },

  // Tailwind CSS
  tailwindcss: {
    config: {
      content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
      ]
    }
  },

  // CSS
  css: [
    "~/assets/css/global.css",
    'primeicons/primeicons.css'
  ],

  // Компоненты
  components: [
    {
      path: "~/components",
      pathPrefix: false
    }
  ],

  // Runtime Config
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      appName: process.env.NUXT_PUBLIC_APP_NAME,
      appDescription: process.env.NUXT_PUBLIC_APP_DESCRIPTION,
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID
      }
    }
  },

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: true
  },

  // PostCSS
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Devtools
  devtools: { enabled: true }
})
```

### 3. Конфигурация TypeScript

Обновите `tsconfig.json`:

```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["./*"],
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "**/*.vue"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

## 🔧 Настройка Firebase (опционально)

### 1. Создание проекта Firebase

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Создайте новый проект
3. Включите Authentication
4. Настройте методы аутентификации (Email/Password)

### 2. Получение конфигурации

1. В настройках проекта найдите "Your apps"
2. Добавьте веб-приложение
3. Скопируйте конфигурацию

### 3. Настройка в проекте

Создайте файл `plugins/firebase.client.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  const firebaseConfig = {
    apiKey: config.public.firebase.apiKey,
    authDomain: config.public.firebase.authDomain,
    projectId: config.public.firebase.projectId,
    storageBucket: config.public.firebase.storageBucket,
    messagingSenderId: config.public.firebase.messagingSenderId,
    appId: config.public.firebase.appId
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  return {
    provide: {
      firebase: app,
      auth: auth
    }
  };
});
```

## 🎨 Настройка стилей

### 1. Глобальные стили

Обновите `assets/css/global.css`:

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Кастомные стили */
@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  /* Кастомные компоненты */
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-soft p-6;
  }
}

@layer utilities {
  /* Кастомные утилиты */
  .text-gradient {
    @apply bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent;
  }
}
```

### 2. SCSS переменные

Создайте `assets/scss/base/_variables.scss`:

```scss
// Цветовая палитра
$primary: #6237A0;
$info: #3B82F6;
$success: #10B981;
$warning: #F59E0B;
$danger: #EF4444;

// Размеры
$border-radius: 0.375rem;
$border-radius-lg: 0.5rem;
$border-radius-xl: 0.75rem;

// Переходы
$transition-duration: 0.2s;
$transition-timing: ease-in-out;

// Тени
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
```

## 🚀 Запуск проекта

### Команды разработки

```bash
# Запуск сервера разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview

# Генерация статического сайта
npm run generate

# Проверка типов TypeScript
npm run type-check

# Линтинг кода
npm run lint
```

### Доступные скрипты

Добавьте в `package.json`:

```json
{
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "type-check": "nuxt typecheck",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

## 🔧 Настройка ESLint и Prettier

### 1. Установка зависимостей

```bash
npm install -D eslint @nuxt/eslint-config prettier eslint-config-prettier eslint-plugin-prettier
```

### 2. Конфигурация ESLint

Создайте `.eslintrc.js`:

```javascript
module.exports = {
  root: true,
  extends: [
    '@nuxt/eslint-config',
    'prettier'
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error'
  }
}
```

### 3. Конфигурация Prettier

Создайте `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

## 🧪 Настройка тестирования

### 1. Установка Vitest

```bash
npm install -D vitest @vue/test-utils @nuxt/test-utils
```

### 2. Конфигурация Vitest

Создайте `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true
  },
  resolve: {
    alias: {
      '~': '.',
      '@': '.'
    }
  }
})
```

## 📱 Настройка PWA (опционально)

### 1. Установка модуля PWA

```bash
npm install @nuxtjs/pwa
```

### 2. Конфигурация PWA

Добавьте в `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: [
    // ... другие модули
    '@nuxtjs/pwa'
  ],
  
  pwa: {
    manifest: {
      name: process.env.NUXT_PUBLIC_APP_NAME,
      short_name: 'App',
      description: process.env.NUXT_PUBLIC_APP_DESCRIPTION,
      theme_color: '#6237A0',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/'
    }
  }
})
```

## 🚀 Деплой

### 1. Подготовка к продакшену

```bash
# Сборка проекта
npm run build

# Проверка сборки
npm run preview
```

### 2. Деплой на Vercel

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения
3. Деплой произойдет автоматически

### 3. Деплой на Netlify

1. Подключите репозиторий к Netlify
2. Настройте build команду: `npm run build`
3. Настройте publish директорию: `.output/public`

## 🔍 Отладка

### 1. Включение DevTools

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true }
})
```

### 2. Логирование

```typescript
// В компонентах
console.log('Debug info:', data)

// В серверных функциях
console.log('Server log:', data)
```

### 3. Vue DevTools

Установите расширение Vue DevTools для браузера для отладки компонентов.

## 📚 Следующие шаги

1. **Изучите документацию** - Прочитайте все разделы документации
2. **Настройте API** - Подключите ваш бэкенд
3. **Кастомизируйте дизайн** - Адаптируйте под ваши потребности
4. **Добавьте функциональность** - Расширьте базовый функционал
5. **Напишите тесты** - Обеспечьте качество кода

---

Теперь ваш Nuxt 3 Starter Kit готов к использованию! Следуйте документации для дальнейшей разработки. 