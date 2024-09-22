<template>
  <AppForm :fields="registerFields" :submit-action="onRegister" :form-loading="isLoading">
    <template #footer="{ submitAction }">
      <AppButton @click="submitAction" :loading="isLoading" :disabled="isLoading" label="Регистрация" />
    </template>
  </AppForm>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { type FormField, FormFieldType, ValidationRuleType } from '~/types/form';

const isLoading = ref(false);

const registerFields = ref<FormField[][]>([
  [
    {
      type: FormFieldType.TEXT,
      key: "email",
      label: "Электронная почта",
      validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.EMAIL],
      params: {
        clearable: true,
        placeholder: "Электронная почта",
        prefixIcon: "envelope",
      },
    },
    {
      type: FormFieldType.PASSWORD,
      key: "password",
      label: "Пароль",
      validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.PASSWORD],
      params: {
        clearable: true,
        placeholder: "Пароль",
        prefixIcon: "lock",
      },
    },
  ],
]);

function onRegister(formData: Record<string, any>) {
  isLoading.value = true;

  // Simulate async operation
  setTimeout(() => {
    console.log('Form data submitted:', formData);
    isLoading.value = false;
  }, 2000);
}
</script>
