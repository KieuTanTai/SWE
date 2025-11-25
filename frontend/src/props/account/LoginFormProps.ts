import type { Account } from "@/interfaces";

export default interface LoginFormProps {
  onSuccess: (account: Account) => void;
  onRegisterLinkClick: () => void;
  onForgotPasswordLinkClick: () => void;
}
