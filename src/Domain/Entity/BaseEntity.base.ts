export interface IEntityEmpty {}

export interface ICacheableEntity {
  readonly cacheId: unknown | null;
}

export interface IEntity<TId> extends IEntityEmpty, ICacheableEntity {
  id: TId | null;
}

export class Entity<TId> implements IEntity<TId> {
  constructor(public id: TId | null) {}

  get cacheId(): unknown | null {
    return this.id;
  }

  public equals(other: Entity<TId> | null | undefined): boolean {
    if (other == null) return false;
    if (this === other) return true;

    if (this.id == null || other.id == null) return false;
    const a: any = this.id;
    const b: any = other.id;

    if (typeof a === 'object' && typeof a.equals === 'function') {
      return a.equals(b);
    }

    return a === b;
  }

  public getHashCode(): number {
    const text = `${this.constructor.name}:${String(this.id)}`;

    let hash = 5381;
    for (let i = 0; i < text.length; i++) {
      hash = (hash * 33) ^ text.charCodeAt(i);
    }

    return hash >>> 0;
  }

  public toString(): string {
    return `${this.constructor.name}(${String(this.id)})`;
  }
}
