export interface IEmailAttachment {
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
}