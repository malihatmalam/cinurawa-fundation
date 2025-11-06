import 'reflect-metadata';

const EntityMetadata = '__entity__';

export function EntityDecorator(name?: string): ClassDecorator {
  return function (target: Function) {
    (Reflect as any).defineMetadata(EntityMetadata, name ?? target.name, target);
  };
}

export function getEntityName(target: any): string | undefined {
  return (Reflect as any).getMetadata(EntityMetadata, target.constructor);
}
