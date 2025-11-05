import 'reflect-metadata';

const ENTITY_METADATA = '__entity__';

export function EntityDecorator(name?: string): ClassDecorator {
  return function (target: Function) {
    (Reflect as any).defineMetadata(ENTITY_METADATA, name ?? target.name, target);
  };
}

export function getEntityName(target: any): string | undefined {
  return (Reflect as any).getMetadata(ENTITY_METADATA, target.constructor);
}
