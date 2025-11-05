import { ICacheDecoratorOptions } from '../ICacheDecoratorOptions.interface';

function resolveValue<T>(value: T | ((args: any[]) => T), args: any[]): T {
  return typeof value === 'function' ? (value as (args: any[]) => T)(args) : value;
}

export function Cacheable(options: ICacheDecoratorOptions = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = (this as any).cacheService;

      if (!cacheService) {
        return originalMethod.apply(this, args);
      }

      const cacheKey =
        resolveValue(options.key, args) ?? `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;

      const cachedResult = await cacheService.get(cacheKey);
      if (cachedResult !== null && cachedResult !== undefined) {
        return cachedResult;
      }

      const result = await originalMethod.apply(this, args);

      const tags = resolveValue(options.tags, args) ?? [];

      await cacheService.set(cacheKey, result, {
        timeToLive: options.timeToLive,
        tags,
        isSlidingExpiration: options.isSlidingExpiration ?? true,
      });

      return result;
    };

    return descriptor;
  };
}

export function CacheEvict(tags: string[] | ((args: any[]) => string[])) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = (this as any).cacheService;
      const result = await originalMethod.apply(this, args);

      if (cacheService) {
        const tagsToEvict = resolveValue(tags, args) ?? [];
        if (tagsToEvict.length > 0) {
          await cacheService.deleteByTags(tagsToEvict);
        }
      }

      return result;
    };

    return descriptor;
  };
}

export function CachePut(options: ICacheDecoratorOptions = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = (this as any).cacheService;
      const result = await originalMethod.apply(this, args);

      if (cacheService) {
        const cacheKey =
          resolveValue(options.key, args) ?? `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;
        const tags = resolveValue(options.tags, args) ?? [];

        await cacheService.set(cacheKey, result, {
          timeToLive: options.timeToLive,
          tags,
          isSlidingExpiration: options.isSlidingExpiration ?? true,
        });
      }

      return result;
    };

    return descriptor;
  };
}
