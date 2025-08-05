<template>
  <div
    :class="{
      'app-form-input-multiselect': true,
      ['app-form-input-' + props.inputType]: true,
      'app-form-input-focused': focused,
      'app-form-input-disabled': props.disabled,
      'app-form-input-invalid': props.error,
    }"
  >
    <div v-if="!!props.prefixIcon" class="text-primary mr-2">
      <app-icon :icon="props.prefixIcon" :class="{ 'text-danger': error }" />
    </div>
    <div class="app-form-input-content p-0">
      <MultiSelect
        v-model="internalValue"
        :options="props.options"
        :optionLabel="props.optionLabel"
        :optionValue="props.optionValue"
        :filter="props.filter"
        :placeholder="props.placeholder"
        :maxSelectedLabels="props.maxSelectedLabels"
        :disabled="props.disabled"
        :display="props.display"
        :optionGroupLabel="props.optionGroupLabel"
        :optionGroupChildren="props.optionGroupChildren"
        class="app-form-input-dropdown app-form-input p-0"
        @focus="focused = true"
        @blur="focused = false"
        @change="onChange"
      >
        <template v-if="props.optionGroupLabel" #optiongroup="slotProps">
          <div class="flex items-center">
            <img
              v-if="props.showGroupIcon"
              :alt="slotProps.option.label"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`flag flag-${slotProps.option.code?.toLowerCase()} mr-2`"
              style="width: 18px"
            />
            <div>{{ slotProps.option.label }}</div>
          </div>
        </template>
        <template v-if="props.optionTemplate" #option="slotProps">
          <slot name="option" v-bind="slotProps" />
        </template>
      </MultiSelect>
    </div>
    <div
      v-if="!!props.clearable && internalValue?.length"
      class="hover:text-danger ml-2 cursor-pointer text-gray-400"
      @click="onClear"
    >
      <app-icon icon="times" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import MultiSelect from 'primevue/multiselect';

const emit = defineEmits(['update:modelValue', 'change']);
const props = withDefaults(
  defineProps<{
    prefixIcon?: string;
    options: any[];
    optionLabel?: string;
    optionValue?: string;
    filter?: boolean;
    placeholder?: string;
    maxSelectedLabels?: number;
    disabled?: boolean;
    error?: string | null;
    modelValue?: any[];
    initialValue?: any[];
    display?: 'comma' | 'chip';
    optionGroupLabel?: string;
    optionGroupChildren?: string;
    showGroupIcon?: boolean;
    optionTemplate?: boolean;
  }>(),
  {
    optionLabel: 'label',
    optionValue: 'value',
  },
);

const focused = ref<boolean>(false);
const internalValue = ref(props.initialValue || props.modelValue || []);

watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal || [];
  },
);

watch(
  () => props.initialValue,
  (newVal) => {
    if (!props.modelValue) {
      internalValue.value = newVal || [];
    }
  },
);

const onChange = () => {
  emit('update:modelValue', internalValue.value);
  emit('change', internalValue.value);
};

const onClear = () => {
  internalValue.value = [];
  emit('update:modelValue', []);
  emit('change', []);
};
</script>

<style scoped>
:deep(.p-multiselect) {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}
</style>
