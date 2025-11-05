import { ICache } from "./ICache.interface";
import { ICacheEntry } from "./ICacheEntry.interface";

export interface ICacheService {
    // Basic operations
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, options?: ICache): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    has(key: string): Promise<boolean>;

    // Bulk operations
    getMany<T>(keys: string[]): Promise<Map<string, T>>;
    setMany<T>(entries: Map<string, T>, options?: ICache): Promise<void>;
    deleteMany(keys: string[]): Promise<void>;

    // Tag-based operations
    getByTag<T>(tag: string): Promise<Map<string, T>>;
    deleteByTag(tag: string): Promise<number>;
    deleteByTags(tags: string[]): Promise<number>;
    getTags(key: string): Promise<string[]>;

    // Pattern-based operations
    getByPattern<T>(pattern: string): Promise<Map<string, T>>;
    deleteByPattern(pattern: string): Promise<number>;

    // Metadata operations
    getMetadata(key: string): Promise<ICacheEntry | null>;
    getAllKeys(): Promise<string[]>;
    getKeysByTag(tag: string): Promise<string[]>;
}