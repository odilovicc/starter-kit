# API и Composables

## Обзор

Nuxt 3 Starter Kit предоставляет мощную систему для работы с API через composables. Система построена на основе `$fetch` с типизацией и обработкой ошибок.

## 🏗 Архитектура API

### Основные компоненты

- **API Composable** - Основной composable для работы с API
- **Auth Integration** - Интеграция с системой аутентификации
- **Error Handling** - Централизованная обработка ошибок
- **Type Safety** - Полная типизация запросов и ответов

## 🔧 API Composable

### Основной composable

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

### Типизированная версия

```typescript
// composable/useTypedApi.ts
export const useTypedApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  
  const fetchData = async <T>(
    endpoint: string,
    options?: IApiRequest
  ): Promise<IApiResponse<T>> => {
    const token = authStore.getToken();
    
    const requestOptions: RequestInit = {
      method: options?.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers
      }
    };
    
    if (options?.method !== 'GET' && options?.data) {
      requestOptions.body = JSON.stringify(options.data);
    }
    
    const url = new URL(`${config.public.apiBaseUrl}${endpoint}`);
    
    // Добавление query параметров
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    
    const response = await fetch(url.toString(), requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    return response.json();
  };
  
  const get = <T>(endpoint: string, params?: Record<string, any>) =>
    fetchData<T>(endpoint, { method: 'GET', params });
  
  const post = <T, R>(endpoint: string, data: T) =>
    fetchData<R>(endpoint, { method: 'POST', data });
  
  const put = <T, R>(endpoint: string, data: T) =>
    fetchData<R>(endpoint, { method: 'PUT', data });
  
  const del = <T>(endpoint: string) =>
    fetchData<T>(endpoint, { method: 'DELETE' });
  
  const patch = <T, R>(endpoint: string, data: T) =>
    fetchData<R>(endpoint, { method: 'PATCH', data });
  
  return {
    fetchData,
    get,
    post,
    put,
    delete: del,
    patch
  };
};
```

## 📡 HTTP методы

### GET запросы

```typescript
// Получение списка пользователей
const { data: users } = await $fetch<IApiResponse<IUserData[]>>('/api/users');

// С параметрами
const { data: users } = await $fetch<IApiResponse<IUserData[]>>('/api/users', {
  query: {
    page: 1,
    limit: 10,
    search: 'john'
  }
});

// С типизированным API
const api = useTypedApi();
const response = await api.get<IUserData[]>('/api/users', {
  page: 1,
  limit: 10
});
```

### POST запросы

```typescript
// Создание пользователя
const newUser = await $fetch<IApiResponse<IUserData>>('/api/users', {
  method: 'POST',
  body: {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  }
});

// С типизированным API
const api = useTypedApi();
const response = await api.post<ICreateUserData, IUserData>('/api/users', {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
});
```

### PUT запросы

```typescript
// Обновление пользователя
const updatedUser = await $fetch<IApiResponse<IUserData>>(`/api/users/${userId}`, {
  method: 'PUT',
  body: {
    name: 'John Updated',
    role: 'admin'
  }
});

// С типизированным API
const api = useTypedApi();
const response = await api.put<IUpdateUserData, IUserData>(`/api/users/${userId}`, {
  name: 'John Updated',
  role: 'admin'
});
```

### DELETE запросы

```typescript
// Удаление пользователя
await $fetch(`/api/users/${userId}`, {
  method: 'DELETE'
});

// С типизированным API
const api = useTypedApi();
await api.delete(`/api/users/${userId}`);
```

## 🔐 Аутентификация

### Автоматическое добавление токенов

```typescript
// API автоматически добавляет токен аутентификации
const api = useTypedApi();

// Токен будет добавлен в заголовок Authorization
const userProfile = await api.get<IUserData>('/api/auth/profile');
```

### Обработка 401 ошибок

