# Система аутентификации

## Обзор

Система аутентификации в Nuxt 3 Starter Kit построена на основе Firebase Authentication с использованием JWT токенов. Система предоставляет готовые компоненты для регистрации, входа и управления состоянием пользователя.

## 🏗 Архитектура аутентификации

### Основные компоненты

- **Auth Store** - Управление состоянием аутентификации
- **API Composable** - Работа с аутентификационными endpoints
- **Auth Layout** - Макет для страниц аутентификации
- **Login/Register Pages** - Страницы входа и регистрации

## 🔐 Типы и интерфейсы

### IAuthRegisterFields

```typescript
interface IAuthRegisterFields {
  email: string;
  password: string;
  repeat_pass?: string; // Для регистрации
}
```

### Auth Store State

```typescript
interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  userName: string;
  userData: any;
}
```

## 📦 Auth Store

### Основные методы

```typescript
// Установка токена
const setToken = (new_token: string) => void;

// Получение токена с префиксом
const getToken = (prefix?: string) => string | null;

// Удаление токена
const removeToken = () => void;

// Регистрация пользователя
const registerUser = (payload: IAuthRegisterFields) => Promise<any>;

// Вход пользователя
const loginUser = (payload: IAuthRegisterFields) => Promise<any>;

// Получение данных пользователя
const getUserData = (update?: boolean) => Promise<any>;

// Установка статуса аутентификации
const setAuthenticated = (bol: boolean) => void;
```

### Использование store

```vue
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

// Проверка аутентификации
const isLoggedIn = computed(() => authStore.isAuthenticated);

// Получение данных пользователя
const userName = computed(() => authStore.userName);

// Выход из системы
const logout = () => {
  authStore.removeToken();
  authStore.setAuthenticated(false);
  $router.push('/auth/login');
};
</script>
```

## 🔄 Жизненный цикл аутентификации

### 1. Инициализация приложения

```typescript
// В app.vue или middleware
const authStore = useAuthStore();

// Проверка токена при загрузке
onMounted(async () => {
  if (authStore.accessToken) {
    try {
      await authStore.getUserData();
    } catch (error) {
      // Токен недействителен
      authStore.removeToken();
      authStore.setAuthenticated(false);
    }
  }
});
```

### 2. Процесс входа

```typescript
const handleLogin = async (credentials: IAuthRegisterFields) => {
  try {
    const response = await authStore.loginUser(credentials);
    
    // Токен автоматически сохраняется в store
    // Состояние isAuthenticated обновляется через watch
    
    // Получение данных пользователя
    await authStore.getUserData();
    
    // Перенаправление на главную страницу
    $router.push('/');
    
  } catch (error) {
    console.error('Ошибка входа:', error);
  }
};
```

### 3. Процесс регистрации

```typescript
const handleRegister = async (userData: IAuthRegisterFields) => {
  try {
    // Проверка совпадения паролей
    if (userData.password !== userData.repeat_pass) {
      throw new Error('Пароли не совпадают');
    }
    
    const response = await authStore.registerUser(userData);
    
    // Автоматический вход после регистрации
    await authStore.getUserData();
    
    $router.push('/');
    
  } catch (error) {
    console.error('Ошибка регистрации:', error);
  }
};
```

## 🛡️ Middleware для защиты маршрутов

### Auth Middleware

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  
  // Проверка аутентификации для защищенных маршрутов
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login');
  }
  
  // Проверка верификации (если требуется)
  if (to.meta.requiresVerification && !authStore.isVerified) {
    return navigateTo('/auth/verify');
  }
});
```

### Guest Middleware

```typescript
// middleware/guest.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  
  // Перенаправление аутентифицированных пользователей
  if (authStore.isAuthenticated) {
    return navigateTo('/');
  }
});
```

### Использование middleware

```vue
<script setup lang="ts">
// В pages/protected.vue
definePageMeta({
  middleware: ['auth']
});

