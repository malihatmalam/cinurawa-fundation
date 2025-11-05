import { CacheOptions, CacheService, CacheStrategy } from "@foundation/Shared/Constants/CacheConstants.constant";
import { DynamicModule, Module, Provider } from "@nestjs/common";
import { ICacheModuleOptions } from "./ICacheModuleOptions.interface";
import { RedisCacheService } from "./Providers/RedisCacheService.service";
import { InMemoryCacheService } from "./Providers/InMemoryCacheService.service";
import { HybridCacheService } from "./Providers/HybridCacheService.service";

@Module({})
export class CacheModule {
  static forRoot(options: ICacheModuleOptions): DynamicModule {
    const cacheServiceProvider: Provider = {
      provide: CacheService,
      useFactory: () => {
        switch (options.strategy) {
          case CacheStrategy.Redis:
            return new RedisCacheService(options.redis?.url);
          case CacheStrategy.InMemory:
            return new InMemoryCacheService();
          case CacheStrategy.Hybrid:
            return new HybridCacheService(
              new InMemoryCacheService(),
              new RedisCacheService(options.redis?.url),
            );
          default:
            return new InMemoryCacheService();
        }
      },
    };

    const optionsProvider: Provider = {
      provide: CacheOptions,
      useValue: options,
    };

    return {
      module: CacheModule,
      providers: [
        cacheServiceProvider,
        optionsProvider,
        {
          provide: ICacheService,
          useExisting: CacheService,
        },
      ],
      exports: [CacheService, ICacheService, CacheOptions],
      global: true,
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<ICacheModuleOptions> | CacheModuleOptions;
    inject?: any[];
  }): DynamicModule {
    const cacheServiceProvider: Provider = {
      provide: CacheService,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        
        switch (config.strategy) {
          case CacheStrategy.Redis:
            return new RedisCacheService(config.redis?.url);
          case CacheStrategy.InMemory:
            return new InMemoryCacheService();
          case CacheStrategy.Hybrid:
            return new HybridCacheService (
              new InMemoryCacheService(),
              new RedisCacheService(config.redis?.url),
            );
          default:
            return new InMemoryCacheService();
        }
      },
      inject: options.inject || [],
    };

    return {
      module: CacheModule,
      providers: [
        cacheServiceProvider,
        {
          provide: ICacheService,
          useExisting: CacheService,
        },
      ],
      exports: [CacheService, ICacheService],
      global: true,
    };
  }
}