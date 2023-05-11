import * as process from 'process';
import { EnvRequiredException } from '~/exception/EnvRequiredException';

export function requireEnv(key: string) {
    const value = process.env[key];
    if (!value) {
        throw new EnvRequiredException(key);
    }
    return value;
    l;
}
