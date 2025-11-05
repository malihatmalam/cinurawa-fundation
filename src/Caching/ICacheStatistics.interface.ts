export interface ICacheStatistics {
    totalKeys: number;
    totalMemoryUsage: number;
    hitRate: number;
    missRate: number;
    averageAccessTime: number;
}