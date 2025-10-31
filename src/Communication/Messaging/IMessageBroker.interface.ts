import { IMessage } from "./IMessage.interface";

export interface IMessageBroker {
    publish(message: any, options: IMessage): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}