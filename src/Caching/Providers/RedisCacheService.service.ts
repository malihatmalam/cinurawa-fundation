import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ICacheService } from "../ICacheService.interface";
import { createClient, RedisClientType } from "redis";
import { ICache } from "../ICache.interface";
import { ICacheEntry } from "../ICacheEntry.interface";
import { LoggerService } from "@foundation/Logging";

@Injectable()
export class RedisCacheService implements ICacheService, OnModuleDestroy {
  private readonly logger = new LoggerService(RedisCacheService.name);
  private client: RedisClientType;
  private readonly defaultTTL = 3600; // 1 hour
  private readonly tagPrefix = 'tag:';
  private readonly metaPrefix = 'meta:';

  constructor(
    private readonly redisUrl: string = 'redis://localhost:6379',
  ) {
    this.initializeClient();
  }

  private async initializeClient(): Promise<void> {
    this.client = createClient({
      url: this.redisUrl,
    }) as RedisClientType;

    this.client.on('error', (err: any) => {
      this.logger.error('Redis Client Error', err);
    });

    this.client.on('connect', () => {
      this.logger.log('Redis Client Connected');
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const metadata = await this.getMetadata(key);
      
      if (!metadata) {
        return null;
      }

      // Check if expired
      if (new Date() > metadata.expiresAt) {
        await this.delete(key);
        return null;
      }

      // Handle sliding expiration
      if (metadata.isSlidingExpiration) {
        await this.extendExpiration(key, metadata.timeToLive);
      }

      const value = await this.client.get(key);
      
      if (!value) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Error getting cache key: ${key}`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, options?: ICache): Promise<void> {
    try {
      const timeToLive = options?.timeToLive || this.defaultTTL;
      const isSlidingExpiration = options?.isSlidingExpiration ?? true;
      const tags = options?.tags || [];

      const now = new Date();
      const metadata: ICacheEntry<T> = {
        key,
        value,
        timeToLive,
        createdAt: now,
        lastAccessedAt: now,
        expiresAt: new Date(now.getTime() + timeToLive * 1000),
        isSlidingExpiration,
        tags,
      };

      // Set the actual value
      await this.client.setEx(key, timeToLive, JSON.stringify(value));

      // Set metadata
      await this.client.setEx(
        `${this.metaPrefix}${key}`,
        timeToLive,
        JSON.stringify(metadata),
      );

      // Add to tag sets
      if (tags.length > 0) {
        for (const tag of tags) {
          await this.client.sAdd(`${this.tagPrefix}${tag}`, key);
          // Set expiration for tag set (slightly longer than cache)
          await this.client.expire(`${this.tagPrefix}${tag}`, timeToLive + 300);
        }
      }

      this.logger.debug(`Cache set: ${key} with tags: ${tags.join(', ')}`);
    } catch (error) {
      this.logger.error(`Error setting cache key: ${key}`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const metadata = await this.getMetadata(key);

      // Delete the value
      await this.client.del(key);

      // Delete metadata
      await this.client.del(`${this.metaPrefix}${key}`);

      // Remove from tag sets
      if (metadata?.tags) {
        for (const tag of metadata.tags) {
          await this.client.sRem(`${this.tagPrefix}${tag}`, key);
        }
      }

      this.logger.debug(`Cache deleted: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting cache key: ${key}`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.client.flushDb();
      this.logger.log('Cache cleared');
    } catch (error) {
      this.logger.error('Error clearing cache', error);
      throw error;
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      this.logger.error(`Error checking cache key: ${key}`, error);
      return false;
    }
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
    try {
      const keys = await this.client.sMembers(`${this.tagPrefix}${tag}`);
      return await this.getMany<T>(keys);
    } catch (error) {
      this.logger.error(`Error getting cache by tag: ${tag}`, error);
      return new Map();
    }
  }

  async deleteByTag(tag: string): Promise<number> {
    try {
      const keys = await this.client.sMembers(`${this.tagPrefix}${tag}`);
      
      if (keys.length === 0) {
        return 0;
      }

      await this.deleteMany(keys);

      // Delete the tag set itself
      await this.client.del(`${this.tagPrefix}${tag}`);

      this.logger.log(`Deleted ${keys.length} cache entries with tag: ${tag}`);
      return keys.length;
    } catch (error) {
      this.logger.error(`Error deleting cache by tag: ${tag}`, error);
      throw error;
    }
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
    const metadata = await this.getMetadata(key);
    return metadata?.tags || [];
  }

  async getByPattern<T>(pattern: string): Promise<Map<string, T>> {
    try {
      const keys = await this.client.keys(pattern);
      return await this.getMany<T>(keys);
    } catch (error) {
      this.logger.error(`Error getting cache by pattern: ${pattern}`, error);
      return new Map();
    }
  }

  async deleteByPattern(pattern: string): Promise<number> {
    try {
      const keys = await this.client.keys(pattern);
      
      if (keys.length === 0) {
        return 0;
      }

      await this.deleteMany(keys);

      this.logger.log(`Deleted ${keys.length} cache entries matching pattern: ${pattern}`);
      return keys.length;
    } catch (error) {
      this.logger.error(`Error deleting cache by pattern: ${pattern}`, error);
      throw error;
    }
  }

  async getMetadata(key: string): Promise<ICacheEntry | null> {
    try {
      const metaKey = `${this.metaPrefix}${key}`;
      const metadata = await this.client.get(metaKey);

      if (!metadata) {
        return null;
      }

      return JSON.parse(metadata) as ICacheEntry;
    } catch (error) {
      this.logger.error(`Error getting metadata for key: ${key}`, error);
      return null;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return await this.client.keys('*');
    } catch (error) {
      this.logger.error('Error getting all keys', error);
      return [];
    }
  }

  async getKeysByTag(tag: string): Promise<string[]> {
    try {
      return await this.client.sMembers(`${this.tagPrefix}${tag}`);
    } catch (error) {
      this.logger.error(`Error getting keys by tag: ${tag}`, error);
      return [];
    }
  }

  private async extendExpiration(key: string, ttl: number): Promise<void> {
    try {
      const now = new Date();
      const metadata = await this.getMetadata(key);

      if (!metadata) {
        return;
      }

      // Update expiration time
      await this.client.expire(key, ttl);
      await this.client.expire(`${this.metaPrefix}${key}`, ttl);

      // Update metadata
      metadata.lastAccessedAt = now;
      metadata.expiresAt = new Date(now.getTime() + ttl * 1000);

      await this.client.setEx(
        `${this.metaPrefix}${key}`,
        ttl,
        JSON.stringify(metadata),
      );

      this.logger.debug(`Extended expiration for key: ${key}`);
    } catch (error) {
      this.logger.error(`Error extending expiration for key: ${key}`, error);
    }
  }
}