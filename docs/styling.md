# Стилизация и цветовая палитра

## Обзор

Nuxt 3 Starter Kit использует комбинированный подход к стилизации: Tailwind CSS для utility-first стилей и SCSS для компонентных стилей. Цветовая палитра построена вокруг основного цвета `#6237A0`.

## 🎨 Цветовая палитра

### Основные цвета

```scss
// Основная цветовая схема
$primary: #6237A0;    // Основной цвет бренда
$info: #3B82F6;       // Информационные элементы
$success: #10B981;    // Успешные операции
$warning: #F59E0B;    // Предупреждения
$danger: #EF4444;     // Ошибки и опасные действия
```

### Оттенки основного цвета

```scss
// Оттенки primary цвета
$primary-50: #f5f3ff;
$primary-100: #ede9fe;
$primary-200: #ddd6fe;
$primary-300: #c4b5fd;
$primary-400: #a78bfa;
$primary-500: #8b5cf6;
$primary-600: #6237A0;  // Основной
$primary-700: #6d28d9;
$primary-800: #5b21b6;
$primary-900: #4c1d95;
```

### Нейтральные цвета

```scss
// Серые оттенки
$gray-50: #f9fafb;
$gray-100: #f3f4f6;
$gray-200: #e5e7eb;
$gray-300: #d1d5db;
$gray-400: #9ca3af;
$gray-500: #6b7280;
$gray-600: #4b5563;
$gray-700: #374151;
$gray-800: #1f2937;
$gray-900: #111827;
```

## 🎯 Использование цветов

### В Tailwind CSS

```vue
<template>
  <!-- Основные цвета -->
  <div class="bg-purple-600 text-white">Primary Background</div>
  <div class="bg-blue-500 text-white">Info Background</div>
  <div class="bg-green-500 text-white">Success Background</div>
  <div class="bg-yellow-500 text-white">Warning Background</div>
  <div class="bg-red-500 text-white">Danger Background</div>
  
  <!-- Текст -->
  <p class="text-purple-600">Primary Text</p>
  <p class="text-blue-500">Info Text</p>
  <p class="text-green-500">Success Text</p>
  <p class="text-yellow-500">Warning Text</p>
  <p class="text-red-500">Danger Text</p>
  
  <!-- Границы -->
  <div class="border-2 border-purple-600">Primary Border</div>
  <div class="border-2 border-blue-500">Info Border</div>
  <div class="border-2 border-green-500">Success Border</div>
  <div class="border-2 border-yellow-500">Warning Border</div>
  <div class="border-2 border-red-500">Danger Border</div>
</template>
```

### В SCSS компонентах

```scss
// В assets/scss/components/button.scss
.app-button-primary {
  background-color: $primary;
  color: white;
  
  &:hover {
    background-color: darken($primary, 10%);
  }
  
  &:disabled {
    background-color: $gray-400;
    cursor: not-allowed;
  }
}

.app-button-outlined {
  background-color: transparent;
  border: 2px solid $primary;
  color: $primary;
  
  &:hover {
    background-color: rgba($primary, 0.1);
  }
}

.app-button-text {
  background-color: transparent;
  color: $primary;
  
  &:hover {
    background-color: rgba($primary, 0.1);
  }
}
```

## 📱 Responsive дизайн

### Breakpoints

```scss
// Стандартные breakpoints Tailwind
$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px
);
```

### Адаптивные стили

```vue
<template>
  <!-- Адаптивные размеры -->
  <div class="text-sm md:text-base lg:text-lg">
    Адаптивный текст
  </div>
  
  <!-- Адаптивные отступы -->
  <div class="p-4 md:p-6 lg:p-8">
    Адаптивные отступы
  </div>
  
  <!-- Адаптивная сетка -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div>Элемент 1</div>
    <div>Элемент 2</div>
    <div>Элемент 3</div>
  </div>
  
  <!-- Адаптивное скрытие/показ -->
  <div class="hidden md:block">Видно только на средних экранах и больше</div>
  <div class="block md:hidden">Видно только на мобильных</div>
</template>
```

## 🎨 Компонентные стили

### Структура SCSS файлов

```
assets/
└── scss/
    ├── components/
    │   ├── button.scss
    │   ├── form.scss
    │   └── dropdown.scss
    ├── base/
    │   ├── variables.scss
    │   ├── mixins.scss
    │   └── reset.scss
    └── main.scss
```

### Переменные и миксины

```scss
// assets/scss/base/_variables.scss
$border-radius: 0.375rem;
$border-radius-lg: 0.5rem;
$border-radius-xl: 0.75rem;

$transition-duration: 0.2s;
$transition-timing: ease-in-out;

$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
```

