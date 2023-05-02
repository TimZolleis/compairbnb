export function requireFormDataValue(requiredValue: string, formData: FormData) {
    const value = formData.get(requiredValue)?.toString();
    if (!value) {
        throw new Error(`The form field ${requiredValue} is required`);
    }
    return value;
}
