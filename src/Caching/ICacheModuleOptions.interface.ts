import { CacheStrategy } from "@foundation/Shared/Constants/CacheConstants.constant";

export interface ICacheModuleOptions {
  strategy: CacheStrategy;
  redis?: {
    url: string;
    keyPrefix?: string;
  };
  inMemory?: {
    maxSize?: number;
    checkPeriod?: number;
  };
  defaultTTL?: number;
  defaultSlidingExpiration?: boolean;
}