export interface ICacheEntry<T = unknown> {
  key: string;
  value: T;
  timeToLive: number;
  createdAt: Date;
  lastAccessedAt: Date;
  expiresAt: Date;
  isSlidingExpiration: boolean;
  tags: string[];
}
