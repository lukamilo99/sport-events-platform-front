export const useValidator = () => {
    const validateEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return emailRegex.test(email) ? null : "Invalid email format.";
    };

    const validateNotEmpty = (value, fieldName) => {
        if (typeof value === 'string' && value.trim() === '') {
            return `${fieldName} is required.`;
        } else if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
            return `${fieldName} is required.`;
        } else if (typeof value === 'object' && Object.keys(value).length === 0) {
            return `${fieldName} is required.`;
        }
        return null;
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?!.*\s).{8,}$/;
        return passwordRegex.test(password) ? null : "Password must meet the specified criteria.";
    };

    const confirmPassword = (password, confirmPassword) => {
        return password === confirmPassword ? null : "Passwords do not match.";
    };

    const validateAddress = (isAddressValid) => {
        return isAddressValid === isAddressValid ? false : "Please select a valid location from the dropdown.";
    };

    return {
        validateEmail,
        validateNotEmpty,
        validatePassword,
        confirmPassword,
        validateAddress
    };
};
