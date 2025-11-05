export interface ICacheEntry<T = any> {
    key: string;
    value: T;
    timeToLive: number;
    createdAt: Date;
    lastAccessedAt: Date;
    expiresAt: Date;
    isSlidingExpiration: boolean;
    tags: string[];
}