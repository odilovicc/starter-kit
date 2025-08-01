# TypeScript типы и интерфейсы

## Обзор

Nuxt 3 Starter Kit использует строгую типизацию TypeScript для обеспечения типобезопасности и улучшения разработки. Все компоненты, API и данные имеют четко определенные типы.

## 📁 Структура типов

```
types/
├── api.ts      # Типы для API
├── auth.ts     # Типы аутентификации
├── form.ts     # Типы форм
├── helpers.ts  # Вспомогательные типы
└── router.ts   # Типы роутинга
```

## 🔐 Аутентификация (auth.ts)

### IAuthRegisterFields

```typescript
interface IAuthRegisterFields {
  email: string;
  password: string;
  repeat_pass?: string; // Опционально для регистрации
}
```

### IAuthLoginFields

```typescript
interface IAuthLoginFields {
  email: string;
  password: string;
}
```

### IUserData

```typescript
interface IUserData {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### IAuthResponse

```typescript
interface IAuthResponse {
  success: boolean;
  data: {
    access_token: string;
    refresh_token?: string;
    user: IUserData;
  };
  message?: string;
}
```

## 📝 Формы (form.ts)

### FormFieldType

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

### ValidationRuleType

```typescript
export enum ValidationRuleType {
  REQUIRED = 'required',
  EMAIL = 'email',
  PASSWORD = 'password',
  FILE = 'file',
  MULTISELECT = 'multiselect',
}
```

### IDropdownList

```typescript
interface IDropdownList {
  label: string | number;
  value: string | number;
  imageIcon?: string;
  icon?: string;
}
```

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

### FormField

```typescript
type FormField = BaseFormField | SelectFormField | MultiSelectFormField;
```

### FormConfig

```typescript
interface FormConfig {
  fields: FormField[][];
  submitAction: (formData: Record<string, any>) => void;
  formLoading?: boolean;
}
```

## 🌐 API (api.ts)

### IServiceError

```typescript
interface IServiceError {
  status: number;
  message: string;
  messages?: string[];
  errors?: Record<string, string[]>;
}
```

### IApiResponse

```typescript
interface IApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}
```

### IApiRequest

```typescript
interface IApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}
```

### IApiConfig

```typescript
interface IApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  withCredentials: boolean;
}
```

## 🛠 Вспомогательные типы (helpers.ts)

### IAnyObject

```typescript
interface IAnyObject {
  [key: string]: any;
}
```

### INullable

```typescript
type INullable<T> = T | null;
```

### IOptional

```typescript
type IOptional<T> = T | undefined;
```

### IKeyValue

```typescript
interface IKeyValue<T = any> {
  key: string;
  value: T;
}
```

### ISelectOption

```typescript
interface ISelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string;
}
```

### IPagination

```typescript
interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

### IPaginatedResponse

```typescript
interface IPaginatedResponse<T> {
  data: T[];
  pagination: IPagination;
}
```

## 🛣 Роутинг (router.ts)

### IRouteMeta

```typescript
interface IRouteMeta {
  title?: string;
  description?: string;
  requiresAuth?: boolean;
  requiresVerification?: boolean;
  layout?: string;
  middleware?: string[];
}
```

### IRouteConfig

```typescript
interface IRouteConfig {
  path: string;
  name: string;
  component: string;
  meta: IRouteMeta;
  children?: IRouteConfig[];
}
```

## 🎯 Компонентные типы

### ButtonType

```typescript
type ButtonType = 
  | "primary" 
  | "info" 
  | "success" 
  | "warning" 
  | "danger" 
  | "outlined" 
  | "text-link" 
  | "danger-link";
```

### ButtonSize

```typescript
type ButtonSize = "sm" | "md" | "lg" | "xl" | "2xl" | "custom";
```

### IconSize

```typescript
type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
```

### DialogSize

```typescript
type DialogSize = "sm" | "md" | "lg" | "xl" | "full";
```

## 🔧 Утилитарные типы

### DeepPartial

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### RequiredFields

```typescript
type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
```

### OptionalFields

```typescript
type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

### EventHandler

```typescript
type EventHandler<T = Event> = (event: T) => void;
```

### AsyncFunction

```typescript
type AsyncFunction<T = any, R = any> = (params: T) => Promise<R>;
```

## 📋 Примеры использования

### Типизированные props

```vue
<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  items: ISelectOption[];
  loading?: boolean;
  onSelect?: (item: ISelectOption) => void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  description: ''
});

