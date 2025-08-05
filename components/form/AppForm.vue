<template>
  <form @submit.prevent="handleSubmit" class="app-form-container">
    <div
      v-for="(row, rowIndex) in props.fields"
      :key="rowIndex"
      class="app-form-row"
    >
      <div
        v-for="(field, colIndex) in row"
        :key="colIndex"
        class="app-form-col"
      >
        <AppFormField
          :label="field.label"
          :class="field.class"
          :error="field.error"
          :required="
            field.validationRules?.includes(ValidationRuleType.REQUIRED)
          "
        >
          <component
            :is="getFieldComponent(field.type)"
            v-model="formData[field.key]"
            v-bind="field.params"
            @input="validateField(field)"
            @change="validateField(field)"
            :error="field.error"
            :disabled="props.formLoading"
            :list="
              isSelectField(field) || isMultiSelectField(field)
                ? field.list
                : undefined
            "
            :initialValue="field.initialValue"
            :maxSelectedLabels="
              isMultiSelectField(field) ? field.maxSelectedLabels : undefined
            "
            :display="isMultiSelectField(field) ? field.display : undefined"
            :filter="isMultiSelectField(field) ? field.filter : undefined"
          />
        </AppFormField>
      </div>
    </div>
    <slot
      name="footer"
      :submit-action="() => handleSubmit()"
      :disabled="props.formLoading"
      :loading="props.formLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import AppFormField from './FormField.vue';
import AppFormInputText from './AppFormInputText.vue';
import AppFormInputPassword from './AppFormInputPassword.vue';
import AppFormInputNumber from './AppFormInputNumber.vue';
import AppFormSelect from './AppFormSelect.vue';
import AppFormInputMask from './AppFormInputMask.vue';
import AppFormFile from './AppFormFile.vue';
import AppFormTextarea from './AppFormTextarea.vue';
import AppFormMultiSelect from './AppFormMultiSelect.vue';
import {
  FormFieldType,
  ValidationRuleType,
  type FormField,
  type SelectFormField,
  type MultiSelectFormField,
} from '~/types/form';

// Props using FormConfig type
const props = defineProps<{
  fields: FormField[][];
  submitAction: (formData: Record<string, any>) => void;
  formLoading?: boolean;
}>();

const t = (t: any) => t
const formData = reactive<Record<string, any>>({});

// Initialize form data
props.fields.flat().forEach((field) => {
  formData[field.key] =
    field.initialValue ?? (field.type === FormFieldType.MULTISELECT ? [] : '');
});

// Validation rules
const validationRules = {
  [ValidationRuleType.REQUIRED]: (value: any) =>
    (Array.isArray(value) ? value.length > 0 : !!value) || t('form.required'),
  [ValidationRuleType.EMAIL]: (value: string) =>
    /\S+@\S+\.\S+/.test(value) || t('form.email'),
  [ValidationRuleType.PASSWORD]: (value: string) =>
    value.length >= 6 || t('form.pswvalid'),
  [ValidationRuleType.FILE]: (value: any) => !!value || t('form.fileRequired'),
  [ValidationRuleType.MULTISELECT]: (value: any[]) =>
    value.length > 0 || t('Выберите хоть одну'),
};

// Type guards for field types
const isSelectField = (field: FormField): field is SelectFormField =>
  field.type === FormFieldType.SELECT;

const isMultiSelectField = (field: FormField): field is MultiSelectFormField =>
  field.type === FormFieldType.MULTISELECT;

// Validate field
const validateField = (field: FormField) => {
  let error = null;

  if (field.validationRules) {
    for (const ruleType of field.validationRules) {
      const validationFunction = validationRules[ruleType];
      if (validationFunction) {
        error = validationFunction(formData[field.key]);
        if (typeof error === 'string') {
          field.error = error;
          return;
        }
      }
    }
  }

  field.error = null;
};

// Handle form submission
const handleSubmit = () => {
  props.fields.flat().forEach(validateField);

  const isValid = props.fields.flat().every((field) => !field.error);
  if (isValid) {
    props.submitAction(formData);
  } else {
    console.log('Please fix the validation errors');
  }
};

// Map field types to components
const getFieldComponent = (type: FormFieldType) => {
  switch (type) {
    case FormFieldType.TEXT:
      return AppFormInputText;
    case FormFieldType.PASSWORD:
      return AppFormInputPassword;
    case FormFieldType.NUMBER:
      return AppFormInputNumber;
    case FormFieldType.SELECT:
      return AppFormSelect;
    case FormFieldType.PHONE:
      return AppFormInputMask;
    case FormFieldType.FILE:
      return AppFormFile;
    case FormFieldType.TEXTAREA:
      return AppFormTextarea;
    case FormFieldType.MULTISELECT:
      return AppFormMultiSelect;
    default:
      return AppFormInputText;
  }
};
</script>
<style src="~/assets/scss/components/form.scss"></style>