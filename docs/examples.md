# Примеры использования

## Обзор

В этом разделе представлены практические примеры использования Nuxt 3 Starter Kit для создания различных компонентов и страниц.

## 🏠 Главная страница

### Простая главная страница

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">Моё приложение</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <AppButton 
              v-if="!isAuthenticated"
              label="Войти" 
              type="primary"
              @click="$router.push('/auth/login')"
            />
            <UserMenu v-else />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
          <div class="text-center">
            <AppIcon icon="pi-home" size="3xl" class="text-gray-400 mb-4" />
            <h2 class="text-xl font-semibold text-gray-600">
              Добро пожаловать в приложение
            </h2>
            <p class="text-gray-500 mt-2">
              Начните создавать свой контент
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>
```

## 👤 Профиль пользователя

### Страница профиля с формой редактирования

```vue
<template>
  <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Заголовок -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Профиль пользователя</h1>
        <p class="mt-2 text-gray-600">Управляйте своими данными</p>
      </div>

      <!-- Информация о пользователе -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <img 
              :src="userData?.avatar || '/default-avatar.png'" 
              alt="Avatar"
              class="h-16 w-16 rounded-full object-cover"
            />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              {{ userData?.name || 'Пользователь' }}
            </h2>
            <p class="text-gray-600">{{ userData?.email }}</p>
            <p class="text-sm text-gray-500">
              Участник с {{ formatDate(userData?.createdAt) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Форма редактирования -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Редактировать профиль
        </h3>
        
        <AppForm
          :fields="profileFields"
          :submit-action="handleUpdateProfile"
          :form-loading="loading"
        >
          <template #footer="{ submitAction, disabled, loading }">
            <div class="flex justify-end space-x-3">
              <AppButton
                label="Отмена"
                type="outlined"
                @click="resetForm"
              />
              <AppButton
                label="Сохранить"
                type="primary"
                :loading="loading"
                :disabled="disabled"
                @click="submitAction"
              />
            </div>
          </template>
        </AppForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormFieldType, ValidationRuleType } from '~/types/form';

definePageMeta({
  middleware: ['auth']
});

const authStore = useAuthStore();
const loading = ref(false);

const userData = computed(() => authStore.userData);

const profileFields: FormField[][] = [
  [
    {
      type: FormFieldType.TEXT,
      key: 'name',
      label: 'Имя',
      validationRules: [ValidationRuleType.REQUIRED],
      initialValue: userData.value?.name || '',
      params: {
        placeholder: 'Введите ваше имя'
      }
    },
    {
      type: FormFieldType.TEXT,
      key: 'email',
      label: 'Email',
      validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.EMAIL],
      initialValue: userData.value?.email || '',
      params: {
        type: 'email',
        placeholder: 'example@email.com',
        disabled: true // Email нельзя изменить
      }
    }
  ],
  [
    {
      type: FormFieldType.TEXTAREA,
      key: 'bio',
      label: 'О себе',
      initialValue: userData.value?.bio || '',
      params: {
        placeholder: 'Расскажите о себе...',
        rows: 4,
        maxlength: 500
      }
    }
  ],
  [
    {
      type: FormFieldType.FILE,
      key: 'avatar',
      label: 'Аватар',
      params: {
        accept: 'image/*',
        maxFileSize: 5 * 1024 * 1024, // 5MB
        multiple: false
      }
    }
  ]
];

