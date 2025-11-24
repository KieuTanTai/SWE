import axios from "axios";
import Account, { createDefaultAccount } from "../interfaces/account";

export async function login(account: {
  username: string;
  password: string;
}): Promise<Account> {
  try {
    const result = await axios.post(
      "http://localhost:5000/api/accounts/login",
      {
        account_email: account.username,
        account_password: account.password,
      }
    );

    if (!result) {
      console.error("not found");
      return createDefaultAccount();
    }

    return result.data as Account;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return createDefaultAccount();
  }
}
