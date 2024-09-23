<template>
  <div>
    <AppForm :fields="appFields" :submit-action="onSubmit">
      <template #footer="{ submitAction }">
        <AppButton
          label="Submit"
          @click="submitAction"
        />
      </template>
    </AppForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  FormFieldType,
  type FormField,
  ValidationRuleType,
} from "~/types/form"; // Импорт типов

const email = ref("");
const password = ref("");

// Определение полей формы с валидацией
const appFields = ref<FormField[][]>([
  [
    {
      type: FormFieldType.TEXT,
      value: email,
      label: "Email",
      validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.EMAIL], // Правила: обязательное поле и проверка email
      params: {
        placeholder: "Enter your email",
        prefixIcon: "envelope",
        inputType: "text",
      },
    },
  ],
  [
    {
      type: FormFieldType.PASSWORD,
      value: password,
      label: "Password",
      validationRules: [
        ValidationRuleType.REQUIRED,
        ValidationRuleType.PASSWORD,
      ], // Правила: обязательное поле и проверка пароля
      params: {
        placeholder: "Enter your password",
        prefixIcon: "lock",
        inputType: "password",
        clearable: true,
        eyes: true, // Для кнопки show/hide
      },
    },
  ],
]);

function onSubmit() {
  console.log(email.value, password.value);
}
</script>
