import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { IMessage } from '../../IMessage.interface';
import { IMessageBroker } from '../../IMessageBroker.interface';
import { IRabbitMqConfig } from './IRabbitMqConfig.interface';
import { LoggerService } from '@foundation/Logging';

@Injectable()
export class RabbitMqService implements IMessageBroker, OnModuleDestroy {
  private client: ClientProxy;
  
  private readonly logger = new LoggerService(RabbitMqService.name);
  private isConnected = false;

  constructor(private readonly config: IRabbitMqConfig) {
    this.client = this.createClient();
  }

  private createClient(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.config.url],
        queue: this.config.queue ?? 'default_queue',
        queueOptions: {
          durable: true,
        },
        noAck: false,
        prefetchCount: this.config.prefetchCount ?? 1,
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      this.logger.warn('Already connected to RabbitMQ');
      return;
    }

    try {
      await this.client.connect();
      this.isConnected = true;
      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  async publish(message: unknown, options: IMessage): Promise<void> {
    const pattern = options.routingKey ?? 'default.pattern';

    try {
      await lastValueFrom(this.client.emit(pattern, message));
      this.logger.debug(`Published message with pattern ${pattern}`);
    } catch (error) {
      this.logger.error(`Error publishing to ${pattern}`, error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.client.close();
      this.isConnected = false;
      this.logger.log('Disconnected from RabbitMQ');
    } catch (error) {
      this.logger.error('Error disconnecting from RabbitMQ', error);
    }
  }

  getClient(): ClientProxy {
    return this.client;
  }
}
