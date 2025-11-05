declare type Buffer = any;

declare namespace NodeJS {
  interface Timeout {}
}

declare const Reflect: any;

declare interface ErrorConstructor {
  captureStackTrace?(targetObject: object, constructorOpt?: Function): void;
}

declare module '@nestjs/common' {
  export const Injectable: (...args: any[]) => ClassDecorator;
  export const Global: (...args: any[]) => ClassDecorator;
  export const Module: (...args: any[]) => ClassDecorator;
  export const Catch: (...args: any[]) => ClassDecorator;
  export const Scope: any;
  export const SetMetadata: (...args: any[]) => any;
  export const HttpStatus: Record<string, number>;
  export type Provider = any;
  export class Logger {
    constructor(context?: string);
    log(message: any, trace?: string): void;
    error(message: any, trace?: string): void;
    warn(message: any, trace?: string): void;
    debug(message: any, trace?: string): void;
    verbose(message: any, trace?: string): void;
  }
  export class HttpException extends Error {
    constructor(message: any, status: number);
    getStatus(): number;
    getResponse(): any;
  }
  export interface ArgumentsHost {
    switchToHttp(): { getResponse<T = any>(): T };
  }
  export interface ExceptionFilter<T = any> {
    catch(exception: T, host: ArgumentsHost): any;
  }
  export type Type<T = any> = new (...args: any[]) => T;
  export interface DynamicModule {
    module: any;
    imports?: any[];
    providers?: any[];
    exports?: any[];
    global?: boolean;
  }
  export interface OnModuleInit {
    onModuleInit(): any;
  }
  export interface OnModuleDestroy {
    onModuleDestroy(): any;
  }
}

declare module '@nestjs/core' {
  export class ModuleRef {
    get<TResult = any>(typeOrToken: any, options?: { strict?: boolean }): TResult;
  }
  export class DiscoveryModule {}
  export class DiscoveryService {
    getProviders(): Array<{ instance: any; metatype: any }>;
  }
}

declare module '@nestjs/testing' {
  export class TestingModule {
    get<TResult = any>(typeOrToken: any, options?: { strict?: boolean }): TResult;
    init(): Promise<this>;
    close(): Promise<void>;
  }

  export class TestingModuleBuilder {
    compile(): Promise<TestingModule>;
  }

  export const Test: {
    createTestingModule(metadata: any): TestingModuleBuilder;
  };
}

declare module '@nestjs/cqrs' {
  export class EventBus {
    publish(event: any): Promise<void>;
  }
}

declare module '@nestjs/microservices' {
  export enum Transport {
    RMQ = 'RMQ',
  }
  export abstract class ClientProxy {
    connect(): Promise<void>;
    emit(pattern: any, data: any): any;
    close(): Promise<void>;
  }
  export const ClientProxyFactory: {
    create(options: any): ClientProxy;
  };
}

declare module '@sendgrid/mail' {
  const mail: {
    setApiKey(key: string): void;
    send(message: any): Promise<any>;
  };
  export = mail;
}

declare module 'amqplib';

declare module 'axios' {
  export type AxiosRequestConfig = any;
  export type AxiosResponse<T = any> = {
    data: T;
    status: number;
    headers: Record<string, string>;
    config?: any;
  };
  export interface AxiosInstance {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    interceptors: {
      request: { use(onFulfilled: (config: any) => any, onRejected?: (error: any) => any): void };
      response: { use(onFulfilled: (response: any) => any, onRejected?: (error: any) => any): void };
    };
  }
  export interface AxiosStatic {
    create(config?: AxiosRequestConfig): AxiosInstance;
  }
  const axios: AxiosStatic;
  export default axios;
}

declare module 'cache-manager';
declare module 'cache-manager-redis-store';

declare module 'crypto' {
  export function randomUUID(): string;
}

declare module 'nodemailer' {
  const nodemailer: {
    createTransport(options: any): {
      sendMail(options: any): Promise<any>;
    };
  };
  export default nodemailer;
}

declare module 'redis' {
  export type RedisClientType = any;
  export function createClient(options: any): RedisClientType;
}

declare module 'express' {
  export interface Response {
    status(code: number): this;
    json(body: any): this;
  }
}

declare module 'reflect-metadata';
