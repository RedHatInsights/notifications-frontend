export type OnDelete<T> = (toDelete: T) => boolean | Promise<boolean>;
