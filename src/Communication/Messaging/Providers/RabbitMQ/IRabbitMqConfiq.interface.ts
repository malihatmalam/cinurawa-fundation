export interface IRabbitMqConfig {
    url: string;
    queue?: string;
    exchange?: string;
    exchangeType?: string; 
}