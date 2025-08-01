# Система форм

## Обзор

Система форм в Nuxt 3 Starter Kit предоставляет декларативный подход к созданию типизированных форм с встроенной валидацией. Все компоненты форм построены на основе PrimeVue с кастомной логикой валидации.

## 🏗 Архитектура форм

### Основные компоненты

- **AppForm** - Главный компонент формы
- **FormField** - Обертка для полей с лейблом и ошибками
- **AppFormInputText** - Текстовые поля
- **AppFormInputPassword** - Поля паролей
- **AppFormInputNumber** - Числовые поля
- **AppFormSelect** - Выпадающие списки
- **AppFormMultiSelect** - Множественный выбор
- **AppFormFile** - Загрузка файлов
- **AppFormTextarea** - Многострочные поля
- **AppFormInputMask** - Поля с маской

## 📝 Типы полей

```typescript
export enum FormFieldType {
  TEXT = 'text',
  PASSWORD = 'password',
  NUMBER = 'number',
  SELECT = 'select',
  PHONE = 'phone',
  FILE = 'file',
  TEXTAREA = 'textarea',
  MULTISELECT = 'multiselect',
}
```

## ✅ Правила валидации

```typescript
export enum ValidationRuleType {
  REQUIRED = 'required',
  EMAIL = 'email',
  PASSWORD = 'password',
  FILE = 'file',
  MULTISELECT = 'multiselect',
}
```

## 🎯 Основные типы

### BaseFormField

```typescript
interface BaseFormField {
  type: FormFieldType;
  key: string;
  label: string;
  class?: string;
  params?: Record<string, any>;
  error?: string | null;
  validationRules?: ValidationRuleType[];
  initialValue?: any;
}
```

### SelectFormField

```typescript
interface SelectFormField extends BaseFormField {
  type: FormFieldType.SELECT;
  list: IDropdownList[];
}

interface IDropdownList {
  label: string | number;
  value: string | number;
  imageIcon?: string;
  icon?: string;
}
```

### MultiSelectFormField

```typescript
interface MultiSelectFormField extends BaseFormField {
  type: FormFieldType.MULTISELECT;
  list: IDropdownList[];
  maxSelectedLabels?: number;
  display?: 'comma' | 'chip';
  filter?: boolean;
}
```

## 📋 Примеры использования

### Простая форма регистрации

```vue
<template>
  <AppForm
    :fields="formFields"
    :submit-action="handleSubmit"
    :form-loading="loading"
  >
    <template #footer="{ submitAction, disabled, loading }">
      <div class="flex gap-2 justify-end">
        <AppButton
          label="Отмена"
          type="outlined"
          @click="$router.push('/')"
        />
        <AppButton
          label="Зарегистрироваться"
          type="primary"
          :loading="loading"
          :disabled="disabled"
          @click="submitAction"
        />
      </div>
    </template>
  </AppForm>
</template>

<script setup lang="ts">
import { FormFieldType, ValidationRuleType } from '~/types/form';

const loading = ref(false);

const formFields: FormField[][] = [
  [
    {
      type: FormFieldType.TEXT,
      key: 'firstName',
      label: 'Имя',
      validationRules: [ValidationRuleType.REQUIRED],
      params: {
        placeholder: 'Введите ваше имя'
      }
    },
    {
      type: FormFieldType.TEXT,
      key: 'lastName',
      label: 'Фамилия',
      validationRules: [ValidationRuleType.REQUIRED],
      params: {
        placeholder: 'Введите вашу фамилию'
      }
    }
  ],
  [
    {
      type: FormFieldType.TEXT,
      key: 'email',
      label: 'Email',
      validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.EMAIL],
      params: {
        placeholder: 'example@email.com',
        type: 'email'
      }
    }
  ],
  [
    {
      type: FormFieldType.PASSWORD,
      key: 'password',
      label: 'Пароль',
      validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.PASSWORD],
      params: {
        placeholder: 'Минимум 6 символов'
      }
    },
    {
      type: FormFieldType.PASSWORD,
      key: 'confirmPassword',
      label: 'Подтвердите пароль',
      validationRules: [ValidationRuleType.REQUIRED],
      params: {
        placeholder: 'Повторите пароль'
      }
    }
  ]
];

const handleSubmit = async (formData: Record<string, any>) => {
  loading.value = true;
  
  try {
    // Проверка совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      throw new Error('Пароли не совпадают');
    }
    
    // Отправка данных на сервер
    await registerUser(formData);
    
    // Успешная регистрация
    $router.push('/login');
  } catch (error) {
    console.error('Ошибка регистрации:', error);
  } finally {
    loading.value = false;
  }
};
</script>
```