const handleUpdateProfile = async (formData: Record<string, any>) => {
  loading.value = true;
  
  try {
    const api = useTypedApi();
    const response = await api.put(`/api/users/profile`, formData);
    
    // Обновляем данные в store
    await authStore.getUserData(true);
    
    // Показываем уведомление об успехе
    console.log('Профиль обновлен');
    
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  // Сброс формы к исходным значениям
  profileFields.flat().forEach(field => {
    field.initialValue = userData.value?.[field.key] || '';
  });
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ru-RU');
};
</script>
```

## 📋 Список пользователей

### Страница со списком и пагинацией

```vue
<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Заголовок -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Пользователи</h1>
          <p class="mt-2 text-gray-600">
            Всего пользователей: {{ pagination.total }}
          </p>
        </div>
        
        <AppButton
          label="Добавить пользователя"
          type="primary"
          prefixIcon="pi-plus"
          @click="showCreateDialog = true"
        />
      </div>

      <!-- Фильтры -->
      <div class="bg-white shadow rounded-lg p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Поиск
            </label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск по имени или email..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Роль
            </label>
            <AppDropdown
              v-model="selectedRole"
              :options="roleOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Все роли"
              class="w-full"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <AppDropdown
              v-model="selectedStatus"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Все статусы"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Таблица -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <AppIcon icon="pi-spinner" class="animate-spin text-2xl text-gray-400" />
          <p class="mt-2 text-gray-600">Загрузка пользователей...</p>
        </div>
        
        <div v-else-if="error" class="p-8 text-center">
          <AppIcon icon="pi-exclamation-triangle" class="text-2xl text-red-400" />
          <p class="mt-2 text-red-600">{{ error }}</p>
          <AppButton
            label="Повторить"
            type="primary"
            @click="fetchUsers"
            class="mt-4"
          />
        </div>
        
        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Роль
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата регистрации
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in data" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img
                      :src="user.avatar || '/default-avatar.png'"
                      alt="Avatar"
                      class="h-10 w-10 rounded-full object-cover"
                    />
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ user.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getRoleBadgeClass(user.role)">
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getStatusBadgeClass(user.isVerified)">
                    {{ user.isVerified ? 'Подтвержден' : 'Не подтвержден' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <AppDropdown
                    :options="getUserActions(user)"
                    optionLabel="label"
                    optionValue="action"
                    @change="handleUserAction($event, user)"
                  >
                    <template #trigger>
                      <AppButton
                        prefixIcon="pi-ellipsis-v"
                        circle
                        type="outlined"
                        size="sm"
                      />
                    </template>
                  </AppDropdown>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Пагинация -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <AppButton
            label="Предыдущая"
            type="outlined"
            size="sm"
            @click="prevPage"
            :disabled="pagination.page === 1"
          />
          <AppButton
            label="Следующая"
            type="outlined"
            size="sm"
            @click="nextPage"
            :disabled="pagination.page === pagination.totalPages"
          />
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Показано
              <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
              до
              <span class="font-medium">
                {{ Math.min(pagination.page * pagination.limit, pagination.total) }}
              </span>
              из
              <span class="font-medium">{{ pagination.total }}</span>
              результатов
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <AppButton
                label="Предыдущая"
                type="outlined"
                size="sm"
                @click="prevPage"
                :disabled="pagination.page === 1"
              />
              
              <template v-for="page in getPageNumbers()" :key="page">
                <AppButton
                  :label="String(page)"
                  :type="page === pagination.page ? 'primary' : 'outlined'"
                  size="sm"
                  @click="goToPage(page)"
                />
              </template>
              
              <AppButton
                label="Следующая"
                type="outlined"
                size="sm"
                @click="nextPage"
                :disabled="pagination.page === pagination.totalPages"
              />
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Диалог создания пользователя -->
    <AppDialog
      v-model:visible="showCreateDialog"
      header="Создать пользователя"
      style="width: 50vw"
    >
      <AppForm
        :fields="createUserFields"
        :submit-action="handleCreateUser"
        :form-loading="createLoading"
      >
        <template #footer="{ submitAction, disabled, loading }">
          <div class="flex justify-end space-x-3">
            <AppButton
              label="Отмена"
              type="outlined"
              @click="showCreateDialog = false"
            />
            <AppButton
              label="Создать"
              type="primary"
              :loading="loading"
              :disabled="disabled"
              @click="submitAction"
            />
          </div>
        </template>
      </AppForm>
    </AppDialog>
  </div>
</template>

<script setup lang="ts">
import { FormFieldType, ValidationRuleType } from '~/types/form';

definePageMeta({
  middleware: ['auth']
});

// Состояние
const showCreateDialog = ref(false);
const createLoading = ref(false);
const searchQuery = ref('');
const selectedRole = ref(null);
const selectedStatus = ref(null);

// Пагинация
const { data, pagination, loading, error, fetchPage, nextPage, prevPage, goToPage } = usePagination<IUserData>();

// Опции для фильтров
const roleOptions = [
  { label: 'Все роли', value: null },
  { label: 'Администратор', value: 'admin' },
  { label: 'Пользователь', value: 'user' },
  { label: 'Модератор', value: 'moderator' }
];

const statusOptions = [
  { label: 'Все статусы', value: null },
  { label: 'Подтвержден', value: true },
  { label: 'Не подтвержден', value: false }
];

// Поля формы создания пользователя
const createUserFields: FormField[][] = [
  [
    {
      type: FormFieldType.TEXT,
      key: 'name',
      label: 'Имя',
      validationRules: [ValidationRuleType.REQUIRED],
      params: {
        placeholder: 'Введите имя пользователя'
      }
    },
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
      type: FormFieldType.PASSWORD,
      key: 'password',
      label: 'Пароль',
      validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.PASSWORD],
      params: {
        placeholder: 'Минимум 6 символов'
      }
    },
    {
      type: FormFieldType.SELECT,
      key: 'role',
      label: 'Роль',
      validationRules: [ValidationRuleType.REQUIRED],
      list: [
        { label: 'Пользователь', value: 'user' },
        { label: 'Модератор', value: 'moderator' },
        { label: 'Администратор', value: 'admin' }
      ]
    }
  ]
];

// Методы
const fetchUsers = () => {
  const params: Record<string, any> = {};
  
  if (searchQuery.value) params.search = searchQuery.value;
  if (selectedRole.value) params.role = selectedRole.value;
  if (selectedStatus.value !== null) params.isVerified = selectedStatus.value;
  
  fetchPage('/api/users', params);
};

const handleCreateUser = async (formData: Record<string, any>) => {
  createLoading.value = true;
  
  try {
    const api = useTypedApi();
    await api.post('/api/users', formData);
    
    showCreateDialog.value = false;
    fetchUsers(); // Обновляем список
    
    console.log('Пользователь создан');
  } catch (error) {
    console.error('Ошибка создания пользователя:', error);
  } finally {
    createLoading.value = false;
  }
};

const handleUserAction = (action: string, user: IUserData) => {
  switch (action) {
    case 'edit':
      $router.push(`/users/${user.id}/edit`);
      break;
    case 'delete':
      if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        deleteUser(user.id);
      }
      break;
  }
};

