<template>
  <div class="app-loader">
    <div class="app-loader-spinner"></div>
    <span v-if="showText" class="app-loader-text">Загрузка...</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  showText?: boolean;
}>();
</script>

<style scoped>
.app-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.app-loader-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--primary);
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.app-loader-text {
  color: var(--primary);
  font-size: 16px;
  font-weight: 500;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
