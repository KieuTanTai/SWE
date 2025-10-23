import { default as AccountDAO } from "../infrastructure/data/accountDAO.js";
import { Account } from "../models/index.js";

/**
 * AccountService
 * Service layer for managing accounts
 */
class AccountService {
    /**
     * @param {AccountDAO} accountRepository
     */
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }

    /**
     * Get all accounts
     * @return {Promise<{success: boolean, data?: Account[], error?: string}>}
     */
    async getAllAccounts() {
        try {
            const results = await this.accountRepository.getAllAccounts();
            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get account by ID
     * @param {number} accountId
     * @return {Promise<{success: boolean, data?: Account, error?: string}>}
     */
    async getByAccountId(accountId) {
        try {
            if (!accountId || !Number.isInteger(accountId)) {
                return {
                    success: false,
                    error: 'Invalid accountId'
                };
            }

            const result = await this.accountRepository.getByAccountId(accountId);
            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get accounts by multiple IDs
     * @param {number[]} accountIds
     * @return {Promise<{success: boolean, data?: Account[], error?: string}>}
     */
    async getByAccountIds(accountIds) {
        try {
            if (!Array.isArray(accountIds) || accountIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid accountIds array'
                };
            }

            const results = await this.accountRepository.getByAccountIds(accountIds);
            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get account by email
     * @param {string} email
     * @return {Promise<{success: boolean, data?: Account, error?: string}>}
     */
    async getByEmail(email) {
        try {
            if (!email || typeof email !== 'string') {
                return {
                    success: false,
                    error: 'Invalid email'
                };
            }

            const result = await this.accountRepository.getByEmail(email);
            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get accounts by multiple emails
     * @param {string[]} emails
     * @return {Promise<{success: boolean, data?: Account[], error?: string}>}
     */
    async getByEmails(emails) {
        try {
            if (!Array.isArray(emails) || emails.length === 0) {
                return {
                    success: false,
                    error: 'Invalid emails array'
                };
            }

            const results = await this.accountRepository.getByEmails(emails);
            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get accounts by login status
     * @param {boolean} loginStatus
     * @return {Promise<{success: boolean, data?: Account[], error?: string}>}
     */
    async getByLoginStatus(loginStatus) {
        try {
            if (typeof loginStatus !== 'boolean') {
                return {
                    success: false,
                    error: 'Invalid loginStatus'
                };
            }

            const results = await this.accountRepository.getByLoginStatus(loginStatus);
            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create a new account
     * @param {Account} account
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async createAccount(account) {
        try {
            if (!(account instanceof Account)) {
                return {
                    success: false,
                    error: 'Invalid account object'
                };
            }

            const result = await this.accountRepository.createAccount(account);
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create account'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create multiple accounts
     * @param {Account[]} accounts
     * @return {Promise<{success: boolean, data?: number|number[], error?: string}>}
     */
    async createAccounts(accounts) {
        try {
            if (!Array.isArray(accounts) || accounts.length === 0) {
                return {
                    success: false,
                    error: 'accounts must be a non-empty array'
                };
            }

            const result = await this.accountRepository.createAccounts(accounts);
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create accounts'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update account email
     * @param {number} accountId
     * @param {string} newEmail
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateEmail(accountId, newEmail) {
        try {
            if (!accountId || !Number.isInteger(accountId)) {
                return {
                    success: false,
                    error: 'Invalid accountId'
                };
            }

            if (!newEmail || typeof newEmail !== 'string') {
                return {
                    success: false,
                    error: 'Invalid newEmail'
                };
            }

            const result = await this.accountRepository.updateEmail(accountId, newEmail);
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update email'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update account password
     * @param {number} accountId
     * @param {string} newPassword
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updatePassword(accountId, newPassword) {
        try {
            if (!accountId || !Number.isInteger(accountId)) {
                return {
                    success: false,
                    error: 'Invalid accountId'
                };
            }

            if (!newPassword || typeof newPassword !== 'string') {
                return {
                    success: false,
                    error: 'Invalid newPassword'
                };
            }

            const result = await this.accountRepository.updatePassword(accountId, newPassword);
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update password'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update account login status
     * @param {number} accountId
     * @param {boolean} loginStatus
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateLoginStatus(accountId, loginStatus) {
        try {
            if (!accountId || !Number.isInteger(accountId)) {
                return {
                    success: false,
                    error: 'Invalid accountId'
                };
            }

            if (typeof loginStatus !== 'boolean') {
                return {
                    success: false,
                    error: 'Invalid loginStatus'
                };
            }

            const result = await this.accountRepository.updateLoginStatus(accountId, loginStatus);
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update login status'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update emails of multiple accounts
     * @param {Array<{account_id: number, account_email: string}>} accounts - Plain objects with snake_case properties
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateEmails(accounts) {
        try {
            if (!Array.isArray(accounts) || accounts.length === 0) {
                return {
                    success: false,
                    error: 'accounts must be a non-empty array'
                };
            }

            const result = await this.accountRepository.updateEmails(accounts);
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update emails'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update passwords of multiple accounts
     * @param {Array<{account_id: number, account_password: string}>} accounts - Plain objects with snake_case properties
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updatePasswords(accounts) {
        try {
            if (!Array.isArray(accounts) || accounts.length === 0) {
                return {
                    success: false,
                    error: 'accounts must be a non-empty array'
                };
            }

            const result = await this.accountRepository.updatePasswords(accounts);
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update passwords'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update login statuses of multiple accounts
     * @param {Array<{account_id: number, account_login_status: boolean}>} accounts - Plain objects with snake_case properties
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateLoginStatuses(accounts) {
        try {
            if (!Array.isArray(accounts) || accounts.length === 0) {
                return {
                    success: false,
                    error: 'accounts must be a non-empty array'
                };
            }

            const result = await this.accountRepository.updateLoginStatuses(accounts);
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update login statuses'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

}

export default AccountService;
