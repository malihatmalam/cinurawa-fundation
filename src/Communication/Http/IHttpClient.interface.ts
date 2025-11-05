import { AxiosRequestConfig } from 'axios';
import { IHttpResponse } from './IHttpResponse.interface';

export interface IHttpClient {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<IHttpResponse<T>>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IHttpResponse<T>>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IHttpResponse<T>>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IHttpResponse<T>>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<IHttpResponse<T>>;
}
