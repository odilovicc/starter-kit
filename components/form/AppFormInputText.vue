<template>
  <div
    :class="{
      'app-form-input': true,
      ['app-form-input-' + props.inputType]: true,
      'app-form-input-focused': focused,
      'app-form-input-disabled': props.disabled,
      'app-form-input-invalid': props.error,
    }"
  >
    <div v-if="!!props.prefixIcon" class="text-primary mr-2">
      <app-icon :icon="props.prefixIcon" :class="{ 'text-red-500': error }" />
    </div>
    <div v-if="!!props.prefixIconImage" class="mr-2">
      <app-icon :icon="props.prefixIcon" />
    </div>
    <div class="app-form-input-content">
      <PrimeInputText
        :value="internalValue"
        @input="onChange"
        :type="props.type || 'text'"
        :placeholder="props.placeholder"
        @focus="focused = true"
        @blur="focused = false"
        :disabled="props.disabled"
      />
    </div>
    <div
      v-if="!!props.clearable && !!internalValue"
      class="hover:text-danger ml-2 cursor-pointer text-gray-400"
      @click="onClear"
    >
      <app-icon icon="times" />
    </div>
  </div>
</template>

<script setup lang="ts">
const PrimeInputText = defineAsyncComponent(() => import('primevue/inputtext'));

const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps<{
  prefixIcon?: string;
  prefixIconImage?: string;
  type?: string;
  placeholder?: string;
  modelValue?: any;
  inputType?: string;
  clearable?: boolean;
  disabled?: boolean;
  error?: string | null;
  initialValue?: any; // Исправлено название пропса
}>();

const focused = ref<boolean>(false);
const internalValue = ref(props.initialValue || props.modelValue || null);

watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal;
  },
);

watch(
  () => props.initialValue,
  (newVal) => {
    if (!props.modelValue) {
      internalValue.value = newVal;
    }
  },
);

const onChange = ($event: any) => {
  const value = $event.target.value || null;
  internalValue.value = value;
  emit('update:modelValue', value);
  emit('change', value);
};

const onClear = ($event: any) => {
  internalValue.value = null;
  emit('update:modelValue', null);
  emit('change', null);
};
</script>
