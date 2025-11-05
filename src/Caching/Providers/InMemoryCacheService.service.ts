import { Injectable, Logger } from "@nestjs/common";
import { ICacheService } from "../ICacheService.interface";
import { ICacheEntry } from "../ICacheEntry.interface";
import { ICache } from "../ICache.interface";

@Injectable()
export class InMemoryCacheService implements ICacheService {
  private readonly logger = new Logger(InMemoryCacheService.name);
  private readonly cache = new Map<string, ICacheEntry>();
  private readonly tagIndex = new Map<string, Set<string>>();
  private readonly defaultTTL = 3600; // 1 hour
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, 60000);
  }

  onModuleDestroy() {
    clearInterval(this.cleanupInterval);
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (new Date() > entry.expiresAt) {
      await this.delete(key);
      return null;
    }

    // Handle sliding expiration
    if (entry.isSlidingExpiration) {
      const now = new Date();
      entry.lastAccessedAt = now;
      entry.expiresAt = new Date(now.getTime() + entry.timeToLive * 1000);
      this.cache.set(key, entry);
      this.logger.debug(`Extended expiration for key: ${key}`);
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, options?: ICache): Promise<void> {
    const timeToLive = options?.timeToLive || this.defaultTTL;
    const isSlidingExpiration = options?.isSlidingExpiration ?? true;
    const tags = options?.tags || [];

    const now = new Date();
    const entry: ICacheEntry<T> = {
      key,
      value,
      timeToLive,
      createdAt: now,
      lastAccessedAt: now,
      expiresAt: new Date(now.getTime() + timeToLive * 1000),
      isSlidingExpiration,
      tags,
    };

    // Store the entry
    this.cache.set(key, entry);

    // Update tag index
    if (tags.length > 0) {
      for (const tag of tags) {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, new Set());
        }
        this.tagIndex.get(tag)!.add(key);
      }
    }

    this.logger.debug(`Cache set: ${key} with tags: ${tags.join(', ')}`);
  }

  async delete(key: string): Promise<void> {
    const entry = this.cache.get(key);

    if (!entry) {
      return;
    }

    // Remove from cache
    this.cache.delete(key);

    // Remove from tag index
    if (entry.tags) {
      for (const tag of entry.tags) {
        const tagSet = this.tagIndex.get(tag);
        if (tagSet) {
          tagSet.delete(key);
          if (tagSet.size === 0) {
            this.tagIndex.delete(tag);
          }
        }
      }
    }

    this.logger.debug(`Cache deleted: ${key}`);
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.tagIndex.clear();
    this.logger.log('Cache cleared');
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check if expired
    if (new Date() > entry.expiresAt) {
      await this.delete(key);
      return false;
    }

    return true;
  }

  async getMany<T>(keys: string[]): Promise<Map<string, T>> {
    const result = new Map<string, T>();

    for (const key of keys) {
      const value = await this.get<T>(key);
      if (value !== null) {
        result.set(key, value);
      }
    }

    return result;
  }

  async setMany<T>(entries: Map<string, T>, options?: ICache): Promise<void> {
    const promises = Array.from(entries.entries()).map(([key, value]) =>
      this.set(key, value, options),
    );

    await Promise.all(promises);
  }

  async deleteMany(keys: string[]): Promise<void> {
    const promises = keys.map((key) => this.delete(key));
    await Promise.all(promises);
  }

  async getByTag<T>(tag: string): Promise<Map<string, T>> {
    const keys = this.tagIndex.get(tag);

    if (!keys || keys.size === 0) {
      return new Map();
    }

    return await this.getMany<T>(Array.from(keys));
  }

  async deleteByTag(tag: string): Promise<number> {
    const keys = this.tagIndex.get(tag);

    if (!keys || keys.size === 0) {
      return 0;
    }

    const keysArray = Array.from(keys);
    await this.deleteMany(keysArray);

    this.logger.log(`Deleted ${keysArray.length} cache entries with tag: ${tag}`);
    return keysArray.length;
  }

  async deleteByTags(tags: string[]): Promise<number> {
    let totalDeleted = 0;

    for (const tag of tags) {
      const deleted = await this.deleteByTag(tag);
      totalDeleted += deleted;
    }

    return totalDeleted;
  }

  async getTags(key: string): Promise<string[]> {
    const entry = this.cache.get(key);
    return entry?.tags || [];
  }

  async getByPattern<T>(pattern: string): Promise<Map<string, T>> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    const matchingKeys = Array.from(this.cache.keys()).filter((key) =>
      regex.test(key),
    );

    return await this.getMany<T>(matchingKeys);
  }

  async deleteByPattern(pattern: string): Promise<number> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    const matchingKeys = Array.from(this.cache.keys()).filter((key) =>
      regex.test(key),
    );

    if (matchingKeys.length === 0) {
      return 0;
    }

    await this.deleteMany(matchingKeys);

    this.logger.log(
      `Deleted ${matchingKeys.length} cache entries matching pattern: ${pattern}`,
    );
    return matchingKeys.length;
  }

  async getMetadata(key: string): Promise<ICacheEntry | null> {
    return this.cache.get(key) || null;
  }

  async getAllKeys(): Promise<string[]> {
    return Array.from(this.cache.keys());
  }

  async getKeysByTag(tag: string): Promise<string[]> {
    const keys = this.tagIndex.get(tag);
    return keys ? Array.from(keys) : [];
  }

  private cleanupExpired(): void {
    const now = new Date();
    let expiredCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.delete(key);
        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      this.logger.debug(`Cleaned up ${expiredCount} expired cache entries`);
    }
  }

  // Additional helper method to get cache statistics
  getStatistics() {
    const now = new Date();
    let totalSize = 0;
    let expiredCount = 0;

    for (const entry of this.cache.values()) {
      totalSize += JSON.stringify(entry.value).length;
      if (now > entry.expiresAt) {
        expiredCount++;
      }
    }

    return {
      totalKeys: this.cache.size,
      totalTags: this.tagIndex.size,
      totalMemoryUsage: totalSize,
      expiredEntries: expiredCount,
      activeEntries: this.cache.size - expiredCount,
    };
  }
}