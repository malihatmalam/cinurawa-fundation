import { randomUUID } from 'crypto';

export interface ICommand {
  readonly commandId: string;
  readonly timestamp: Date;
}

export abstract class Command implements ICommand {
  public readonly commandId: string;
  public readonly timestamp: Date;

  protected constructor() {
    this.commandId = randomUUID();
    this.timestamp = new Date();
  }
}
