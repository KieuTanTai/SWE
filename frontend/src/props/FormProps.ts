import type { ChangeEvent, FormEvent } from "react";

export default interface FormPropsHandler<T, TReturnEntity> {
    formData: T;
    isSubmitting: boolean;
    userNameErrorMessage?: string;
    passwordErrorMessage?: string;
    setFormData: (data: T) => void;
    handleChange: (
        e: ChangeEvent<HTMLInputElement>,
        isCheckUsername?: boolean,
        isCheckPasswordValid?: boolean,
        isCheckbox?: boolean
    ) => boolean;
    handleSubmit: (e: FormEvent<Element>) => TReturnEntity | Promise<TReturnEntity>;
    handleCopy: (e: FormEvent<Element>) => void;
}