// Типизированные события
const emit = defineEmits<{
  select: [item: ISelectOption];
  close: [];
  update: [value: string];
}>();
</script>
```

### Типизированные composables

```typescript
// composable/useApi.ts
export const useApi = () => {
  const fetchData = async <T>(
    endpoint: string,
    options?: IApiRequest
  ): Promise<IApiResponse<T>> => {
    // Реализация
  };

  const postData = async <T, R>(
    endpoint: string,
    data: T
  ): Promise<IApiResponse<R>> => {
    // Реализация
  };

  return {
    fetchData,
    postData
  };
};
```

### Типизированные stores

```typescript
// stores/user.ts
interface UserState {
  user: IUserData | null;
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', () => {
  const user = ref<IUserData | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchUser = async (id: string): Promise<void> => {
    loading.value = true;
    try {
      const response = await $fetch<IApiResponse<IUserData>>(`/api/users/${id}`);
      user.value = response.data;
    } catch (err) {
      error.value = (err as IServiceError).message;
    } finally {
      loading.value = false;
    }
  };

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    fetchUser
  };
});
```

### Типизированные формы

```vue
<script setup lang="ts">
import { FormFieldType, ValidationRuleType } from '~/types/form';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string[];
}

const formFields: FormField[][] = [
  [
    {
      type: FormFieldType.TEXT,
      key: 'firstName',
      label: 'Имя',
      validationRules: [ValidationRuleType.REQUIRED],
      params: {
        placeholder: 'Введите имя'
      }
    },
    {
      type: FormFieldType.TEXT,
      key: 'lastName',
      label: 'Фамилия',
      validationRules: [ValidationRuleType.REQUIRED],
      params: {
        placeholder: 'Введите фамилию'
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
        type: 'email',
        placeholder: 'example@email.com'
      }
    }
  ],
  [
    {
      type: FormFieldType.SELECT,
      key: 'role',
      label: 'Роль',
      validationRules: [ValidationRuleType.REQUIRED],
      list: [
        { label: 'Администратор', value: 'admin' },
        { label: 'Пользователь', value: 'user' },
        { label: 'Модератор', value: 'moderator' }
      ]
    },
    {
      type: FormFieldType.MULTISELECT,
      key: 'department',
      label: 'Отделы',
      validationRules: [ValidationRuleType.MULTISELECT],
      list: [
        { label: 'IT', value: 'it' },
        { label: 'Маркетинг', value: 'marketing' },
        { label: 'Продажи', value: 'sales' }
      ],
      display: 'chip',
      filter: true
    }
  ]
];

const handleSubmit = async (formData: Record<string, any>) => {
  const userData = formData as UserFormData;
  // Обработка данных
};
</script>
```

## 🧪 Тестирование типов

### Type Guards

```typescript
// utils/typeGuards.ts
export const isFormField = (obj: any): obj is FormField => {
  return obj && typeof obj === 'object' && 'type' in obj && 'key' in obj;
};

export const isSelectField = (field: FormField): field is SelectFormField => {
  return field.type === FormFieldType.SELECT;
};

export const isMultiSelectField = (field: FormField): field is MultiSelectFormField => {
  return field.type === FormFieldType.MULTISELECT;
};

export const isApiResponse = <T>(obj: any): obj is IApiResponse<T> => {
  return obj && typeof obj === 'object' && 'success' in obj && 'data' in obj;
};
```

### Type Assertions

```typescript
// Безопасные type assertions
const assertIsUserData = (data: any): IUserData => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid user data');
  }
  
  if (!data.id || !data.email) {
    throw new Error('Missing required user fields');
  }
  
  return data as IUserData;
};

// Использование
const userData = assertIsUserData(apiResponse.data);
```

## 🚀 Лучшие практики

### 1. Строгая типизация
- Используйте строгие типы вместо `any`
- Определяйте интерфейсы для всех структур данных
- Используйте union types для ограниченных значений

### 2. Переиспользование типов
- Создавайте базовые интерфейсы
- Используйте extends для наследования
- Применяйте utility types

### 3. Документация
- Комментируйте сложные типы
- Используйте JSDoc для описания интерфейсов
- Приводите примеры использования

### 4. Валидация
- Используйте type guards для runtime проверок
- Валидируйте данные на границах API
- Применяйте zod или joi для схем валидации

### 5. Производительность
- Избегайте избыточной типизации
- Используйте conditional types осторожно
- Оптимизируйте сложные типы

## 🔧 Конфигурация TypeScript

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
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

---

Строгая типизация TypeScript обеспечивает надежность кода, улучшает разработку и предотвращает множество ошибок на этапе компиляции. 