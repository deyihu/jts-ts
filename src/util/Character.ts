export class Character {

    public static isWhitespace(str: string): boolean {
        return str === ' ' || str === '\n' || str === '\t';
    }

    public static isDigit(str: string): boolean {
        const num = parseInt(str);
        return typeof num === 'number';
    }
}