<template>
  <div class="app-form-field-container">
    <label :class="['app-form-field-label ' + props.class]">
      {{ props.label }}
    </label>
    <slot />
    <p v-if="!!error" class="app-form-field-error">{{ error }}</p>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  class?: string;
  label: string;
  error?: string | null;
}>();
</script>
<style src="~/assets/stylus/components/form/form.styl"></style>
