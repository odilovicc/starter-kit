<template>
  <div
    :class="{
      'app-form-input': true,
      ['app-form-input-' + props.inputType]: true,
      'app-form-input-focused': focused,
      'app-form-input-disabled': props.disabled,
      'app-form-input-invalid': props.error
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
      <app-icon :icon="props.prefixIconImage" />
    </div>
    <div class="app-form-input-content">
      <PrimeInputText
        :value="modelValue"
        @input="onChange"
        :type="inputType"
        :placeholder="props.placeholder"
        @focus="focused = true"
        @blur="focused = false"
        :disabled="props.disabled"
      />
    </div>
    <div class="app-form-input-suffix" v-if="!!props.clearable && !!modelValue">
      <app-icon @click="onClear" icon="times" />
    </div>
    <div class="app-form-input-suffix" v-if="!!props.eyes">
      <app-icon @click="showHide" :icon="show ? 'eye' : 'eye-slash'" />
    </div>
  </div>
</template>
<script setup lang="ts">
const PrimeInputText = defineAsyncComponent(() => import("primevue/inputtext"));

const emit = defineEmits(["update:modelValue", "change"]);
const inputType = ref<string>("password");
const show = ref<boolean>(false);

const props = defineProps<{
  prefixIcon?: string;
  prefixIconImage?: string;
  type?: string;
  placeholder?: string;
  modelValue?: any;
  inputType?: string;
  clearable?: boolean;
  eyes?: boolean;
  disabled?: boolean;
  error?: string | null;
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
const showHide = () => {
  show.value = !show.value;
  inputType.value = show.value ? "text" : "password";
};
</script>

<style src="~/assets/stylus/components/form/form.styl" />
