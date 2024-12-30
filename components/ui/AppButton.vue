<template>
  <PrimeButton
    :class="[`app-button-${type} p-button`]"
    :rounded="circle"
    :disabled="disabled"
  >
    <template #default>
      <app-icon
        v-if="prefixIcon"
        :icon="prefixIcon"
        :class="{ 'p-button-icon': true, 'p-button-icon-left': !!label }"
      />
      <app-icon
        v-if="loading"
        icon="spin pi-spinner"
        :class="{ 'p-button-icon': true, 'p-button-icon-left': !!label }"
      />
      <img
        v-if="imageIcon"
        :src="imageIcon"
        :class="{ 'p-button-icon': true, 'p-button-icon-left': !!label }"
        alt=""
      />
      <span v-if="!!label" class="p-button-label">{{ label }}</span>
      <app-icon
        v-if="!!iconRight"
        :icon="iconRight"
        :class="{
          'p-button-icon': true,
          'p-button-icon-right': !!label,
        }"
      />
    </template>
  </PrimeButton>
</template>
<script setup lang="ts">
const PrimeButton = defineAsyncComponent(() => import("primevue/button"));
type ButtonType = "primary" | "info" | "success" | "warning" | "danger";

const props = withDefaults(
  defineProps<{
    label: string;
    iconRight?: string;
    prefixIcon?: string;
    imageIcon?: string;
    type?: ButtonType;
    circle?: boolean;
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    type: "primary",
  }
);
</script>
<style src="~/assets/stylus/components/ui/button.styl" />
