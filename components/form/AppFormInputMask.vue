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
    <div v-if="!!props.prefixIcon" class="app-form-input-prefix-icon">
      <app-icon
        :icon="props.prefixIcon"
        :class="{
          'text-[var(--error)]': props.error,
        }"
      />
    </div>
    <div v-if="!!props.prefixIconImage" class="app-form-input-prefix-icon">
      <app-icon :icon="props.prefixIconImage" />
    </div>
    <div class="app-form-input-content">
      <PrimeInputText
        :modelValue="props.modelValue"
        @update:modelValue="onChange"
        :placeholder="props.placeholder"
        @focus="focused = true"
        @blur="focused = false"
        :disabled="props.disabled"
        :mask="props.mask"
      />
    </div>
    <div
      class="app-form-input-suffix"
      v-show="!!props.clearable && !!props.modelValue"
    >
      <app-icon @click="onClear" icon="times" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PrimeInputText from 'primevue/inputmask';

const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps<{
  prefixIcon?: string;
  prefixIconImage?: string;
  type?: string;
  placeholder?: string;
  modelValue?: string | number | null;
  inputType?: string;
  clearable?: boolean;
  disabled?: boolean;
  error?: string | null;
  currency?: string;
  mask?: string;
}>();

const focused = ref<boolean>(false);

const onChange = (value: string | number | null) => {
  emit('update:modelValue', value);
  emit('change', value);
};

const onClear = () => {
  emit('update:modelValue', '');
  emit('change', '');
};
</script>
