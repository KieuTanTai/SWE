export function isValidEmail(email: string) : boolean {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
}

export function isValidPassword(password: string) : boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[\S]{9,}$/;
    return passwordRegex.test(password);
}

export function isEqualString(firstInput: string, secondInput: string) {
    return firstInput === secondInput;
}
