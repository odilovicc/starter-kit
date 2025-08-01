<template>
  <div
    :class="[
      'focus-within:border-primary flex flex-col rounded-lg border bg-white transition-all',
      {
        'border-gray-300': !error,
        'border-danger': error,
        'cursor-not-allowed opacity-50': disabled,
        'ring-primary ring-2': focused && !error,
        'ring-danger ring-2': focused && error,
        'pl-3': !!prefixIcon || !!prefixIconImage,
        'pr-3': !!clearable && !!internalValue,
      },
    ]"
  >
    <div class="flex items-center">
      <div v-if="prefixIcon" class="text-primary mr-2">
        <app-icon :icon="prefixIcon" :class="{ 'text-danger': error }" />
      </div>
      <div v-if="prefixIconImage" class="mr-2">
        <app-icon :icon="prefixIcon" />
      </div>
      <div
        v-if="clearable && internalValue"
        class="hover:text-danger ml-auto cursor-pointer text-gray-400"
        @click="onClear"
      >
        <app-icon icon="times" />
      </div>
    </div>
    <div class="flex-1">
      <PrimeTextarea
        v-model="internalValue"
        :placeholder="placeholder"
        @focus="focused = true"
        @blur="focused = false"
        :disabled="disabled"
        class="w-full resize-none border-none bg-transparent px-0 py-2 outline-none"
        :autoResize="true"
        :rows="rows"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const PrimeTextarea = defineAsyncComponent(() => import('primevue/textarea'));

const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps<{
  prefixIcon?: string;
  prefixIconImage?: string;
  placeholder?: string;
  modelValue?: any;
  clearable?: boolean;
  disabled?: boolean;
  error?: string | null;
  initialValue?: any;
  rows?: number;
}>();

const focused = ref(false);
const internalValue = ref(props.initialValue ?? props.modelValue ?? null);

watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal;
  },
);

watch(
  () => props.initialValue,
  (newVal) => {
    if (props.modelValue === undefined) {
      internalValue.value = newVal;
    }
  },
);

watch(internalValue, (newVal) => {
  emit('update:modelValue', newVal);
  emit('change', newVal);
});

const onClear = () => {
  internalValue.value = null;
};
</script>
