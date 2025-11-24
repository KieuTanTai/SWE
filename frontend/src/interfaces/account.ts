/**
 * Account Model for Frontend
 * Represents user accounts in the system
 */

import { Role } from "./role";
import { Person } from "./person";
import { Parent } from "./parent";
import { Driver } from "./driver";

export interface Account {
  account_id: number;
  account_email: string;
  account_password?: string; // Optional for security
  account_create_date: Date | string;
  account_last_updated_date: Date | string;
  account_login_status: boolean;

  // Navigation Properties
  roles?: Role[]; // Array of Role objects through Account_Role
  person?: Person | null; // Person object if account has person profile
  parent?: Parent | null; // Parent object if account belongs to parent
  driver?: Driver | null; // Driver object if account belongs to driver
}

/**
 * Create a default empty Account object
 * @param overrides - Optional partial Account to override default values
 * @returns Account with default values
 */
export function createDefaultAccount(overrides?: Partial<Account>): Account {
  return {
    account_id: 0,
    account_email: "",
    account_create_date: new Date().toISOString(),
    account_last_updated_date: new Date().toISOString(),
    account_login_status: false,
    roles: [],
    person: null,
    parent: null,
    driver: null,
    ...overrides,
  };
}

export interface CreateAccountDTO {
  account_email: string;
  account_password: string;
  role_ids?: number[];
}

export interface UpdateAccountDTO {
  account_email?: string;
  account_password?: string;
  account_login_status?: boolean;
}

export interface LoginDTO {
  account_email: string;
  account_password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  account?: Account;
  token?: string;
}

export default Account;
