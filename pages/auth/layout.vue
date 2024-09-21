<template>
  <div class="bg-blue-500">
    <div
      class="container flex justify-center items-center mx-auto w-full h-screen"
    >
      <AppCard :title="pageTitle" class="min-w-[50vw]">
        <template #content>
          <NuxtPage />
        </template>
      </AppCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterPaths } from "~/types/router";

const route = useRoute();

const pageTitle = computed(() => {
  switch (route.name) {
    case RouterPaths.LOGIN:
      return "Авторизация";
      break;
    case RouterPaths.REGISTER:
      return "Регистрация";
      break;
  }
});
</script>
