<template>
    <div :class="{
        ['app-form-input-' + props.inputType]: true,
        'app-form-input-focused': focused,
        'app-form-input-disabled': props.disabled,
        'app-form-input-invalid': props.error,
    }">
        <div v-if="!!props.prefixIcon" class="app-form-input-prefix-icon">
            <app-icon :icon="props.prefixIcon" :class="{
                'text-red-500': props.error,
            }" />
        </div>

        <div v-if="!!props.prefixIconImage" class="app-form-input-prefix-icon">
            <app-icon :icon="props.prefixIcon" />
        </div>

        <div class="app-form-input-content">
            <Dropdown 
                v-model="model" 
                :options="props.list" 
                optionLabel="label" 
                :placeholder="props.placeholder"
                @focus="onFocus" 
                @blur="onBlur"
                class="app-form-input-dropdown app-form-input"
                :disabled="props.disabled"
            />
        </div>

        <div class="app-form-input-suffix" v-show="!!props.clearable && !!model">
            <app-icon @click="onClear" icon="times" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from "vue";
import Dropdown from "primevue/dropdown";
import type { IDropdownList } from "~/types/form";

const emit = defineEmits(["update:modelValue", "change"]);
const props = defineProps<{
    prefixIcon?: string;
    prefixIconImage?: string;
    placeholder?: string;
    modelValue?: any;
    inputType?: string;
    clearable?: boolean;
    disabled?: boolean;
    list?: IDropdownList[];
    error?: string | null;
}>();

const focused = ref<boolean>(false);

const model = computed({
    get: () => {
        console.log("modelValue получено:", props.modelValue);
        return props.modelValue;
    },
    set: (value) => {
        console.log("modelValue изменено:", value);
        emit("update:modelValue", value);
        emit("change", value);
    }
});

const onFocus = () => {
    console.log("Фокус на Dropdown");
    focused.value = true;
};
const onBlur = () => {
    console.log("Blur с Dropdown");
    focused.value = false;
};
const onClear = () => {
    console.log("Очистка");
    model.value = null;
};
</script>

<style src="~/assets/stylus/components/form/form.styl" />
