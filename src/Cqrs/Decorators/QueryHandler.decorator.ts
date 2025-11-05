import { SetMetadata } from '@nestjs/common';

export const QUERY_HANDLER_METADATA = '__queryHandler__';

export const QueryHandler = (query: Function): ClassDecorator => SetMetadata(QUERY_HANDLER_METADATA, query);
