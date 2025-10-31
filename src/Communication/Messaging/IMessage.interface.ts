export interface IMessage {
    routingKey?: string;
    exchange?: string;
    persistent?: boolean;
    headers?: Record<string, any>;
    priority?: number;
}