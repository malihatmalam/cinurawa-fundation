import 'reflect-metadata';

const AGGREGATE_ROOT_METADATA = '__aggregateRoot__';

export function AggregateRootDecorator(): ClassDecorator {
  return function (target: Function) {
    (Reflect as any).defineMetadata(AGGREGATE_ROOT_METADATA, true, target);
  };
}

export function isAggregateRoot(target: any): boolean {
  return (Reflect as any).getMetadata(AGGREGATE_ROOT_METADATA, target.constructor) === true;
}
