import { IEmail } from './IEmail.interface';

export interface IEmailService {
  send(options: IEmail): Promise<void>;
  sendBatch(options: IEmail[]): Promise<void>;
}
