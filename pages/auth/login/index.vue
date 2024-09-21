<template>
  <AppForm :fields="loginFields" :submit-action="onLogin">
    <template #footer="{ submitAction }">
      <AppButton label="Авторизоваться" @click="submitAction" />
    </template>
  </AppForm>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  FormFieldType,
  ValidationRuleType,
  type FormField,
} from "~/types/form";

// Определяем поля формы
const loginFields = ref<FormField[][]>([
  [
    {
      type: FormFieldType.TEXT,
      key: "email", // Используем уникальный ключ для каждого поля
      label: "Email",
      validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.EMAIL],
      params: {
        placeholder: "Email",
        prefixIcon: "envelope",
        inputType: "text",
        clearable: true,
      },
    },
  ],
  [
    {
      type: FormFieldType.PASSWORD,
      key: "password", // Используем уникальный ключ для каждого поля
      label: "Password",
      validationRules: [
        ValidationRuleType.REQUIRED,
        ValidationRuleType.PASSWORD,
      ],
      params: {
        placeholder: "Password",
        prefixIcon: "lock",
        inputType: "password",
        clearable: true,
        eyes: true,
      },
    },
  ],
]);

function onLogin(formData: Record<string, any>) {
  console.log("Form data:", formData); // Здесь будут данные формы
}
</script>
