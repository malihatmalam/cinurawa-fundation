export interface IRabbitMqConfig {
  url: string;
  queue?: string;
  prefetchCount?: number;
}