```typescript
// Автоматический logout при истечении токена
try {
  const data = await api.get('/api/protected-endpoint');
} catch (error) {
  if (error.message === 'Unauthorized') {
    // Пользователь автоматически разлогинен
    // Перенаправление на страницу входа
    $router.push('/auth/login');
  }
}
```

## 🚨 Обработка ошибок

### Централизованная обработка

```typescript
// composable/useErrorHandler.ts
export const useErrorHandler = () => {
  const handleApiError = (error: any) => {
    if (error.status === 400) {
      return 'Неверный запрос';
    }
    
    if (error.status === 401) {
      return 'Необходима авторизация';
    }
    
    if (error.status === 403) {
      return 'Доступ запрещен';
    }
    
    if (error.status === 404) {
      return 'Ресурс не найден';
    }
    
    if (error.status === 500) {
      return 'Внутренняя ошибка сервера';
    }
    
    return 'Произошла ошибка';
  };
  
  const showError = (message: string) => {
    // Показать уведомление об ошибке
    console.error(message);
  };
  
  return {
    handleApiError,
    showError
  };
};
```

### Использование в компонентах

```vue
<script setup lang="ts">
const api = useTypedApi();
const { handleApiError, showError } = useErrorHandler();

const fetchUsers = async () => {
  try {
    const response = await api.get<IUserData[]>('/api/users');
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    showError(errorMessage);
    throw error;
  }
};
</script>
```

## 📊 Пагинация

### Типы для пагинации

```typescript
interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface IPaginatedResponse<T> {
  data: T[];
  pagination: IPagination;
}
```

### Composable для пагинации

```typescript
// composable/usePagination.ts
export const usePagination = <T>() => {
  const data = ref<T[]>([]);
  const pagination = ref<IPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const fetchPage = async (
    endpoint: string,
    params?: Record<string, any>
  ) => {
    loading.value = true;
    error.value = null;
    
    try {
      const api = useTypedApi();
      const response = await api.get<IPaginatedResponse<T>>(endpoint, {
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...params
      });
      
      data.value = response.data.data;
      pagination.value = response.data.pagination;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };
  
  const nextPage = () => {
    if (pagination.value.page < pagination.value.totalPages) {
      pagination.value.page++;
    }
  };
  
  const prevPage = () => {
    if (pagination.value.page > 1) {
      pagination.value.page--;
    }
  };
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.value.totalPages) {
      pagination.value.page = page;
    }
  };
  
  return {
    data: readonly(data),
    pagination: readonly(pagination),
    loading: readonly(loading),
    error: readonly(error),
    fetchPage,
    nextPage,
    prevPage,
    goToPage
  };
};
```

### Использование пагинации

```vue
<template>
  <div>
    <!-- Список данных -->
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-for="item in data" :key="item.id">
        {{ item.name }}
      </div>
    </div>
    
    <!-- Пагинация -->
    <div class="flex gap-2 mt-4">
      <AppButton 
        label="Предыдущая" 
        @click="prevPage"
        :disabled="pagination.page === 1"
      />
      <span>{{ pagination.page }} из {{ pagination.totalPages }}</span>
      <AppButton 
        label="Следующая" 
        @click="nextPage"
        :disabled="pagination.page === pagination.totalPages"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, pagination, loading, error, fetchPage, nextPage, prevPage } = usePagination<IUserData>();

// Загрузка первой страницы
onMounted(() => {
  fetchPage('/api/users');
});

// Загрузка при изменении страницы
watch(() => pagination.page, () => {
  fetchPage('/api/users');
});
</script>
```

## 🔄 Кэширование

### Composable для кэширования

