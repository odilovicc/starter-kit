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
          'text-red-500': props.error,
        }"
      />
    </div>

    <div v-if="!!props.prefixIconImage" class="app-form-input-prefix-icon">
      <app-icon :icon="props.prefixIcon" />
    </div>
    <div class="app-form-input-content">
      <PrimeInputText
        :value="modelValue"
        @input="onChange"
        :type="props.type || 'text'"
        :placeholder="props.placeholder"
        @focus="focused = true"
        @blur="focused = false"
        :disabled="props.disabled"
      />
    </div>
    <div class="app-form-input-suffix" v-show="!!props.clearable && !!modelValue">
      <app-icon @click="onClear" icon="times" />
    </div>
  </div>
</template>
<script setup lang="ts">
const PrimeInputText = defineAsyncComponent(() => import("primevue/inputtext"));

const emit = defineEmits(["update:modelValue", "change"]);
const props = defineProps<{
  prefixIcon?: string;
  prefixIconImage?: string;
  type?: string;
  placeholder?: string;
  modelValue?: any;
  inputType?: string;
  clearable?: boolean;
  disabled?: boolean;
  error?: string | null; // Добавляем error как пропс
}>();
const focused = ref<boolean>(false);

const onChange = ($event: any) => {
  const value = $event.target.value || null;
  emit("update:modelValue", value);
  emit("change", value);
};
const onClear = ($event: any) => {
  emit("update:modelValue", null);
  emit("change", null);
};
</script>

<style src="~/assets/stylus/components/form/form.styl" />
