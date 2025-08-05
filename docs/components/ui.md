# UI Компоненты

## Обзор

UI компоненты в Nuxt 3 Starter Kit построены на основе PrimeVue 4 с кастомной стилизацией через Tailwind CSS. Все компоненты типизированы и следуют единому дизайн-системе.

## 🎨 Цветовая палитра

```scss
// Основные цвета
$primary: #6237A0;    // Основной цвет бренда
$info: #3B82F6;       // Информационные элементы
$success: #10B981;    // Успешные операции
$warning: #F59E0B;    // Предупреждения
$danger: #EF4444;     // Ошибки и опасные действия
```

## 📦 Доступные компоненты

### AppButton

Универсальный компонент кнопки с поддержкой различных типов, размеров и состояний.

#### Props

```typescript
interface AppButtonProps {
  label?: string;           // Текст кнопки
  iconRight?: string;       // Иконка справа
  prefixIcon?: string;      // Иконка слева
  imageIcon?: string;       // Изображение-иконка
  type?: ButtonType;        // Тип кнопки
  size?: ButtonSize;        // Размер кнопки
  circle?: boolean;         // Круглая кнопка
  loading?: boolean;        // Состояние загрузки
  disabled?: boolean;       // Отключенное состояние
}

type ButtonType = 
  | "primary" 
  | "info" 
  | "success" 
  | "warning" 
  | "danger" 
  | "outlined" 
  | "text-link" 
  | "danger-link";

type ButtonSize = "sm" | "md" | "lg" | "xl" | "2xl" | "custom";
```

#### Примеры использования

```vue
<template>
  <!-- Основная кнопка -->
  <AppButton label="Отправить" type="primary" />
  
  <!-- Кнопка с иконкой -->
  <AppButton 
    label="Добавить" 
    prefixIcon="pi-plus" 
    type="success" 
  />
  
  <!-- Кнопка загрузки -->
  <AppButton 
    label="Сохранить" 
    loading 
    type="primary" 
  />
  
  <!-- Круглая кнопка -->
  <AppButton 
    prefixIcon="pi-heart" 
    circle 
    type="danger" 
  />
  
  <!-- Кнопка-ссылка -->
  <AppButton 
    label="Подробнее" 
    type="text-link" 
  />
</template>
```

#### Размеры кнопок

```vue
<template>
  <div class="flex gap-2 items-center">
    <AppButton label="Маленькая" size="sm" />
    <AppButton label="Средняя" size="md" />
    <AppButton label="Большая" size="lg" />
    <AppButton label="Очень большая" size="xl" />
  </div>
</template>
```

### AppIcon

Компонент для отображения иконок PrimeIcons.

#### Props

```typescript
interface AppIconProps {
  icon: string;        // Название иконки
  size?: string;       // Размер иконки
  color?: string;      // Цвет иконки
  class?: string;      // Дополнительные CSS классы
}
```

#### Примеры использования

```vue
<template>
  <!-- Базовая иконка -->
  <AppIcon icon="pi-home" />
  
  <!-- Иконка с размером -->
  <AppIcon icon="pi-user" size="2xl" />
  
  <!-- Иконка с цветом -->
  <AppIcon icon="pi-check" color="text-green-500" />
  
  <!-- Анимированная иконка -->
  <AppIcon icon="pi-spinner" class="animate-spin" />
</template>
```

### AppDialog

Модальное окно для отображения контента поверх основного интерфейса.

#### Props

```typescript
interface AppDialogProps {
  visible: boolean;           // Видимость диалога
  header?: string;            // Заголовок диалога
  modal?: boolean;            // Модальный режим
  closable?: boolean;         // Возможность закрытия
  closeOnEscape?: boolean;    // Закрытие по Escape
  draggable?: boolean;        // Возможность перетаскивания
  resizable?: boolean;        // Возможность изменения размера
  maximizable?: boolean;      // Возможность максимизации
  breakpoints?: object;       // Точки перелома для responsive
  style?: object;             // Стили диалога
  class?: string;             // CSS классы
}
```

#### Примеры использования

```vue
<template>
  <div>
    <!-- Кнопка для открытия диалога -->
    <AppButton 
      label="Открыть диалог" 
      @click="showDialog = true" 
    />
    
    <!-- Диалог -->
    <AppDialog 
      v-model:visible="showDialog"
      header="Заголовок диалога"
      :modal="true"
      :closable="true"
      style="width: 50vw"
    >
      <p>Содержимое диалога</p>
      
      <template #footer>
        <AppButton 
          label="Отмена" 
          type="outlined" 
          @click="showDialog = false" 
        />
        <AppButton 
          label="Подтвердить" 
          type="primary" 
          @click="handleConfirm" 
        />
      </template>
    </AppDialog>
  </div>
</template>

<script setup lang="ts">
const showDialog = ref(false);

const handleConfirm = () => {
  // Логика подтверждения
  showDialog.value = false;
};
</script>
```

