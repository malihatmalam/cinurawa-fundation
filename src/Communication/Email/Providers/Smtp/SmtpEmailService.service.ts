import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { IEmail } from '../../IEmail.interface';
import { IEmailService } from '../../IEmailService.interface';
import { ISmtpConfig } from './ISmtpConfig.interface';
import { LoggerService } from '@foundation/Logging';

@Injectable()
export class SmtpEmailService implements IEmailService {
  private readonly logger = new LoggerService(SmtpEmailService.name);
  private readonly transporter: any;
  private readonly defaultFrom: string;

  constructor(private readonly config: ISmtpConfig) {
    const mailer = nodemailer as any;
    this.transporter = mailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure ?? false,
      auth: config.auth,
    });
    this.defaultFrom = config.from ?? config.auth.user;
  }

  async send(options: IEmail): Promise<void> {
    this.logger.log(`Send email using SMTP method`);
    await this.transporter.sendMail({
      from: options.from ?? this.defaultFrom,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    });
  }

  async sendBatch(options: IEmail[]): Promise<void> {
    this.logger.log(`Send emails in batch with the number of emails: ${options.length}`);
    await Promise.all(options.map((opt) => this.send(opt)));
  }
}
