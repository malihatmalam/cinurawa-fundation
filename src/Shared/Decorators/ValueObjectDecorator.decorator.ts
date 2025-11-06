import 'reflect-metadata';

const ValueObjectMetadata = '__valueObject__';

export function ValueObjectDecorator(): ClassDecorator {
  return function (target: Function) {
    (Reflect as any).defineMetadata(ValueObjectMetadata, true, target);
  };
}

export function isValueObject(target: any): boolean {
  return (Reflect as any).getMetadata(ValueObjectMetadata, target.constructor) === true;
}
