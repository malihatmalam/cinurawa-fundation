const AGGREGATE_ROOT_METADATA = '__aggregateRoot__';

export function AggregateRootDecorator(): ClassDecorator {
    return function(target: Function) {
        Reflect.defineMetadata(AGGREGATE_ROOT_METADATA, true, target);
    };
}

export function isAggregateRoot(target: any): boolean {
    return Reflect.getMetadata(AGGREGATE_ROOT_METADATA, target.constructor)
}