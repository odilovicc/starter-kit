<template>
  <AppForm :fields="loginFields" :submit-action="onLogin" :form-loading="isLoading">
    <template #footer="{ submitAction }">
      <AppButton label="Авторизоваться" @click="submitAction" />
      <p>Вы ещё не зарегистрированы? <NuxtLink :to="{name: RouterPaths.REGISTER}" class="app-link">Зарегистрируйтесь</NuxtLink></p>

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
import { RouterPaths } from "~/types/router";

const {onUserLogin} = useAuthStore()
const isLoading = ref(false)
const toast = useToast()

const loginFields = ref<FormField[][]>([
  [
    {
      type: FormFieldType.TEXT,
      key: "email",
      label: "Почта",
      validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.EMAIL],
      params: {
        placeholder: "Почта",
        prefixIcon: "envelope",
        inputType: "text",
        clearable: true,
      },
    },
  ],
  [
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
        inputType: "password",
        clearable: true,
        eyes: true,
      },
    },
  ],
]);

function onLogin(formData: Record<string, any>) {
  isLoading.value = true;
  onUserLogin(formData)
    .then((res) => {
      toast.add({
        severity: "success",
        summary: "Успех",
        detail: "Вы успешно зарегистрировались",
        life: 3000,
      });
      navigateTo({name: RouterPaths.DASHBOARD});
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
