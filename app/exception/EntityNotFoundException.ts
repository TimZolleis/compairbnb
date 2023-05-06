export class EntityNotFoundException extends Error {
    constructor(entity: string) {
        super(`There was no matching ${entity} found`);
    }
}
