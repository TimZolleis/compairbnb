import { Params } from '@remix-run/react';

export function requireFormDataValue(requiredValue: string, formData: FormData) {
    const value = formData.get(requiredValue)?.toString();
    if (!value) {
        throw new Error(`The form field ${requiredValue} is required`);
    }
    return value;
}
export function requireParameter(parameterName: string, params: Params) {
    const value = params[parameterName];
    if (!value) {
        throw new Error(`Parameter ${parameterName} is missing!`);
    }
    return value;
}
