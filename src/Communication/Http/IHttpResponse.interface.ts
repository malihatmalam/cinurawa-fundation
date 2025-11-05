export interface IHttpResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}
