import bcrypt from 'bcrypt';

/**
 * Number of salt rounds for bcrypt hashing
 * Higher number = more secure but slower
 * Recommended: 10-12 for production
 */
const SALT_ROUNDS = 10;

/**
 * Hash a plain text password using bcrypt
 * @param {string} plainPassword - The plain text password to hash
 * @returns {Promise<string>} The hashed password
 * @throws {Error} If password is invalid or hashing fails
 */
export async function hashPassword(plainPassword) {
    if (!plainPassword || typeof plainPassword !== 'string') {
        throw new Error('Password must be a non-empty string');
    }

    if (plainPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }

    try {
        const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
        return hashedPassword;
    } catch (error) {
        throw new Error(`Failed to hash password: ${error.message}`);
    }
}

/**
 * Compare a plain text password with a hashed password
 * @param {string} plainPassword - The plain text password to check
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 * @throws {Error} If parameters are invalid or comparison fails
 */
export async function comparePassword(plainPassword, hashedPassword) {
    if (!plainPassword || typeof plainPassword !== 'string') {
        throw new Error('Plain password must be a non-empty string');
    }

    if (!hashedPassword || typeof hashedPassword !== 'string') {
        throw new Error('Hashed password must be a non-empty string');
    }

    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error(`Failed to compare passwords: ${error.message}`);
    }
}

/**
 * Generate a random salt with the configured number of rounds
 * @returns {Promise<string>} The generated salt
 * @throws {Error} If salt generation fails
 */
export async function generateSalt() {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        return salt;
    } catch (error) {
        throw new Error(`Failed to generate salt: ${error.message}`);
    }
}

/**
 * Hash a password with a specific salt
 * Useful when you need to control the salt used
 * @param {string} plainPassword - The plain text password to hash
 * @param {string} salt - The salt to use for hashing
 * @returns {Promise<string>} The hashed password
 * @throws {Error} If parameters are invalid or hashing fails
 */
export async function hashPasswordWithSalt(plainPassword, salt) {
    if (!plainPassword || typeof plainPassword !== 'string') {
        throw new Error('Password must be a non-empty string');
    }

    if (!salt || typeof salt !== 'string') {
        throw new Error('Salt must be a non-empty string');
    }

    try {
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error(`Failed to hash password with salt: ${error.message}`);
    }
}

/**
 * Get the number of rounds used in a hashed password
 * @param {string} hashedPassword - The hashed password to analyze
 * @returns {number} The number of rounds used
 * @throws {Error} If the hashed password is invalid
 */
export function getRounds(hashedPassword) {
    if (!hashedPassword || typeof hashedPassword !== 'string') {
        throw new Error('Hashed password must be a non-empty string');
    }

    try {
        const rounds = bcrypt.getRounds(hashedPassword);
        return rounds;
    } catch (error) {
        throw new Error(`Failed to get rounds from hashed password: ${error.message}`);
    }
}

// Default export for convenience
export default {
    hashPassword,
    comparePassword,
    generateSalt,
    hashPasswordWithSalt,
    getRounds,
    SALT_ROUNDS
};
