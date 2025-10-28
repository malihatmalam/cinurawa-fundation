import { SetMetadata } from "@nestjs/common";

export const COMMAND_HANDLER_METADATA = '__commandHandler__';
export const CommandHandler = (command:Function): ClassDecorator => {
    return SetMetadata(COMMAND_HANDLER_METADATA, command);
}