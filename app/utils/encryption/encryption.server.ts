import * as crypto from 'crypto';
import * as process from 'process';
import { requireEnv } from '~/utils/env/env.server';

const encryptionConfiguration = {
    key: requireEnv('ENCRYPTION_KEY'),
    algorithm: 'aes-256-cbc',
};

export function encryptString(data: string) {
    const initVector = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        encryptionConfiguration.algorithm,
        Buffer.from(encryptionConfiguration.key),
        initVector
    );
    const dataAsBase64 = Buffer.from(data).toString('base64url');
    const encrypted =
        cipher.update(dataAsBase64, 'base64url', 'base64url') + cipher.final('base64url');
    return `${initVector.toString('hex')}.${encrypted}`;
}

export function decryptString(data: string) {
    const initVector = Buffer.from(data.split('.')[0], 'hex');
    const decipher = crypto.createDecipheriv(
        encryptionConfiguration.algorithm,
        encryptionConfiguration.key,
        initVector
    );
    const dataToDecrypt = data.split('.')[1];
    return decipher.update(dataToDecrypt, 'base64url', 'utf-8') + decipher.final('utf-8');
}
