export interface ISerializer<T> {

    serialize(object: T): string;
    unserialize(json: string): T | undefined;

}