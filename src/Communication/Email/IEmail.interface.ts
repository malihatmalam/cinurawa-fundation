import { IEmailAttachment } from "./IEmailAttachment.interface";

export interface IEmail {
    from?: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: IEmailAttachment[];
}



