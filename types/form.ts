import type { IAnyObject } from "./helpers";

export enum FormFieldType {
    TEXT = "text",
    PASSWORD = "password",
    SELECT = "select",
    NUMBER = "number",
}

// Тип поля, автоматически связывает FormFieldType с соответствующим интерфейсом
export type FormField<T = IAnyObject> =
    | ISelect<T>
    | IInput<T>
    | IPassword<T>
    | INumber<T>;

export interface FormFieldDefault<T, P = Record<string, any>> {
    key: keyof T & string;
    label: string;
    class?: string;
    params?: P; // Поле `params` типизируется в зависимости от поля
    error?: string | null;
    validationRules?: ValidationRuleType[]; // Массив типов правил валидации
}

export interface ISelect<T> extends FormFieldDefault<T, SelectParams> {
    type: FormFieldType.SELECT;
    options: IOptions[];
}

export interface IInput<T> extends FormFieldDefault<T, InputParams> {
    type: FormFieldType.TEXT;
}

export interface IPassword<T> extends FormFieldDefault<T, PasswordParams> {
    type: FormFieldType.PASSWORD;
}

export interface INumber<T> extends FormFieldDefault<T, NumberParams> {
    type: FormFieldType.NUMBER;
    inputmode?: "decimal" | "currency";
    prefixInput?: string | number; // Текст перед полем
    suffixInput?: string | number; // Текст после поля
    needGroup?: boolean; // Разделитель групп, например, тысяч
}

// Параметры для различных типов
export interface SelectParams {
    multiple?: boolean; // Множественный выбор
    placeholder?: string; // Подсказка
}

export interface InputParams {
    maxlength?: number; // Максимальная длина
    minlength?: number; // Минимальная длина
    placeholder?: string; // Подсказка
}

export interface PasswordParams {
    showToggle?: boolean; // Показывать переключатель видимости пароля
    strengthMeter?: boolean; // Показывать индикатор силы пароля
}

export interface NumberParams {
    min?: number; // Минимальное значение
    max?: number; // Максимальное значение
    step?: number; // Шаг
    needGroup?: boolean
}

export enum ValidationRuleType {
    REQUIRED = "required",
    EMAIL = "email",
    PASSWORD = "password",
}

export interface IOptions {
    label: string | number;
    value: any;
}