// В pages/auth/login.vue
definePageMeta({
  middleware: ['guest']
});
</script>
```

## 📱 Страницы аутентификации

### Страница входа

```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">
          Вход в систему
        </h2>
      </div>
      
      <AppForm
        :fields="loginFields"
        :submit-action="handleLogin"
        :form-loading="loading"
      >
        <template #footer="{ submitAction, disabled, loading }">
          <div class="flex flex-col space-y-3">
            <AppButton
              label="Войти"
              type="primary"
              :loading="loading"
              :disabled="disabled"
              @click="submitAction"
              class="w-full"
            />
            
            <div class="text-center">
              <NuxtLink 
                to="/auth/register"
                class="text-purple-600 hover:text-purple-500"
              >
                Нет аккаунта? Зарегистрироваться
              </NuxtLink>
            </div>
          </div>
        </template>
      </AppForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormFieldType, ValidationRuleType } from '~/types/form';

definePageMeta({
  middleware: ['guest']
});

const loading = ref(false);
const authStore = useAuthStore();

const loginFields: FormField[][] = [
  [
    {
      type: FormFieldType.TEXT,
      key: 'email',
      label: 'Email',
      validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.EMAIL],
      params: {
        placeholder: 'Введите ваш email',
        type: 'email'
      }
    }
  ],
  [
    {
      type: FormFieldType.PASSWORD,
      key: 'password',
      label: 'Пароль',
      validationRules: [ValidationRuleType.REQUIRED],
      params: {
        placeholder: 'Введите ваш пароль'
      }
    }
  ]
];

const handleLogin = async (formData: Record<string, any>) => {
  loading.value = true;
  
  try {
    await authStore.loginUser({
      email: formData.email,
      password: formData.password
    });
    
    await authStore.getUserData();
    $router.push('/');
    
  } catch (error) {
    console.error('Ошибка входа:', error);
    // Показать уведомление об ошибке
  } finally {
    loading.value = false;
  }
};
</script>
```

### Страница регистрации

```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">
          Регистрация
        </h2>
      </div>
      
      <AppForm
        :fields="registerFields"
        :submit-action="handleRegister"
        :form-loading="loading"
      >
        <template #footer="{ submitAction, disabled, loading }">
          <div class="flex flex-col space-y-3">
            <AppButton
              label="Зарегистрироваться"
              type="primary"
              :loading="loading"
              :disabled="disabled"
              @click="submitAction"
              class="w-full"
            />
            
            <div class="text-center">
              <NuxtLink 
                to="/auth/login"
                class="text-purple-600 hover:text-purple-500"
              >
                Уже есть аккаунт? Войти
              </NuxtLink>
            </div>
          </div>
        </template>
      </AppForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormFieldType, ValidationRuleType } from '~/types/form';

definePageMeta({
  middleware: ['guest']
});

const loading = ref(false);
const authStore = useAuthStore();

const registerFields: FormField[][] = [
  [
    {
      type: FormFieldType.TEXT,
      key: 'email',
      label: 'Email',
      validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.EMAIL],
      params: {
        placeholder: 'Введите ваш email',
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
      key: 'repeat_pass',
      label: 'Подтвердите пароль',
      validationRules: [ValidationRuleType.REQUIRED],
      params: {
        placeholder: 'Повторите пароль'
      }
    }
  ]
];

const handleRegister = async (formData: Record<string, any>) => {
  loading.value = true;
  
  try {
    // Проверка совпадения паролей
    if (formData.password !== formData.repeat_pass) {
      throw new Error('Пароли не совпадают');
    }
    
    await authStore.registerUser({
      email: formData.email,
      password: formData.password,
      repeat_pass: formData.repeat_pass
    });
    
    await authStore.getUserData();
    $router.push('/');
    
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    // Показать уведомление об ошибке
  } finally {
    loading.value = false;
  }
};
</script>
```

## 🔧 API интеграция

### Конфигурация API

```typescript
// composable/api.ts
export const AUTH_TOKEN_COOKIE_KEY = 'auth_token';

