const VALUE_OBJECT_METADATA = '__valueObject__';

export function ValueObjectDecorator(): ClassDecorator {
    return function (target: Function) {
        Reflect.defineMetadata(VALUE_OBJECT_METADATA, true, target);
    };
}

export function isValueObject(target: any): boolean {
    return Reflect.getMetadata(VALUE_OBJECT_METADATA, target.constructor) === true;
}