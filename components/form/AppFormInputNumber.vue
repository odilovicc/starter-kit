<template>
  <div
    :class="[
      'focus-within:border-primary flex items-center rounded-lg border bg-white transition-all',
      {
        'border-gray-300': !error,
        'border-danger': error,
        'cursor-not-allowed opacity-50': disabled,
        'ring-primary ring-2': focused && !error,
        'ring-danger ring-2': focused && error,
        'pl-3': !!prefixIcon || !!prefixIconImage,
        'pr-3': !!clearable && internalValue !== null,
      },
    ]"
  >
    <div v-if="prefixIcon" class="text-primary mr-2">
      <app-icon :icon="prefixIcon" :class="{ 'text-danger': error }" />
    </div>
    <div v-if="prefixIconImage" class="mr-2">
      <app-icon :icon="prefixIcon" />
    </div>
    <div class="flex-1">
      <PrimeInputNumber
        v-model="internalValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="{ 'p-invalid': error }"
        :minFractionDigits="0"
        :maxFractionDigits="0"
        @focus="focused = true"
        @blur="focused = false"
        :mode="mode || 'decimal'"
        class="w-full border-none"
      />
    </div>
    <div
      v-if="clearable && internalValue !== null"
      class="hover:text-danger ml-2 cursor-pointer text-gray-400"
      @click="onClear"
    >
      <app-icon icon="times" />
    </div>
  </div>
</template>

<script setup lang="ts">
const PrimeInputNumber = defineAsyncComponent(
  () => import('primevue/inputnumber'),
);

const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps<{
  prefixIcon?: string;
  prefixIconImage?: string;
  placeholder?: string;
  modelValue?: number | null;
  clearable?: boolean;
  disabled?: boolean;
  error?: string | null;
  initialValue?: number | null;
  mode?: 'decimal' | 'currency';
}>();

const focused = ref(false);
const internalValue = ref<number | null>(
  props.initialValue ?? props.modelValue ?? null,
);

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
