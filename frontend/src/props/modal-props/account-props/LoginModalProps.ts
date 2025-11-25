import { Account } from "@/interfaces";
import { BaseAccountModalProps } from "./BaseAccountModalProps";
export interface LoginModalProps
  extends Omit<BaseAccountModalProps, "onSuccess"> {
  onSuccess: (account: Account) => void;
}
