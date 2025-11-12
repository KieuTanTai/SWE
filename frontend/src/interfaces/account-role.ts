/**
 * AccountRole Model for Frontend
 * Represents many-to-many relationship between Account and Role
 */

import { Account } from './account';
import { Role } from './role';

export interface AccountRole {
  role_id: number;
  account_id: number;
  assigned_date?: Date | string;
  assigned_by?: number;

  // Navigation Properties
  account?: Account | null; // Account object
  role?: Role | null; // Role object
}

export interface CreateAccountRoleDTO {
  role_id: number;
  account_id: number;
  assigned_by?: number;
}

export default AccountRole;
