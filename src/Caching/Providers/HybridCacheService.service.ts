import { ICacheService } from "../ICacheService.interface";
import { InMemoryCacheService } from "./InMemoryCacheService.service";
import { RedisCacheService } from "./RedisCacheService.service";

export class HybridCacheService implements ICacheService {
    constructor(
        private readonly l1Cache: InMemoryCacheService,
        private readonly l2Cache: RedisCacheService,
    ) { }

    async get<T>(key: string): Promise<T | null> {
        let value = await this.l1Cache.get<T>(key);
        if (value !== null) return value;

        value = await this.l2Cache.get<T>(key);
        if (value !== null) {
            const metadata = await this.l2Cache.getMetadata(key);
            if (metadata) {
                await this.l1Cache.set(key, value, {
                    timeToLive: metadata.timeToLive,
                    tags: metadata.tags,
                    isSlidingExpiration: metadata.isSlidingExpiration,
                });
            }
        }

        return value;
    }

    async set<T>(key: string, value: T, options?: any): Promise<void> {
        await Promise.all([
            this.l1Cache.set(key, value, options),
            this.l2Cache.set(key, value, options),
        ]);
    }

    async delete(key: string): Promise<void> {
        await Promise.all([
            this.l1Cache.delete(key),
            this.l2Cache.delete(key),
        ]);
    }

    async clear(): Promise<void> {
        await Promise.all([
            this.l1Cache.clear(),
            this.l2Cache.clear(),
        ]);
    }

    async has(key: string): Promise<boolean> {
        const l1Has = await this.l1Cache.has(key);
        if (l1Has) return true;
        return await this.l2Cache.has(key);
    }

    async getMany<T>(keys: string[]): Promise<Map<string, T>> {
        const result = new Map<string, T>();
        const missingKeys: string[] = [];

        for (const key of keys) {
            const value = await this.l1Cache.get<T>(key);
            if (value !== null) {
                result.set(key, value);
            } else {
                missingKeys.push(key);
            }
        }

        if (missingKeys.length > 0) {
            const l2Results = await this.l2Cache.getMany<T>(missingKeys);
            for (const [key, value] of l2Results.entries()) {
                result.set(key, value);
                const metadata = await this.l2Cache.getMetadata(key);
                if (metadata) {
                    await this.l1Cache.set(key, value, {
                        timeToLive: metadata.timeToLive,
                        tags: metadata.tags,
                        isSlidingExpiration: metadata.isSlidingExpiration,
                    });
                }
            }
        }

        return result;
    }

    async setMany<T>(entries: Map<string, T>, options?: any): Promise<void> {
        await Promise.all([
            this.l1Cache.setMany(entries, options),
            this.l2Cache.setMany(entries, options),
        ]);
    }

    async deleteMany(keys: string[]): Promise<void> {
        await Promise.all([
            this.l1Cache.deleteMany(keys),
            this.l2Cache.deleteMany(keys),
        ]);
    }

    async getByTag<T>(tag: string): Promise<Map<string, T>> {
        return await this.l2Cache.getByTag<T>(tag);
    }

    async deleteByTag(tag: string): Promise<number> {
        const [l1Count, l2Count] = await Promise.all([
            this.l1Cache.deleteByTag(tag),
            this.l2Cache.deleteByTag(tag),
        ]);
        return Math.max(l1Count, l2Count);
    }

    async deleteByTags(tags: string[]): Promise<number> {
        const [l1Count, l2Count] = await Promise.all([
            this.l1Cache.deleteByTags(tags),
            this.l2Cache.deleteByTags(tags),
        ]);
        return Math.max(l1Count, l2Count);
    }

    async getTags(key: string): Promise<string[]> {
        return await this.l2Cache.getTags(key);
    }

    async getByPattern<T>(pattern: string): Promise<Map<string, T>> {
        return await this.l2Cache.getByPattern<T>(pattern);
    }

    async deleteByPattern(pattern: string): Promise<number> {
        const [l1Count, l2Count] = await Promise.all([
            this.l1Cache.deleteByPattern(pattern),
            this.l2Cache.deleteByPattern(pattern),
        ]);
        return Math.max(l1Count, l2Count);
    }

    async getMetadata(key: string): Promise<any> {
        return await this.l2Cache.getMetadata(key);
    }

    async getAllKeys(): Promise<string[]> {
        return await this.l2Cache.getAllKeys();
    }

    async getKeysByTag(tag: string): Promise<string[]> {
        return await this.l2Cache.getKeysByTag(tag);
    }
}