```typescript
// composable/useCache.ts
export const useCache = <T>() => {
  const cache = new Map<string, { data: T; timestamp: number }>();
  const TTL = 5 * 60 * 1000; // 5 минут
  
  const get = (key: string): T | null => {
    const item = cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > TTL) {
      cache.delete(key);
      return null;
    }
    
    return item.data;
  };
  
  const set = (key: string, data: T) => {
    cache.set(key, { data, timestamp: Date.now() });
  };
  
  const clear = () => {
    cache.clear();
  };
  
  const remove = (key: string) => {
    cache.delete(key);
  };
  
  return {
    get,
    set,
    clear,
    remove
  };
};
```

### Использование кэша

```typescript
// composable/useCachedApi.ts
export const useCachedApi = () => {
  const cache = useCache();
  const api = useTypedApi();
  
  const getCached = async <T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> => {
    const cacheKey = `${endpoint}?${new URLSearchParams(params).toString()}`;
    
    // Проверка кэша
    const cached = cache.get<T>(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Запрос к API
    const response = await api.get<T>(endpoint, params);
    cache.set(cacheKey, response.data);
    
    return response.data;
  };
  
  return {
    getCached
  };
};
```

## 📡 WebSocket интеграция

### Composable для WebSocket

```typescript
// composable/useWebSocket.ts
export const useWebSocket = (url: string) => {
  const socket = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const messages = ref<any[]>([]);
  
  const connect = () => {
    socket.value = new WebSocket(url);
    
    socket.value.onopen = () => {
      isConnected.value = true;
    };
    
    socket.value.onmessage = (event) => {
      const data = JSON.parse(event.data);
      messages.value.push(data);
    };
    
    socket.value.onclose = () => {
      isConnected.value = false;
    };
    
    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };
  
  const disconnect = () => {
    if (socket.value) {
      socket.value.close();
      socket.value = null;
    }
  };
  
  const send = (data: any) => {
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify(data));
    }
  };
  
  onUnmounted(() => {
    disconnect();
  });
  
  return {
    isConnected: readonly(isConnected),
    messages: readonly(messages),
    connect,
    disconnect,
    send
  };
};
```

## 🧪 Тестирование API

### Mock API для тестов

```typescript
// tests/mocks/api.ts
export const mockApiResponse = <T>(data: T): IApiResponse<T> => ({
  success: true,
  data,
  message: 'Success'
});

export const mockApiError = (message: string): IServiceError => ({
  status: 400,
  message,
  messages: [message]
});

// Mock для $fetch
export const mockFetch = (response: any) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(response)
  });
};
```

### Тесты composables

```typescript
// tests/composables/useApi.test.ts
import { describe, it, expect, vi } from 'vitest';
import { useTypedApi } from '@/composable/useTypedApi';

describe('useTypedApi', () => {
  it('should make GET request', async () => {
    const api = useTypedApi();
    const mockResponse = { success: true, data: { id: 1, name: 'Test' } };
    
    mockFetch(mockResponse);
    
    const result = await api.get('/api/test');
    expect(result).toEqual(mockResponse);
  });
  
  it('should handle errors', async () => {
    const api = useTypedApi();
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404
    });
    
    await expect(api.get('/api/test')).rejects.toThrow();
  });
});
```

## 🚀 Лучшие практики

### 1. Типизация
- Всегда типизируйте API запросы и ответы
- Используйте интерфейсы для структур данных
- Применяйте generic типы для переиспользуемых функций

### 2. Обработка ошибок
- Централизуйте обработку ошибок
- Предоставляйте понятные сообщения пользователю
- Логируйте ошибки для отладки

### 3. Производительность
- Используйте кэширование для статических данных
- Применяйте пагинацию для больших списков
- Оптимизируйте размер запросов

### 4. Безопасность
- Валидируйте данные на клиенте и сервере
- Используйте HTTPS для всех запросов
- Защищайте от CSRF атак

### 5. Масштабируемость
- Создавайте переиспользуемые composables
- Разделяйте логику на модули
- Используйте конфигурацию для разных окружений

---

API система обеспечивает надежную и типобезопасную работу с серверными данными, следуя современным стандартам разработки. 