```scss
// assets/scss/base/_mixins.scss
@mixin button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius;
  font-weight: 500;
  transition: all $transition-duration $transition-timing;
  cursor: pointer;
  border: none;
  outline: none;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

@mixin focus-ring($color: $primary) {
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba($color, 0.1);
  }
}

@mixin responsive($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}
```

### Стили компонентов

```scss
// assets/scss/components/button.scss
.app-button {
  @include button-base;
  
  // Размеры
  &-size-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  &-size-md {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
  
  &-size-lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
  
  // Типы
  &-primary {
    background-color: $primary;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: darken($primary, 10%);
    }
    
    @include focus-ring($primary);
  }
  
  &-outlined {
    background-color: transparent;
    border: 2px solid $primary;
    color: $primary;
    
    &:hover:not(:disabled) {
      background-color: rgba($primary, 0.1);
    }
    
    @include focus-ring($primary);
  }
  
  &-text {
    background-color: transparent;
    color: $primary;
    
    &:hover:not(:disabled) {
      background-color: rgba($primary, 0.1);
    }
    
    @include focus-ring($primary);
  }
  
  // Состояния
  &-loading {
    position: relative;
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 1rem;
      height: 1rem;
      border: 2px solid currentColor;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

## 🌙 Темная тема

### CSS переменные для тем

```scss
// assets/scss/base/_themes.scss
:root {
  // Светлая тема
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  // Темная тема
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --border-color: #374151;
  --shadow-color: rgba(0, 0, 0, 0.3);
}
```

### Использование CSS переменных

```scss
.app-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px var(--shadow-color);
}
```

## 🎯 Типографика

### Шрифты

```scss
// assets/scss/base/_typography.scss
$font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-family-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;

$font-size-xs: 0.75rem;
$font-size-sm: 0.875rem;
$font-size-base: 1rem;
$font-size-lg: 1.125rem;
$font-size-xl: 1.25rem;
$font-size-2xl: 1.5rem;
$font-size-3xl: 1.875rem;
$font-size-4xl: 2.25rem;

$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Стили текста

```vue
<template>
  <!-- Заголовки -->
  <h1 class="text-4xl font-bold text-gray-900">Заголовок H1</h1>
  <h2 class="text-3xl font-semibold text-gray-800">Заголовок H2</h2>
  <h3 class="text-2xl font-medium text-gray-700">Заголовок H3</h3>
  
  <!-- Параграфы -->
  <p class="text-base text-gray-600 leading-relaxed">
    Обычный текст параграфа с хорошей читаемостью
  </p>
  
  <!-- Мелкий текст -->
  <p class="text-sm text-gray-500">
    Мелкий текст для подписей и дополнительной информации
  </p>
  
  <!-- Ссылки -->
  <a href="#" class="text-purple-600 hover:text-purple-700 underline">
    Ссылка с hover эффектом
  </a>
</template>
```

## 🎨 Анимации и переходы

### CSS анимации

```scss
// assets/scss/base/_animations.scss
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Переходы

```vue
<template>
  <div class="transition-all duration-200 ease-in-out">
    <!-- Элемент с плавными переходами -->
  </div>
  
  <div class="hover:scale-105 transition-transform duration-200">
    <!-- Элемент с hover эффектом -->
  </div>
  
  <div class="opacity-0 hover:opacity-100 transition-opacity duration-300">
    <!-- Появляющийся элемент -->
  </div>
</template>
```

## 🎯 Утилитарные классы

### Кастомные Tailwind классы

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#6237A0',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  }
}
```

## 🚀 Лучшие практики

### 1. Консистентность
- Используйте единую цветовую палитру
- Следуйте принципам дизайн-системы
- Поддерживайте единообразие в размерах и отступах

### 2. Доступность
- Обеспечивайте достаточный контраст цветов
- Используйте семантические цвета
- Поддерживайте темную тему

### 3. Производительность
- Минимизируйте CSS
- Используйте CSS переменные
- Оптимизируйте анимации

### 4. Масштабируемость
- Создавайте переиспользуемые компоненты
- Используйте миксины и функции
- Документируйте стили

## 📱 Мобильная оптимизация

### Touch-friendly элементы

```scss
// Минимальный размер для touch элементов
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

// Увеличенные отступы для мобильных
.mobile-padding {
  padding: 1rem;
  
  @include responsive('md') {
    padding: 1.5rem;
  }
}
```

### Адаптивные изображения

```vue
<template>
  <img 
    src="/image.jpg" 
    alt="Описание"
    class="w-full h-auto object-cover"
    loading="lazy"
  />
</template>
```

---

Эта система стилизации обеспечивает консистентный и профессиональный внешний вид приложения, следуя современным стандартам дизайна и доступности. 