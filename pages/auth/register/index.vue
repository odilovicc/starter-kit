<template>
  <AppForm
    :fields="registerFields"
    :submit-action="onRegister"
    :form-loading="isLoading"
  >
    <template #footer="{ submitAction }">
      <AppButton
        @click="submitAction"
        :loading="isLoading"
        :disabled="isLoading"
        label="Регистрация"
      />
      <p>
        Вы зарегистрированы?
        <NuxtLink :to="{ name: RouterPaths.LOGIN }" class="app-link"
          >Авторизоваться</NuxtLink
        >
      </p>
    </template>
  </AppForm>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  type FormField,
  FormFieldType,
  ValidationRuleType,
} from "~/types/form";
import { RouterPaths } from "~/types/router";

const isLoading = ref(false);
const { onUserRegister } = useAuthStore();
const toast = useToast();

const registerFields = ref<FormField[][]>([
  [
    {
      type: FormFieldType.TEXT,
      key: "login",
      label: "Логин",
      validationRules: [ValidationRuleType.REQUIRED],
      params: {
        placeholder: "Логин",
        prefixIcon: "user",
      },
    },
    {
      type: FormFieldType.TEXT,
      key: "email",
      label: "Почта",
      validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.EMAIL],
      params: {
        placeholder: "Почта",
        prefixIcon: "envelope",
      },
    },
    {
      type: FormFieldType.PASSWORD,
      key: "password",
      label: "Пароль",
      validationRules: [
        ValidationRuleType.REQUIRED,
        ValidationRuleType.PASSWORD,
      ],
      params: {
        placeholder: "Пароль",
        prefixIcon: "lock",
      },
    },
    {
      type: FormFieldType.PASSWORD,
      key: "repeat-pass",
      label: "Повторите пароль",
      validationRules: [
        ValidationRuleType.REQUIRED,
        ValidationRuleType.PASSWORD,
      ],
      params: {
        placeholder: "Повторите пароль",
        prefixIcon: "lock",
      },
    },
  ],
]);

function onRegister(formData: Record<string, any>) {
  isLoading.value = true;
  onUserRegister(formData)
    .then((res) => {
      toast.add({
        severity: "success",
        summary: "Успех",
        detail: "Вы успешно зарегистрировались",
        life: 3000,
      });
      navigateTo(RouterPaths.DASHBOARD);
    })
    .catch((res) => [
      toast.add({
        severity: "error",
        summary: "Ошибка",
        detail: `Произошла ошибка при регистрации | ${res.message}`,
        life: 3000,
      }),
    ])
    .finally(() => (isLoading.value = false));
}
</script>
