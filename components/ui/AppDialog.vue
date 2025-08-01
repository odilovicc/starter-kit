<template>
  <PDialog
    v-model:visible="visible"
    :modal="modal"
    :style="dialogStyle"
    :header="title"
    :draggable="draggable"
    :resizable="resizable"
    :closable="closable"
    v-bind="$attrs"
    @close="handleClose"
  >
    <slot></slot>
    <template #footer>
      <slot
        name="footer"
        v-bind="{
          close: handleClose,
        }"
      ></slot>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
const PDialog = defineAsyncComponent(() => import('primevue/dialog'));
const props = withDefaults(
  defineProps<{
    title?: string;
    modal?: boolean;
    draggable?: boolean;
    resizable?: boolean;
    closable?: boolean;
    width?: string;
    dividerFooter?: boolean;
  }>(),
  {
    dividerFooter: false,
    modal: true,
    closable: true,
  },
);

const emit = defineEmits<{
  change: [key: string, visible: boolean];
}>();

const visible = ref(false);

const dialogStyle = computed(() => ({
  width: props.width || '50vw',
}));

const open = () => {
  visible.value = true;
  emit('change', 'OPEN', visible.value);
};

const close = () => {
  visible.value = false;
  emit('change', 'CLOSE', visible.value);
};

const handleClose = () => {
  close();
};

defineExpose<{
  open: () => void;
  close: () => void;
}>({
  open,
  close,
});
</script>
