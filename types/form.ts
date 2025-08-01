export enum FormFieldType {
  TEXT = 'text',
  PASSWORD = 'password',
  NUMBER = 'number',
  SELECT = 'select',
  PHONE = 'phone',
  FILE = 'file',
  TEXTAREA = 'textarea',
  MULTISELECT = 'multiselect', // Added for multi-select support
}

export enum ValidationRuleType {
  REQUIRED = 'required',
  EMAIL = 'email',
  PASSWORD = 'password',
  FILE = 'file',
  MULTISELECT = 'multiselect', // Added for multi-select validation
}

export interface IDropdownList {
  label: string | number;
  value: string | number;
  imageIcon?: string;
  icon?: string;
}

export interface BaseFormField {
  type: FormFieldType;
  key: string;
  label: string;
  class?: string;
  params?: Record<string, any>;
  error?: string | null;
  validationRules?: ValidationRuleType[];
  initialValue?: any;
}

export interface SelectFormField extends BaseFormField {
  type: FormFieldType.SELECT;
  list: IDropdownList[];
}

export interface MultiSelectFormField extends BaseFormField {
  type: FormFieldType.MULTISELECT;
  list: IDropdownList[];
  maxSelectedLabels?: number;
  display?: 'comma' | 'chip';
  filter?: boolean;
}

export type FormField = BaseFormField | SelectFormField | MultiSelectFormField;

// Type for the entire form configuration
export interface FormConfig {
  fields: FormField[][];
  submitAction: (formData: Record<string, any>) => void;
  formLoading?: boolean;
}
