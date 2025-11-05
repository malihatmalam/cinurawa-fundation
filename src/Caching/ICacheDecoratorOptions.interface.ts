export interface ICacheDecoratorOptions {
  key?: string | ((args: any[]) => string);
  timeToLive?: number;
  tags?: string[] | ((args: any[]) => string[]);
  isSlidingExpiration?: boolean;
}