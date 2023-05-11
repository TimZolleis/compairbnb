export class EnvRequiredException extends Error {
    constructor(requiredEnv: string) {
        super(
            `The ENV variable ${requiredEnv} seems to be missing in this deployment. Please check the projects configuration!`
        );
    }
}