### Форма с селектами и файлами

```vue
<template>
  <AppForm
    :fields="formFields"
    :submit-action="handleSubmit"
    :form-loading="loading"
  >
    <template #footer="{ submitAction, disabled, loading }">
      <AppButton
        label="Сохранить"
        type="primary"
        :loading="loading"
        :disabled="disabled"
        @click="submitAction"
      />
    </template>
  </AppForm>
</template>

<script setup lang="ts">
import { FormFieldType, ValidationRuleType } from '~/types/form';

const loading = ref(false);

const countries = [
  { label: 'Россия', value: 'ru' },
  { label: 'США', value: 'us' },
  { label: 'Германия', value: 'de' },
  { label: 'Франция', value: 'fr' }
];

const interests = [
  { label: 'Программирование', value: 'programming' },
  { label: 'Дизайн', value: 'design' },
  { label: 'Маркетинг', value: 'marketing' },
  { label: 'Продажи', value: 'sales' }
];

const formFields: FormField[][] = [
  [
    {
      type: FormFieldType.SELECT,
      key: 'country',
      label: 'Страна',
      validationRules: [ValidationRuleType.REQUIRED],
      list: countries,
      params: {
        placeholder: 'Выберите страну'
      }
    },
    {
      type: FormFieldType.PHONE,
      key: 'phone',
      label: 'Телефон',
      validationRules: [ValidationRuleType.REQUIRED],
      params: {
        mask: '+7 (999) 999-99-99',
        placeholder: '+7 (___) ___-__-__'
      }
    }
  ],
  [
    {
      type: FormFieldType.MULTISELECT,
      key: 'interests',
      label: 'Интересы',
      validationRules: [ValidationRuleType.MULTISELECT],
      list: interests,
      maxSelectedLabels: 3,
      display: 'chip',
      filter: true,
      params: {
        placeholder: 'Выберите интересы'
      }
    }
  ],
  [
    {
      type: FormFieldType.FILE,
      key: 'avatar',
      label: 'Аватар',
      validationRules: [ValidationRuleType.FILE],
      params: {
        accept: 'image/*',
        maxFileSize: 5 * 1024 * 1024, // 5MB
        multiple: false
      }
    }
  ],
  [
    {
      type: FormFieldType.TEXTAREA,
      key: 'bio',
      label: 'О себе',
      params: {
        placeholder: 'Расскажите о себе...',
        rows: 4,
        maxlength: 500
      }
    }
  ]
];

const handleSubmit = async (formData: Record<string, any>) => {
  loading.value = true;
  
  try {
    console.log('Данные формы:', formData);
    // Обработка данных формы
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    loading.value = false;
  }
};
</script>
```

## 🔧 Кастомизация валидации

### Создание кастомных правил

```typescript
// В composable/validation.ts
export const useCustomValidation = () => {
  const customRules = {
    minLength: (min: number) => (value: string) =>
      value.length >= min || `Минимум ${min} символов`,
    
    maxLength: (max: number) => (value: string) =>
      value.length <= max || `Максимум ${max} символов`,
    
    pattern: (regex: RegExp, message: string) => (value: string) =>
      regex.test(value) || message,
    
    custom: (validator: (value: any) => boolean | string) => (value: any) =>
      validator(value)
  };

  return { customRules };
};
```

