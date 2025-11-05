import { ICacheDecoratorOptions } from "../ICacheDecoratorOptions.interface";

export function Cacheable(options: ICacheDecoratorOptions = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = (this as any).cacheService;

      if (!cacheService) {
        console.warn('CacheService not found, executing method without caching');
        return originalMethod.apply(this, args);
      }

      const cacheKey =
        typeof options.key === 'function'
          ? options.key(args)
          : options.key || `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;

      const cachedResult = await cacheService.get(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }

      const result = await originalMethod.apply(this, args);

      const tags =
        typeof options.tags === 'function'
          ? options.tags(args)
          : options.tags || [];

      await cacheService.set(cacheKey, result, {
        timeToLive: options.timeToLive,
        tags,
        slidingExpiration: options.isSlidingExpiration ?? true,
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
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = (this as any).cacheService;

      const result = await originalMethod.apply(this, args);

      if (cacheService) {
        const tagsToEvict = typeof tags === 'function' ? tags(args) : tags;
        await cacheService.deleteByTags(tagsToEvict);
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
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = (this as any).cacheService;

      const result = await originalMethod.apply(this, args);

      if (cacheService) {
        const cacheKey =
          typeof options.key === 'function'
            ? options.key(args)
            : options.key || `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;

        const tags =
          typeof options.tags === 'function'
            ? options.tags(args)
            : options.tags || [];

        await cacheService.set(cacheKey, result, {
          timeToLive: options.timeToLive,
          tags,
          slidingExpiration: options.isSlidingExpiration ?? true,
        });
      }

      return result;
    };

    return descriptor;
  };
}