export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  
  const fetchDataClient = async (
    endpoint: string,
    data: any = {},
    method: string = 'GET'
  ) => {
    const token = authStore.getToken();
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };
    
    if (method !== 'GET' && data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${config.public.apiBaseUrl}${endpoint}`, options);
    
    if (!response.ok) {
      // Обработка ошибок аутентификации
      if (response.status === 401) {
        authStore.removeToken();
        authStore.setAuthenticated(false);
        throw new Error('Unauthorized');
      }
      throw new Error('API Error');
    }
    
    return response.json();
  };
  
  return { fetchDataClient };
};
```

## 🎨 Компоненты UI для аутентификации

### UserMenu компонент

```vue
<template>
  <div class="relative">
    <AppButton
      :label="userName"
      prefixIcon="pi-user"
      type="outlined"
      @click="showMenu = !showMenu"
    />
    
    <AppDropdown
      v-model:visible="showMenu"
      class="absolute right-0 mt-2 w-48"
    >
      <div class="py-1">
        <div class="px-4 py-2 text-sm text-gray-700 border-b">
          {{ userEmail }}
        </div>
        
        <button
          @click="handleProfile"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Профиль
        </button>
        
        <button
          @click="handleLogout"
          class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Выйти
        </button>
      </div>
    </AppDropdown>
  </div>
</template>

<script setup lang="ts">
const showMenu = ref(false);
const authStore = useAuthStore();

const userName = computed(() => authStore.userName);
const userEmail = computed(() => authStore.userData?.email);

const handleProfile = () => {
  showMenu.value = false;
  $router.push('/profile');
};

const handleLogout = () => {
  showMenu.value = false;
  authStore.removeToken();
  authStore.setAuthenticated(false);
  $router.push('/auth/login');
};
</script>
```

## 🔒 Безопасность

### Хранение токенов

```typescript
// Безопасное хранение в localStorage с шифрованием
const accessToken = useStorageAsync<string | null>(
  AUTH_TOKEN_COOKIE_KEY,
  null,
  {
    serializer: {
      read: (value: string) => {
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      },
      write: (value: any) => JSON.stringify(value)
    }
  }
);
```

### Автоматическое обновление токенов

```typescript
// В auth store
const refreshToken = async () => {
  try {
    const response = await fetchDataClient('/auth/refresh', {}, 'POST');
    const newToken = response.data.access_token;
    setToken(newToken);
  } catch (error) {
    // Токен недействителен, выход из системы
    removeToken();
    setAuthenticated(false);
  }
};
```

## 🧪 Тестирование

### Unit тесты для auth store

```typescript
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should set and get token', () => {
    const store = useAuthStore();
    const token = 'test-token';
    
    store.setToken(token);
    expect(store.getToken()).toBe(token);
  });

  it('should remove token', () => {
    const store = useAuthStore();
    store.setToken('test-token');
    store.removeToken();
    
    expect(store.getToken()).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });
});
```

## 🚀 Лучшие практики

### 1. Безопасность
- Используйте HTTPS для всех API запросов
- Храните токены в безопасном месте
- Регулярно обновляйте токены
- Валидируйте данные на клиенте и сервере

### 2. UX/UI
- Показывайте состояние загрузки
- Предоставляйте понятные сообщения об ошибках
- Используйте автоматическое перенаправление
- Сохраняйте состояние формы при ошибках

### 3. Производительность
- Кэшируйте данные пользователя
- Используйте ленивую загрузку для защищенных маршрутов
- Оптимизируйте запросы к API

### 4. Масштабируемость
- Используйте типизированные интерфейсы
- Разделяйте логику на composables
- Следуйте принципам SOLID

---

Система аутентификации обеспечивает безопасный и удобный способ управления пользователями в приложении. 