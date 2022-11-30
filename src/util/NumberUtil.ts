
export class NumberUtil {

    public static equalsWithTolerance(x1: number, x2: number, tolerance: number): boolean {
        return Math.abs(x1 - x2) <= tolerance;
    }

    public static compare(v1: number, v2: number): number {
        if (v1 < v2) {
            return -1;
        }
        if (v1 === v2) {
            return 0;
        }
        return 1;
    }

}

export function isNumber(value: any): boolean {
    return typeof value === 'number';
}

export function isUndefined(value: any): boolean {
    return value === undefined;
}

export function isInfinite(value: number) {
    return value > -Infinity && value < Infinity;
}
