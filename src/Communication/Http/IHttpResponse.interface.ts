export interface IHttpResponse<T = any> {
    data: T;
    status: number;
    headers: Record<string, string>;
}