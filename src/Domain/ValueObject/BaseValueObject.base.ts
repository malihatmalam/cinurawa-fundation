export abstract class ValueObject<
    T extends Record<string, any> = Record<string, any>,
> {
    constructor() { }

    /**
     * Mengembalikan daftar nilai-nilai atomic (properti yang membentuk identitas nilai).
     * Kelas turunan wajib override method ini.
     */
    protected abstract getAtomicValues(): Iterable<unknown>;

    public equals(other?: ValueObject<T> | null): boolean {
        if (other == null) return false;
        if (this === other) return true;

        const thisValues = Array.from(this.getAtomicValues());
        const otherValues = Array.from(other.getAtomicValues());

        if (thisValues.length !== otherValues.length) return false;

        for (let i = 0; i < thisValues.length; i++) {
            const a = thisValues[i];
            const b = otherValues[i];

            if (a instanceof ValueObject && b instanceof ValueObject) {
                if (!a.equals(b)) return false;
            } else if (a !== b) {
                return false;
            }
        }

        return true;
    }

    /**
     * Menghasilkan hash sederhana berdasarkan nilai atomic.
     * Tidak untuk keamanan; hanya untuk keperluan koleksi seperti Map/Set.
     */
    public getHashCode(): number {
        const values = Array.from(this.getAtomicValues()).map(v => String(v)).join("|");
        let hash = 5381;
        for (let i = 0; i < values.length; i++) {
            hash = (hash * 33) ^ values.charCodeAt(i);
        }
        return hash >>> 0;
    }

    /**
     * Representasi string dari ValueObject
     */
    public toString(): string {
        const values = Array.from(this.getAtomicValues());
        return `${this.constructor.name}(${values.join(", ")})`;
    }
}