### AppDropdown

Выпадающее меню с поддержкой различных типов контента.

#### Props

```typescript
interface AppDropdownProps {
  modelValue?: any;           // Выбранное значение
  options?: any[];            // Опции для выбора
  optionLabel?: string;       // Поле для отображения
  optionValue?: string;       // Поле для значения
  placeholder?: string;       // Плейсхолдер
  disabled?: boolean;         // Отключенное состояние
  loading?: boolean;          // Состояние загрузки
  filter?: boolean;           // Поиск по опциям
  filterPlaceholder?: string; // Плейсхолдер поиска
  class?: string;             // CSS классы
}
```

#### Примеры использования

```vue
<template>
  <!-- Простой dropdown -->
  <AppDropdown
    v-model="selectedOption"
    :options="options"
    optionLabel="label"
    optionValue="value"
    placeholder="Выберите опцию"
  />
  
  <!-- Dropdown с поиском -->
  <AppDropdown
    v-model="selectedOption"
    :options="options"
    optionLabel="label"
    optionValue="value"
    :filter="true"
    filterPlaceholder="Поиск..."
  />
  
  <!-- Dropdown с иконками -->
  <AppDropdown
    v-model="selectedOption"
    :options="optionsWithIcons"
    optionLabel="label"
    optionValue="value"
  >
    <template #option="{ option }">
      <div class="flex items-center gap-2">
        <AppIcon :icon="option.icon" />
        <span>{{ option.label }}</span>
      </div>
    </template>
  </AppDropdown>
</template>

<script setup lang="ts">
const selectedOption = ref(null);

const options = [
  { label: 'Опция 1', value: 'option1' },
  { label: 'Опция 2', value: 'option2' },
  { label: 'Опция 3', value: 'option3' },
];

const optionsWithIcons = [
  { label: 'Домой', value: 'home', icon: 'pi-home' },
  { label: 'Пользователь', value: 'user', icon: 'pi-user' },
  { label: 'Настройки', value: 'settings', icon: 'pi-cog' },
];
</script>
```

## 🎯 Лучшие практики

### 1. Консистентность
- Используйте единую цветовую палитру
- Следуйте принципам дизайн-системы
- Поддерживайте единообразие в размерах и отступах

### 2. Доступность
- Добавляйте `aria-label` для иконок без текста
- Используйте семантически правильные HTML элементы
- Обеспечивайте навигацию с клавиатуры

### 3. Responsive дизайн
- Используйте Tailwind CSS классы для адаптивности
- Тестируйте компоненты на различных размерах экранов
- Учитывайте touch-интерфейсы для мобильных устройств

### 4. Производительность
- Используйте ленивую загрузку для тяжелых компонентов
- Оптимизируйте перерендеры с помощью `v-memo`
- Минимизируйте количество DOM элементов

## 🔧 Кастомизация

### Переопределение стилей

```scss
// В assets/scss/components/button.scss
.app-button-primary {
  @apply bg-purple-600 hover:bg-purple-700 text-white;
  
  &:disabled {
    @apply bg-gray-400 cursor-not-allowed;
  }
}

.app-button-outlined {
  @apply border-2 border-purple-600 text-purple-600 hover:bg-purple-50;
}
```

### Создание новых типов кнопок

```vue
<template>
  <PrimeButton
    :class="[`app-button-${type}`, customClasses]"
    v-bind="$attrs"
  >
    <slot />
  </PrimeButton>
</template>

<script setup lang="ts">
interface Props {
  type?: 'custom' | 'gradient';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'custom'
});

const customClasses = computed(() => {
  switch (props.type) {
    case 'gradient':
      return 'bg-gradient-to-r from-purple-600 to-blue-600';
    default:
      return '';
  }
});
</script>
```

## 📱 Responsive поведение

### Адаптивные размеры

```vue
<template>
  <AppButton 
    label="Адаптивная кнопка"
    :size="$screen.md ? 'lg' : 'md'"
    class="w-full md:w-auto"
  />
</template>
```

### Мобильная оптимизация

```vue
<template>
  <AppDialog
    v-model:visible="visible"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    :style="{ width: '50vw' }"
  >
    <!-- Контент диалога -->
  </AppDialog>
</template>
```

## 🧪 Тестирование компонентов

### Unit тесты

```typescript
import { mount } from '@vue/test-utils';
import AppButton from '@/components/ui/AppButton.vue';

describe('AppButton', () => {
  it('renders with correct props', () => {
    const wrapper = mount(AppButton, {
      props: {
        label: 'Test Button',
        type: 'primary',
        size: 'md'
      }
    });
    
    expect(wrapper.text()).toContain('Test Button');
    expect(wrapper.classes()).toContain('app-button-primary');
  });
});
```

---

UI компоненты обеспечивают консистентный и профессиональный внешний вид приложения, следуя современным стандартам дизайна и доступности. 