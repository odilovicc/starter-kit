<template>
    <div class="financial-dashboard-wrapper">
      <h1 class="financial-dashboard-title">Testing</h1>
  
      <AppForm :fields="financeFields" :submit-action="onSubmitFields">
        <template #footer="{ submitAction, loading, disabled }">
          <AppButton
            label="123"
            @click="submitAction"
            :loading="loading"
            :disabled="disabled"
          />
        </template>
      </AppForm>
    </div>
  </template>
  
  <script setup lang="ts">
  import AppForm from "~/components/form/AppForm.vue";
  import { type FormField, FormFieldType, ValidationRuleType } from "~/types/form";
  
  const financeFields = ref<FormField[][]>([
    [
      {
        label: "Email",
        key: "type",
        validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.EMAIL],
        type: FormFieldType.TEXT,
      },
      {
        label: "Select",
        key: "select",
        validationRules: [ValidationRuleType.REQUIRED],
        type: FormFieldType.SELECT,
        options: [
          {
            label: 1233,
            value: 123,
          },
          {
            label: "test",
            value: 456,
          },
        ],
      },
      {
        label: "Number",
        key: "howMuch",
        type: FormFieldType.NUMBER,
        validationRules: [ValidationRuleType.REQUIRED],
        params: {
          needGroup: true,
        },
      },
      {
        label: "Password",
        key: "password",
        type: FormFieldType.PASSWORD,
        validationRules: [ValidationRuleType.REQUIRED, ValidationRuleType.PASSWORD],
      },
    ],
  ]);
  
  function onSubmitFields(fields) {
    console.log("Отправленные данные:", fields)
  }
  </script>
  