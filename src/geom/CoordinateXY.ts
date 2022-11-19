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
 * Coordinate subclass supporting XY ordinates.
 * <p>
 * This data object is suitable for use with coordinate sequences with <tt>dimension</tt> = 2.
 * <p>
 * The {@link Coordinate#z} field is visible, but intended to be ignored.
 *
 * @since 1.16
 */
export class CoordinateXY extends Coordinate {
    // private static final long serialVersionUID = 3532307803472313082L;

    /** Standard ordinate index value for X */
    public static X: number = 0;

    /** Standard ordinate index value for Y */
    public static Y: number = 1;

    /** CoordinateXY does not support Z values. */
    public static Z: number = -1;

    /** CoordinateXY does not support M measures. */
    public static M: number = -1;

    /** Default constructor */
    public constructor(x?: number | Coordinate | CoordinateXY, y?: number) {
        if (x === undefined) {
            super();
            this.type = 'CoordinateXY';
        } else if (typeof x === 'number') {
            super(x, y, Coordinate.NULL_ORDINATE);
            this.type = 'CoordinateXY';
        } else if (x instanceof Coordinate) {
            super(x.x, x.y);
            this.type = 'CoordinateXY';
        }

    }

    /**
     * Constructs a CoordinateXY instance with the given ordinates.
     * 
     * @param x the X ordinate
     * @param y the Y ordinate
     */
    // public CoordinateXY(double x, double y) {
    //     super(x, y, Coordinate.NULL_ORDINATE);
    // }

    /**
     * Constructs a CoordinateXY instance with the x and y ordinates of the given Coordinate.
     * 
     * @param coord the Coordinate providing the ordinates
     */
    // public CoordinateXY(Coordinate coord) {
    //     super(coord.x, coord.y);
    // }

    /**
     * Constructs a CoordinateXY instance with the x and y ordinates of the given CoordinateXY.
     * 
     * @param coord the CoordinateXY providing the ordinates
     */
    // public CoordinateXY(CoordinateXY coord) {
    //     super(coord.x, coord.y);
    // }

    /**
     * Creates a copy of this CoordinateXY.
     * 
     * @return a copy of this CoordinateXY
     */
    public copy(): CoordinateXY {
        return new CoordinateXY(this);
    }

    /**
     * Create a new Coordinate of the same type as this Coordinate, but with no values.
     * 
     * @return a new Coordinate
     */
    // @Override
    public create(): Coordinate {
        return new CoordinateXY();
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
    }

    // @Override
    public getOrdinate(ordinateIndex: number): number {
        switch (ordinateIndex) {
            case CoordinateXY.X: return this.x;
            case CoordinateXY.Y: return this.y;
        }
        return NaN;
        // disable for now to avoid regression issues
        //throw new IllegalArgumentException("Invalid ordinate index: " + ordinateIndex);
    }

    // @Override
    public setOrdinate(ordinateIndex: number, value: number) {
        switch (ordinateIndex) {
            case CoordinateXY.X:
                this.x = value;
                break;
            case CoordinateXY.Y:
                this.y = value;
                break;
            default:
                throw new Error("Invalid ordinate index: " + ordinateIndex);
        }
    }

    public toString(): string {
        // return "(" + x + ", " + y + ")";
        return `(${this.x},${this.y})`;
    }
}