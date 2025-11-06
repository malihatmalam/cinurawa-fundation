import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IHttpClient } from './IHttpClient.interface';
import { IHttpClientConfig } from './IHttpClientConfig.interface';
import { IHttpResponse } from './IHttpResponse.interface';
import { LoggerService } from '@foundation/Logging';

@Injectable()
export class HttpClientService implements IHttpClient {
  private readonly client: AxiosInstance;
  private readonly logger = new LoggerService(HttpClientService.name);
  private readonly retries: number;
  private readonly retryDelay: number;

  constructor(config: IHttpClientConfig = {}) {
    this.retries = config.retries ?? 3;
    this.retryDelay = config.retryDelay ?? 1000;

    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout ?? 30000,
      headers: config.headers ?? {},
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        this.logger.debug(`Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error('Request Error', error);
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => {
        this.logger.debug(`Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        const config = error.config as AxiosRequestConfig & { _retry?: number };

        if (!config) {
          return Promise.reject(error);
        }

        config._retry = config._retry ?? 0;

        if (config._retry < this.retries && this.shouldRetry(error)) {
          config._retry += 1;
          this.logger.warn(`Retrying request (${config._retry}/${this.retries}): ${config.url}`);

          await this.delay(this.retryDelay * config._retry);
          return this.client.request(config);
        }

        this.logger.error('Response Error', error.message);
        return Promise.reject(error);
      },
    );
  }

  private shouldRetry(error: any): boolean {
    return !error.response || error.response.status === 429 || error.response.status >= 500;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private transformResponse<T>(response: AxiosResponse<T>): IHttpResponse<T> {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
    };
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<IHttpResponse<T>> {
    const response = await this.client.get<T>(url, config);
    return this.transformResponse(response);
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IHttpResponse<T>> {
    const response = await this.client.post<T>(url, data, config);
    return this.transformResponse(response);
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IHttpResponse<T>> {
    const response = await this.client.put<T>(url, data, config);
    return this.transformResponse(response);
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IHttpResponse<T>> {
    const response = await this.client.patch<T>(url, data, config);
    return this.transformResponse(response);
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<IHttpResponse<T>> {
    const response = await this.client.delete<T>(url, config);
    return this.transformResponse(response);
  }
}
