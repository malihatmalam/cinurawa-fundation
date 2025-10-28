const ENTITY_METADATA = '__entity__';

export function EntityDecorator(name?: string): ClassDecorator {
    return function(target: Function) {
        Reflect.defineMetadata(ENTITY_METADATA, name || target.name, target);
    };
}

export function getEntityName(target: any): string | undefined {
    return Reflect.getMetadata( ENTITY_METADATA, target.constructor);
}