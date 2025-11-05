import { IMessage } from './IMessage.interface';

export interface IMessageBroker {
  publish(message: unknown, options: IMessage): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
