export const useValidator = () => {
    const validateEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return emailRegex.test(email) ? null : "Invalid email format.";
    };

    const validateNotEmpty = (value, fieldName) => {
        return value.trim().length > 0 ? null : `${fieldName} cannot be empty.`;
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?!.*\s).{8,}$/;
        return passwordRegex.test(password) ? null : "Password must meet the specified criteria.";
    };

    const confirmPassword = (password, confirmPassword) => {
        return password === confirmPassword ? null : "Passwords do not match.";
    };

    return {
        validateEmail,
        validateNotEmpty,
        validatePassword,
        confirmPassword
    };
};
