<template>
  <div class="mb-4 flex flex-col gap-1">
    <label :class="['mb-1 text-sm font-semibold text-gray-700', props.class]">
      {{ props.label }} <span class="text-[--invalid]" v-if="required">*</span>
    </label>
    <slot />
    <p v-if="!!error" class="mt-1 text-xs text-[--invalid]">{{ error }}</p>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  class?: string;
  label: string;
  error?: string | null;
  required?: boolean;
}>();
</script>
