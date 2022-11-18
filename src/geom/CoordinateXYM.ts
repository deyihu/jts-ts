/*
 * Copyright (c) 2018 Vivid Solutions
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License 2.0
 * and Eclipse Distribution License v. 1.0 which accompanies this distribution.
 * The Eclipse Public License is available at http://www.eclipse.org/legal/epl-v20.html
 * and the Eclipse Distribution License is available at
 *
 * http://www.eclipse.org/org/documents/edl-v10.php.
 */
// package org.locationtech.jts.geom;

import { Coordinate } from "./Coordinate";

/**
 * Coordinate subclass supporting XYM ordinates.
 * <p>
 * This data object is suitable for use with coordinate sequences with <tt>dimension</tt> = 3 and <tt>measures</tt> = 1.
 * <p>
 * The {@link Coordinate#z} field is visible, but intended to be ignored.
 * 
 * @since 1.16
 */
export class CoordinateXYM extends Coordinate {
    // private static final long serialVersionUID = 2842127537691165613L;

    /** Standard ordinate index value for X */
    public static X: number = 0;

    /** Standard ordinate index value for Y */
    public static Y: number = 1;

    /** CoordinateXYM does not support Z values. */
    public static Z: number = -1;

    /**
     * Standard ordinate index value for M in XYM sequences.
     *
     * <p>This constant assumes XYM coordinate sequence definition.  Check this assumption using
     * {@link CoordinateSequence#getDimension()} and {@link CoordinateSequence#getMeasures()} before use.
     */
    public static M: number = 2;

    /** Default constructor */
    // public constructor() {
    //     super();
    //     this.m = 0.0;
    // }

    /**
     * Constructs a CoordinateXYM instance with the given ordinates and measure.
     * 
     * @param x the X ordinate
     * @param y the Y ordinate
     * @param m the M measure value
     */
    public constructor(x?: number | undefined | Coordinate | CoordinateXYM, y?: number, m?: number) {
        if (x === undefined) {
            super();
            this.m = 0;
            this.type = 'CoordinateXYM';
        } else if (typeof x === 'number') {
            super(x, y, Coordinate.NULL_ORDINATE);
            this.m = (m as number);
            this.type = 'CoordinateXYM';
        } else if (x instanceof CoordinateXYM) {
            super(x.x, x.y);
            this.m = x.m;
            this.type = 'CoordinateXYM';
        } else if (x instanceof Coordinate) {
            super(x.x, x.y);
            this.m = this.getM();
            this.type = 'CoordinateXYM';
        }

    }

    /**
     * Constructs a CoordinateXYM instance with the x and y ordinates of the given Coordinate.
     * 
     * @param coord the coordinate providing the ordinates
     */
    // public CoordinateXYM(Coordinate coord) {
    //     super(coord.x, coord.y);
    //     m = getM();
    // }

    /**
     * Constructs a CoordinateXY instance with the x and y ordinates of the given CoordinateXYM.
     * 
     * @param coord the coordinate providing the ordinates
     */
    // public CoordinateXYM(CoordinateXYM coord) {
    //     super(coord.x, coord.y);
    //     m = coord.m;
    // }

    /**
     * Creates a copy of this CoordinateXYM.
     * 
     * @return a copy of this CoordinateXYM
     */
    public copy(): CoordinateXYM {
        return new CoordinateXYM(this);
    }

    /**
     * Create a new Coordinate of the same type as this Coordinate, but with no values.
     * 
     * @return a new Coordinate
     */
    // @Override
    public create(): Coordinate {
        return new CoordinateXYM();
    }

    /** The m-measure. */
    protected m: number;

    /** The m-measure, if available. */
    public getM(): number {
        return this.m;
    }

    public setM(m: number) {
        this.m = m;
    }

    /** The z-ordinate is not supported */
    // @Override
    public getZ(): number {
        return Coordinate.NULL_ORDINATE;
    }

    /** The z-ordinate is not supported */
    // @Override
    public setZ(z: number) {
        throw new Error("CoordinateXY dimension 2 does not support z-ordinate");
    }

    // @Override
    public setCoordinate(other: Coordinate) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.getZ();
        this.m = other.getM();
    }

    // @Override
    public getOrdinate(ordinateIndex: number): number {
        switch (ordinateIndex) {
            case CoordinateXYM.X: return this.x;
            case CoordinateXYM.Y: return this.y;
            case CoordinateXYM.M: return this.m;
        }
        throw new Error("Invalid ordinate index: " + ordinateIndex);
    }

    // @Override
    public setOrdinate(ordinateIndex: number, value: number) {
        switch (ordinateIndex) {
            case CoordinateXYM.X:
                this.x = value;
                break;
            case CoordinateXYM.Y:
                this.y = value;
                break;
            case CoordinateXYM.M:
                this.m = value;
                break;
            default:
                throw new Error("Invalid ordinate index: " + ordinateIndex);
        }
    }

    public toString(): string {
        // return "(" + x + ", " + y + " m=" + getM() + ")";
        return `(${this.x},${this.y} m=${this.getM()})`;
    }
}