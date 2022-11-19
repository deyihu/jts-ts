import { isNumber, isUndefined } from "../../util/NumberUtil";
import { Coordinate } from "../Coordinate";
import { CoordinateArrays } from "../CoordinateArrays";
import { Coordinates } from "../Coordinates";
import { CoordinateSequence } from "../CoordinateSequence";
import { Envelope } from "../Envelope";

export class CoordinateArraySequence extends CoordinateSequence {
    /**
  * The actual dimension of the coordinates in the sequence.
  * Allowable values are 2, 3 or 4.
  */
    private dimension: number = 3;
    /**
     * The number of measures of the coordinates in the sequence.
     * Allowable values are 0 or 1.
     */
    private measures: number = 0;

    private coordinates: Array<Coordinate>;
    constructor(coordSeq: Array<Coordinate> | number | CoordinateSequence, dimension?: number, measures?: number) {
        super();
        if (coordSeq instanceof CoordinateSequence) {
            if (coordSeq == null) {
                this.coordinates = new Coordinate[0];
                return;
            }
            dimension = coordSeq.getDimension();
            measures = coordSeq.getMeasures();
            this.coordinates = [];
            const coordinates = this.coordinates;

            for (let i = 0; i < coordinates.length; i++) {
                coordinates[i] = coordSeq.getCoordinateCopy(i);
            }
            return;
        }
        if (isNumber(coordSeq) && isUndefined(dimension) && isUndefined(measures)) {
            this.coordinates = [];
            const size = coordSeq;
            for (let i = 0; i < size; i++) {
                this.coordinates[i] = new Coordinate();
            }
            return;
        }
        if (isNumber(coordSeq) && isNumber(dimension) && isUndefined(measures)) {
            this.coordinates = [];
            this.dimension = (dimension as number);
            const size = coordSeq;
            for (let i = 0; i < size; i++) {
                this.coordinates[i] = Coordinates.create((dimension as number));
            }
            return;
        }
        if (isNumber(coordSeq) && isNumber(dimension) && isNumber(measures)) {
            this.coordinates = [];
            this.dimension = (dimension as number);
            this.measures = (measures as number);
            const size = coordSeq;
            for (let i = 0; i < size; i++) {
                this.coordinates[i] = this.createCoordinate();
            }
        }
        if (Array.isArray(coordSeq)) {
            if (isUndefined(dimension)) {
                dimension = CoordinateArrays.dimension(coordSeq);
            }
            if (isUndefined(measures)) {
                measures = CoordinateArrays.measures(coordSeq);
            }
            this.dimension = (dimension as number);
            this.measures = (measures as number);
            this.coordinates = coordSeq;
        }


    }

    /**
     * Constructs a sequence based on the given array
     * of {@link Coordinate}s (the
     * array is not copied).
     * The coordinate dimension defaults to 3.
     *
     * @param coordinates the coordinate array that will be referenced.
     */
    getDimension(): number {
        return this.dimension;
    }
    getMeasures(): number {
        return this.measures;
    }
    getCoordinate(i: number, coords?: Coordinate): Coordinate {
        if (coords) {
            const copy = this.createCoordinate();
            copy.setCoordinate(this.coordinates[i]);
            return copy;
        } else {
            return this.coordinates[i];
        }
    }
    getCoordinateCopy(i: number): Coordinate {
        const copy = this.createCoordinate();
        copy.setCoordinate(this.coordinates[i]);
        return copy;
    }
    getX(index: number): number {
        return this.coordinates[index].x;
    }
    getY(index: number): number {
        return this.coordinates[index].y;
    }
    getZ(index: number): number {
        if (this.hasZ()) {
            return this.coordinates[index].getZ();
        } else {
            return NaN;
        }
    }
    getM(index: number): number {
        if (this.hasM()) {
            return this.coordinates[index].getM();
        }
        else {
            return NaN;
        }
    }
    getOrdinate(index: number, ordinateIndex: number): number {
        const coordinates = this.coordinates;
        switch (ordinateIndex) {
            case CoordinateSequence.X: return coordinates[index].x;
            case CoordinateSequence.Y: return coordinates[index].y;
            default:
                return coordinates[index].getOrdinate(ordinateIndex);
        }
    }
    size(): number {
        return this.coordinates.length;
    }
    setOrdinate(index: number, ordinateIndex: number, value: number) {
        switch (ordinateIndex) {
            case CoordinateSequence.X:
                this.coordinates[index].x = value;
                break;
            case CoordinateSequence.Y:
                this.coordinates[index].y = value;
                break;
            default:
                this.coordinates[index].setOrdinate(ordinateIndex, value);
        }
    }
    toCoordinateArray(): Coordinate[] {
        return this.coordinates;
    }
    expandEnvelope(env: Envelope): Envelope {
        const { coordinates } = this;
        for (let i = 0; i < coordinates.length; i++) {
            env.expandToInclude(coordinates[i]);
        }
        return env;
    }
    clone(): Object {
        return this.copy();
    }
    copy(): CoordinateSequence {
        const cloneCoordinates: Array<Coordinate> = [];
        for (let i = 0; i < this.coordinates.length; i++) {
            const duplicate = this.createCoordinate();
            duplicate.setCoordinate(this.coordinates[i]);
            cloneCoordinates[i] = duplicate;
        }
        return new CoordinateArraySequence(cloneCoordinates, this.dimension, this.measures);
    }
    toString(): string {
        const { coordinates } = this;
        if (coordinates.length > 0) {
            //   StringBuilder strBuilder = new StringBuilder(17 * coordinates.length);
            let str = '(';
            // strBuilder.append('(');
            // strBuilder.append(coordinates[0]);
            str += coordinates[0].toString();
            for (let i = 1; i < coordinates.length; i++) {
                // strBuilder.append(", ");
                str += ',';
                str += coordinates[i].toString();
                // strBuilder.append(coordinates[i]);
            }
            str += ')';
            return str;
            // strBuilder.append(')');
            // return strBuilder.toString();
        } else {
            return "()";
        }
    }

}
