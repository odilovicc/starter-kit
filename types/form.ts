export enum FormFieldType {
    TEXT = 'text',
    PASSWORD = 'password'
}

export interface FormField {
    type: FormFieldType;
    key: string;
    label: string;
    class?: string;
    params?: Record<string, any>;
    error?: string | null;
    validationRules?: ValidationRuleType[]; // Массив типов правил валидации
}
export enum ValidationRuleType {
    REQUIRED = 'required',
    EMAIL = 'email',
    PASSWORD = 'password'
}