### Использование кастомных правил

```vue
<script setup lang="ts">
import { useCustomValidation } from '~/composable/validation';

const { customRules } = useCustomValidation();

const formFields: FormField[][] = [
  [
    {
      type: FormFieldType.TEXT,
      key: 'username',
      label: 'Имя пользователя',
      validationRules: [ValidationRuleType.REQUIRED],
      params: {
        placeholder: 'Введите имя пользователя'
      },
      // Кастомная валидация через params
      customValidation: [
        customRules.minLength(3),
        customRules.pattern(/^[a-zA-Z0-9_]+$/, 'Только буквы, цифры и подчеркивания')
      ]
    }
  ]
];
</script>
```

## 📱 Responsive формы

### Адаптивная сетка

```vue
<template>
  <AppForm
    :fields="formFields"
    :submit-action="handleSubmit"
    class="max-w-4xl mx-auto"
  />
</template>

<script setup lang="ts">
const formFields: FormField[][] = [
  // Одна колонка на мобильных, две на десктопе
  [
    {
      type: FormFieldType.TEXT,
      key: 'firstName',
      label: 'Имя',
      class: 'col-span-1 md:col-span-1',
      validationRules: [ValidationRuleType.REQUIRED]
    },
    {
      type: FormFieldType.TEXT,
      key: 'lastName',
      label: 'Фамилия',
      class: 'col-span-1 md:col-span-1',
      validationRules: [ValidationRuleType.REQUIRED]
    }
  ],
  // Полная ширина
  [
    {
      type: FormFieldType.TEXT,
      key: 'email',
      label: 'Email',
      class: 'col-span-1 md:col-span-2',
      validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.EMAIL]
    }
  ]
];
</script>
```

## 🎨 Стилизация форм

### Кастомные стили

```scss
// В assets/scss/components/form.scss
.app-form-container {
  @apply space-y-6;
}

.app-form-row {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.app-form-col {
  @apply space-y-2;
}

.form-field {
  @apply relative;
  
  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }
  
  .form-input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md;
    @apply focus:ring-2 focus:ring-purple-500 focus:border-purple-500;
    @apply transition-colors duration-200;
    
    &.error {
      @apply border-red-500 focus:ring-red-500 focus:border-red-500;
    }
  }
  
  .form-error {
    @apply text-sm text-red-600 mt-1;
  }
}
```

## 🧪 Тестирование форм

### Unit тесты

```typescript
import { mount } from '@vue/test-utils';
import AppForm from '@/components/form/AppForm.vue';
import { FormFieldType, ValidationRuleType } from '@/types/form';

describe('AppForm', () => {
  it('validates required fields', async () => {
    const fields: FormField[][] = [
      [
        {
          type: FormFieldType.TEXT,
          key: 'name',
          label: 'Имя',
          validationRules: [ValidationRuleType.REQUIRED]
        }
      ]
    ];

    const wrapper = mount(AppForm, {
      props: {
        fields,
        submitAction: jest.fn()
      }
    });

    // Попытка отправки пустой формы
    await wrapper.find('form').trigger('submit');
    
    // Проверка наличия ошибки
    expect(wrapper.text()).toContain('Обязательное поле');
  });
});
```

## 🚀 Лучшие практики

### 1. Структура данных
- Используйте типизированные интерфейсы
- Группируйте связанные поля в массивы
- Предоставляйте понятные ключи для полей

### 2. Валидация
- Валидируйте на клиенте и сервере
- Предоставляйте понятные сообщения об ошибках
- Используйте кастомные правила для специфичной логики

### 3. UX/UI
- Показывайте состояние загрузки
- Предоставляйте обратную связь пользователю
- Используйте адаптивный дизайн

### 4. Производительность
- Ленивая загрузка тяжелых компонентов
- Оптимизация перерендеров
- Кэширование данных форм

---

Система форм обеспечивает гибкий и типобезопасный способ создания сложных форм с минимальными усилиями. 