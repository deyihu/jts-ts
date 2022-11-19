
export class NumberUtil {

    public static equalsWithTolerance(x1: number, x2: number, tolerance: number): boolean {
        return Math.abs(x1 - x2) <= tolerance;
    }

}

export function isNumber(value: any) {
    return typeof value === 'number';
}

export function isUndefined(value: any) {
    return value === undefined;
}
