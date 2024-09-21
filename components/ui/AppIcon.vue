<template>
  <div>
    <i :class="`pi pi-${props.icon}`"></i>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  icon: string | undefined
}>()
</script>

<style>

</style>