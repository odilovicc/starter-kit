<template>
  <FormContainer>
    <FormField label="Логин">
      <AppFormInputText
        v-model="login"
        prefix-icon="user"
        :disabled="onFormDisabled"
      />
    </FormField>
    <FormField label="Пароль">
      <AppFormInputPassword
        v-model="password"
        prefix-icon="lock"
        :eyes="true"
        :disabled="onFormDisabled"
      />
    </FormField>
    <FormField label="Повторите пароль">
      <AppFormInputPassword
        v-model="repeatPassword"
        prefix-icon="lock"
        :eyes="true"
        :disabled="onFormDisabled"
      />
    </FormField>
    <template #footer>
      <AppButton
        label="Регистрация"
        type="primary"
        class="w-full"
        :loading="onFormDisabled"
        :disabled="onFormDisabled"
        @click="onSubmit"
      />
      <p class="mt-4">
        У вас уже есть аккаунт?
        <NuxtLink :to="{ name: RouterPaths.LOGIN }" class="app-link"
          >Войти</NuxtLink
        >
      </p>
    </template>
  </FormContainer>
</template>
<script setup lang="ts">
import { RouterPaths } from "~/types/router";

const login = ref("");
const password = ref("");
const repeatPassword = ref("");
const onFormDisabled = ref<boolean>(false);

function onSubmit() {
  return new Promise((resolve, reject) => {
    onFormDisabled.value = true;
    setTimeout(() => {
      onFormDisabled.value = false;
      resolve(true);
    }, 1000);
  });
}
</script>
