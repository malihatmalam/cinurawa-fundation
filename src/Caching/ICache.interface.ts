export interface ICache {
  timeToLive: number;
  isSlidingExpiration?: boolean;
  tags?: string[];
}
