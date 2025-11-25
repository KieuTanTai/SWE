"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type FormPropsHandler from "@/props/FormProps";
import { isValidEmail, isValidPassword } from "@/helpers/is-valid-input";

function UseForm<
  T extends object,
  TBackEndEntity,
  TReturnEntity extends TBackEndEntity
>(
  initialData: T,
  onSubmit: (data: T) => Promise<TReturnEntity>
): FormPropsHandler<T, TBackEndEntity> {
  const [formData, setFormData] = useState<T>(initialData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState<string | "">(
    ""
  );
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | "">(
    ""
  );

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    isCheckUserName: boolean = false,
    isCheckPassword: boolean = false,
    isCheckbox: boolean = false
  ) => {
    const { name, value, type, checked } = event.target;
    let finalValue: string | boolean = value;
    if (isCheckUserName && !isValidEmail(value))
      setUserNameErrorMessage("Email không hợp lệ.");
    else setUserNameErrorMessage("");

    if (isCheckPassword && !isValidPassword(value))
      setPasswordErrorMessage("Mật khẩu không hợp lệ.");
    else setPasswordErrorMessage("");

    if (isCheckbox || type == "checkbox") finalValue = checked;
    if (value.length === 0) {
      setUserNameErrorMessage("");
      setPasswordErrorMessage("");
    }

    setFormData((prevData) => ({ ...prevData, [name]: finalValue }));
    if (userNameErrorMessage.length > 0 || passwordErrorMessage.length > 0)
      return false;
    return true;
  };

  const handleSubmit = async (event: FormEvent): Promise<TReturnEntity> => {
    event.preventDefault();
    setIsSubmitting(true);
    setUserNameErrorMessage("");
    setPasswordErrorMessage("");
    try {
      return await onSubmit(formData);
    } catch (error) {
      if (error instanceof Error) {
        setUserNameErrorMessage(error.message);
        setPasswordErrorMessage(error.message);
      } else
        setPasswordErrorMessage("An unknown error occurred during submission.");
      // Return a failed ServiceResult<TBackEndEntity> object
      return {} as TReturnEntity;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (event: FormEvent) => {
    event.preventDefault();
  };

  return {
    formData,
    setFormData,
    handleChange,
    isSubmitting,
    handleSubmit,
    userNameErrorMessage,
    passwordErrorMessage,
    handleCopy,
  };
}

export default UseForm;
