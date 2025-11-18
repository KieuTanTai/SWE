/**
 * Role Model for Frontend
 * Represents user roles for authorization
 */

import { Account } from "./account";

export interface Role {
  role_id: number;
  role_name: string;
  role_created_date: Date | string;
  role_active_status: boolean;

  // Navigation Properties
  accounts?: Account[]; // Array of Account objects through Account_Role
  permissions?: string[]; // Array of permissions for this role
}

export interface CreateRoleDTO {
  role_name: string;
  permissions?: string[];
}

export interface UpdateRoleDTO {
  role_name?: string;
  role_active_status?: boolean;
  permissions?: string[];
}

export function createDefaultRole(overrides?: Partial<Role>): Role {
  return {
    role_id: 0,
    role_name: "",
    role_created_date: new Date().toISOString(),
    role_active_status: true,
    accounts: [],
    permissions: [],
    ...overrides,
  };
}

export default Role;
