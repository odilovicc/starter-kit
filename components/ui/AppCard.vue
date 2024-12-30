<template>
  <div :class="['app-card-container ' + props.class]">
    <h1 class="app-card-title">{{ props.title }}</h1>
    <div class="app-card-content">
      <slot name="content" />
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  title: string | undefined;
  class?: string;
}>();
</script>
<style src="~/assets/stylus/components/ui/card.styl" />
