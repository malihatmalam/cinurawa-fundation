import 'reflect-metadata';

const AggregateRootMetadata = '__aggregateRoot__';

export function AggregateRootDecorator(): ClassDecorator {
  return function (target: Function) {
    (Reflect as any).defineMetadata(AggregateRootMetadata, true, target);
  };
}

export function isAggregateRoot(target: any): boolean {
  return (Reflect as any).getMetadata(AggregateRootMetadata, target.constructor) === true;
}
