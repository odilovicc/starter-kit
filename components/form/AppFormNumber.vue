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
        <PrimeNumber
          v-model="currentValue"
          @input="onChange"
          :type="props.type || 'text'"
          :placeholder="props.placeholder"
          :mode="props.inputmode"
          :prefix="props.prefixInput"
          :suffix="suffixInput"
          :useGrouping="props.needGroup"
          @focus="focused = true"
          @blur="focused = false"
          :disabled="props.disabled"
          class="w-full"
        />
      </div>
      <div class="app-form-input-suffix" v-show="!!props.clearable && !!modelValue">
        <app-icon @click="onClear" icon="times" />
      </div>
    </div>
  </template>
  <script setup lang="ts">
  const PrimeNumber = defineAsyncComponent(() => import("primevue/inputnumber"));

  type InputMode = 'decimal' | 'currency'
  
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
    inputmode?: InputMode,
    prefixInput?: string | number,
    suffixInput?: string | number,
    needGroup?: boolean
  }>();
  const focused = ref<boolean>(false);
  const currentValue = ref(props.modelValue || null)
  
  const onChange = ($event: any) => {
    const value = $event.value || null;
    emit("update:modelValue", value);
    emit("change", value);
  };
  const onClear = ($event: any) => {
    emit("update:modelValue", null);
    emit("change", null);
  };
  </script>
  
  <style src="~/assets/stylus/components/form/form.styl" />
  