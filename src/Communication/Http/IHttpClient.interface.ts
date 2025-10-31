import { IHttpResponse } from "./IHttpResponse.interface";

export interface IHttpClient {
    get<T = any>(url: string, config?: any): Promise<IHttpResponse<T>>;
    post<T = any>(url: string, data?: any, config?: any): Promise<IHttpResponse<T>>;
    put<T = any>(url: string, data?: any, config?: any): Promise<IHttpResponse<T>>;
    patch<T = any>(url: string, data?: any, config?: any): Promise<IHttpResponse<T>>;
    delete<T = any>(url: string, config?: any): Promise<IHttpResponse<T>>;
}