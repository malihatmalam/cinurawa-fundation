import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { CacheOptions, CacheService, CacheStrategy } from '@foundation/Shared/Constants/CacheConstants.constant';
import { ICacheModuleOptions } from './ICacheModuleOptions.interface';
import { ICacheService } from './ICacheService.interface';
import { HybridCacheService } from './Providers/HybridCacheService.service';
import { InMemoryCacheService } from './Providers/InMemoryCacheService.service';
import { RedisCacheService } from './Providers/RedisCacheService.service';

@Global()
@Module({})
export class CacheModule {
  static forRoot(options: ICacheModuleOptions): DynamicModule {
    const cacheServiceProvider: Provider = {
      provide: CacheService,
      useFactory: () => this.createCacheService(options),
    };

    const optionsProvider: Provider = {
      provide: CacheOptions,
      useValue: options,
    };

    return {
      module: CacheModule,
      providers: [cacheServiceProvider, optionsProvider],
      exports: [CacheService, CacheOptions],
      global: true,
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<ICacheModuleOptions> | ICacheModuleOptions;
    inject?: any[];
  }): DynamicModule {
    const cacheServiceProvider: Provider = {
      provide: CacheService,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        return this.createCacheService(config);
      },
      inject: options.inject ?? [],
    };

    const optionsProvider: Provider = {
      provide: CacheOptions,
      useFactory: options.useFactory,
      inject: options.inject ?? [],
    };

    return {
      module: CacheModule,
      providers: [cacheServiceProvider, optionsProvider],
      exports: [CacheService, CacheOptions],
      global: true,
    };
  }

  private static createCacheService(options: ICacheModuleOptions): ICacheService {
    switch (options.strategy) {
      case CacheStrategy.Redis:
        return new RedisCacheService(options.redis?.url);
      case CacheStrategy.InMemory:
        return new InMemoryCacheService();
      case CacheStrategy.Hybrid:
        return new HybridCacheService(new InMemoryCacheService(), new RedisCacheService(options.redis?.url));
      default:
        return new InMemoryCacheService();
    }
  }
}
