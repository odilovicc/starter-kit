<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <PrimeToast position="top-right" />
</template>

<script setup lang="ts">
import PrimeToast from 'primevue/toast';
import { storeToRefs } from 'pinia';
import { useMainStore } from '~/stores/main';

const mainStore = useMainStore();
const { notifications} = storeToRefs(mainStore);
const { vueApp } = useNuxtApp();

// Синхронизация уведомлений
watch(
  notifications,
  (messages) => {
    if (messages.length > 0) {
      messages.forEach((item) => {
        vueApp.config.globalProperties.$toast.add({
          severity: item.type,
          summary: item.message,
          detail: item.detail,
          life: item.life,
        });
      });
      mainStore.clearNotifications();
    }
  },
  { deep: true },
);

</script>

