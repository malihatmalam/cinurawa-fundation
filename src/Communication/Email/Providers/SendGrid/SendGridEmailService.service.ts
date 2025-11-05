import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { IEmail } from '../../IEmail.interface';
import { IEmailService } from '../../IEmailService.interface';
import { ISendGridConfig } from './ISendGridConfig.interface';

@Injectable()
export class SendGridEmailService implements IEmailService {
  private readonly defaultFrom: string;

  constructor(private readonly config: ISendGridConfig) {
    sgMail.setApiKey(config.apiKey);
    this.defaultFrom = config.from ?? '';
  }

  async send(options: IEmail): Promise<void> {
    const message = {
      from: options.from ?? this.defaultFrom,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments?.map((att) => ({
        content: typeof att.content === 'string' ? att.content : att.content?.toString('base64'),
        filename: att.filename,
        type: att.contentType,
        disposition: 'attachment',
      })),
    };

    await (sgMail as any).send(message);
  }

  async sendBatch(options: IEmail[]): Promise<void> {
    await Promise.all(options.map((opt) => this.send(opt)));
  }
}