const deleteUser = async (userId: string) => {
  try {
    const api = useTypedApi();
    await api.delete(`/api/users/${userId}`);
    fetchUsers(); // Обновляем список
    console.log('Пользователь удален');
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
  }
};

const getUserActions = (user: IUserData) => {
  const actions = [
    { label: 'Редактировать', action: 'edit' }
  ];
  
  // Администраторы не могут удалить сами себя
  if (user.id !== authStore.userData?.id) {
    actions.push({ label: 'Удалить', action: 'delete' });
  }
  
  return actions;
};

const getRoleLabel = (role: string) => {
  const labels = {
    admin: 'Администратор',
    moderator: 'Модератор',
    user: 'Пользователь'
  };
  return labels[role] || role;
};

const getRoleBadgeClass = (role: string) => {
  const classes = {
    admin: 'bg-red-100 text-red-800',
    moderator: 'bg-yellow-100 text-yellow-800',
    user: 'bg-green-100 text-green-800'
  };
  return classes[role] || 'bg-gray-100 text-gray-800';
};

const getStatusBadgeClass = (isVerified: boolean) => {
  return isVerified 
    ? 'bg-green-100 text-green-800'
    : 'bg-gray-100 text-gray-800';
};

const getPageNumbers = () => {
  const pages = [];
  const start = Math.max(1, pagination.page - 2);
  const end = Math.min(pagination.totalPages, pagination.page + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU');
};

// Watchers
watch([searchQuery, selectedRole, selectedStatus], () => {
  pagination.page = 1; // Сброс на первую страницу при изменении фильтров
  fetchUsers();
});

// Инициализация
onMounted(() => {
  fetchUsers();
});
</script>
```

## 📊 Дашборд

### Административная панель

```vue
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div class="flex items-center justify-center h-16 px-4 border-b">
        <h1 class="text-xl font-bold text-gray-900">Админ панель</h1>
      </div>
      
      <nav class="mt-8">
        <div class="px-4 space-y-2">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              $route.path === item.path
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <AppIcon :icon="item.icon" class="mr-3" />
            {{ item.label }}
          </NuxtLink>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="flex items-center justify-between px-6 py-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ currentPageTitle }}</h2>
          </div>
          
          <div class="flex items-center space-x-4">
            <AppButton
              prefixIcon="pi-bell"
              circle
              type="outlined"
              @click="showNotifications = true"
            />
            <UserMenu />
          </div>
        </div>
      </header>

      <!-- Dashboard Content -->
      <main class="p-6">
        <!-- Статистика -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-white rounded-lg shadow p-6"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 rounded-md flex items-center justify-center"
                     :class="stat.bgColor">
                  <AppIcon :icon="stat.icon" class="text-white" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">{{ stat.label }}</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stat.value }}</p>
              </div>
            </div>
            <div class="mt-4">
              <span class="text-sm"
                    :class="stat.trend > 0 ? 'text-green-600' : 'text-red-600'">
                <AppIcon 
                  :icon="stat.trend > 0 ? 'pi-arrow-up' : 'pi-arrow-down'"
                  class="inline mr-1"
                />
                {{ Math.abs(stat.trend) }}%
              </span>
              <span class="text-sm text-gray-500 ml-1">с прошлого месяца</span>
            </div>
          </div>
        </div>

        <!-- Графики и таблицы -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Последние пользователи -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Последние пользователи</h3>
            </div>
            <div class="p-6">
              <div v-if="recentUsersLoading" class="text-center py-4">
                <AppIcon icon="pi-spinner" class="animate-spin text-2xl text-gray-400" />
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="user in recentUsers"
                  :key="user.id"
                  class="flex items-center space-x-3"
                >
                  <img
                    :src="user.avatar || '/default-avatar.png'"
                    alt="Avatar"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                    <p class="text-sm text-gray-500">{{ user.email }}</p>
                  </div>
                  <span class="text-sm text-gray-500">
                    {{ formatDate(user.createdAt) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Активность -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Активность</h3>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="activity in recentActivity"
                  :key="activity.id"
                  class="flex items-start space-x-3"
                >
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <AppIcon :icon="activity.icon" class="text-purple-600" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-900">{{ activity.message }}</p>
                    <p class="text-sm text-gray-500">{{ formatDate(activity.timestamp) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Уведомления -->
    <AppDialog
      v-model:visible="showNotifications"
      header="Уведомления"
      style="width: 40vw"
    >
      <div class="space-y-4">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="flex items-start space-x-3 p-3 rounded-lg"
          :class="getNotificationClass(notification.type)"
        >
          <AppIcon 
            :icon="getNotificationIcon(notification.type)"
            class="mt-1"
          />
          <div class="flex-1">
            <p class="text-sm font-medium">{{ notification.title }}</p>
            <p class="text-sm">{{ notification.message }}</p>
            <p class="text-xs text-gray-500 mt-1">
              {{ formatDate(notification.timestamp) }}
            </p>
          </div>
        </div>
      </div>
    </AppDialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
});

// Состояние
const showNotifications = ref(false);
const recentUsersLoading = ref(false);
const recentUsers = ref<IUserData[]>([]);
const recentActivity = ref([]);
const notifications = ref([]);

// Меню
const menuItems = [
  { label: 'Дашборд', path: '/admin', icon: 'pi-home' },
  { label: 'Пользователи', path: '/admin/users', icon: 'pi-users' },
  { label: 'Настройки', path: '/admin/settings', icon: 'pi-cog' },
  { label: 'Логи', path: '/admin/logs', icon: 'pi-file' }
];

// Статистика
const stats = ref([
  {
    label: 'Всего пользователей',
    value: '1,234',
    trend: 12,
    icon: 'pi-users',
    bgColor: 'bg-blue-500'
  },
  {
    label: 'Активные сессии',
    value: '89',
    trend: -5,
    icon: 'pi-clock',
    bgColor: 'bg-green-500'
  },
  {
    label: 'Новые регистрации',
    value: '23',
    trend: 8,
    icon: 'pi-user-plus',
    bgColor: 'bg-purple-500'
  },
  {
    label: 'Ошибки системы',
    value: '2',
    trend: -50,
    icon: 'pi-exclamation-triangle',
    bgColor: 'bg-red-500'
  }
]);

// Computed
const currentPageTitle = computed(() => {
  const currentItem = menuItems.find(item => item.path === $route.path);
  return currentItem?.label || 'Дашборд';
});

// Методы
const fetchRecentUsers = async () => {
  recentUsersLoading.value = true;
  try {
    const api = useTypedApi();
    const response = await api.get<IUserData[]>('/api/users', {
      limit: 5,
      sort: 'createdAt',
      order: 'desc'
    });
    recentUsers.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
  } finally {
    recentUsersLoading.value = false;
  }
};

const fetchRecentActivity = async () => {
  try {
    const api = useTypedApi();
    const response = await api.get('/api/admin/activity', {
      limit: 10
    });
    recentActivity.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки активности:', error);
  }
};

const fetchNotifications = async () => {
  try {
    const api = useTypedApi();
    const response = await api.get('/api/admin/notifications');
    notifications.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки уведомлений:', error);
  }
};

const getNotificationClass = (type: string) => {
  const classes = {
    info: 'bg-blue-50',
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    error: 'bg-red-50'
  };
  return classes[type] || 'bg-gray-50';
};

const getNotificationIcon = (type: string) => {
  const icons = {
    info: 'pi-info-circle',
    success: 'pi-check-circle',
    warning: 'pi-exclamation-triangle',
    error: 'pi-times-circle'
  };
  return icons[type] || 'pi-info-circle';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Инициализация
onMounted(() => {
  fetchRecentUsers();
  fetchRecentActivity();
  fetchNotifications();
});
</script>
```

## 🚀 Лучшие практики

### 1. Структура компонентов
- Разделяйте логику на composables
- Используйте типизированные props и events
- Следуйте принципу единственной ответственности

### 2. Производительность
- Используйте ленивую загрузку для тяжелых компонентов
- Оптимизируйте перерендеры с помощью `v-memo`
- Применяйте виртуализацию для больших списков

### 3. UX/UI
- Предоставляйте обратную связь пользователю
- Используйте скелетоны для загрузки
- Обрабатывайте все состояния (загрузка, ошибка, пусто)

### 4. Безопасность
- Валидируйте данные на клиенте и сервере
- Используйте middleware для защиты маршрутов
- Санитизируйте пользовательский ввод

### 5. Масштабируемость
- Создавайте переиспользуемые компоненты
- Используйте конфигурацию для разных окружений
- Документируйте сложную логику

---

Эти примеры демонстрируют возможности Nuxt 3 Starter Kit для создания полнофункциональных веб-приложений с современным UI/UX. 