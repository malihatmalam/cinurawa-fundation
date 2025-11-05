export enum CacheStrategy {
    Redis = 'redis',
    InMemory = 'in-memory',
    Hybrid = 'hybrid'
}

export const CacheService = 'CACHE_SERVICE';
export const CacheOptions = 'CACHE_OPTIONS';

export const CacheKeyMetadata = 'cache:key';
export const CacheTtlMetadata = 'cache:ttl';
export const CacheTagsMetadata = 'cache:tags';
export const CacheSlidingMetadata = 'cache:sliding';