<template>
  <form
    :class="['app-form-container '] + props.class"
    :action="props?.formAction"
  >
    <div class="app-form-container-content">
      <slot />
    </div>
    <div class="app-form-container-footer">
      <slot name="footer"/>
    </div>
  </form>
</template>
<script setup lang="ts">
const props = defineProps<{
  class?: string;
  formAction?: string | void;
}>();
</script>
