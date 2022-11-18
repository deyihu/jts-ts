/*
 * Copyright (c) 2016 Vivid Solutions.
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
 * Coordinate subclass supporting XYZM ordinates.
 * <p>
 * This data object is suitable for use with coordinate sequences with <tt>dimension</tt> = 4 and <tt>measures</tt> = 1.
 *
 * @since 1.16
 */
export class CoordinateXYZM extends Coordinate {
    // private static final long serialVersionUID = -8763329985881823442L;

    /** Default constructor */
    // public CoordinateXYZM() {
    //     super();
    //     this.m = 0.0;
    // }

    /**
     * Constructs a CoordinateXYZM instance with the given ordinates and measure.
     * 
     * @param x the X ordinate
     * @param y the Y ordinate
     * @param z the Z ordinate
     * @param m the M measure value
     */
    public constructor(x?: undefined | number | Coordinate | CoordinateXYZM, y?: number, z?: number, m?: number) {
        if (x === undefined) {
            super();
            this.m = 0.0;
            this.type = 'CoordinateXYZM';
        } else if (typeof x === 'number') {
            super(x, y, z);
            this.m = (m as number);
            this.type = 'CoordinateXYZM';
        } else if (x instanceof CoordinateXYZM) {
            super(x);
            this.m = x.m;
            this.type = 'CoordinateXYZM';
        } else if (x instanceof Coordinate) {
            super(x);
            this.m = this.getM();
            this.type = 'CoordinateXYZM';
        }
    }

    /**
     * Constructs a CoordinateXYZM instance with the ordinates of the given Coordinate.
     * 
     * @param coord the coordinate providing the ordinates
     */
    // public CoordinateXYZM(Coordinate coord) {
    //     super(coord);
    //     m = getM();
    // }

    /**
     * Constructs a CoordinateXYZM instance with the ordinates of the given CoordinateXYZM.
     * 
     * @param coord the coordinate providing the ordinates
     */
    // public CoordinateXYZM(CoordinateXYZM coord) {
    //     super(coord);
    //     m = coord.m;
    // }

    /**
     * Creates a copy of this CoordinateXYZM.
     * 
     * @return a copy of this CoordinateXYZM
     */
    public copy(): CoordinateXYZM {
        return new CoordinateXYZM(this);
    }

    /**
     * Create a new Coordinate of the same type as this Coordinate, but with no values.
     * 
     * @return a new Coordinate
     */
    // @Override
    public create(): Coordinate {
        return new CoordinateXYZM();
    }

    /** The m-measure. */
    private m: number;

    /** The m-measure, if available. */
    public getM(): number {
        return this.m;
    }

    public setM(m: number) {
        this.m = m;
    }

    public getOrdinate(ordinateIndex: number): number {
        switch (ordinateIndex) {
            case Coordinate.X: return this.x;
            case Coordinate.Y: return this.y;
            case Coordinate.Z: return this.getZ(); // sure to delegate to subclass rather than offer direct field access
            case Coordinate.M: return this.getM(); // sure to delegate to subclass rather than offer direct field access
        }
        throw new Error("Invalid ordinate index: " + ordinateIndex);
    }

    // @Override
    public setCoordinate(other: Coordinate) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.getZ();
        this.m = other.getM();
    }

    // @Override
    public setOrdinate(ordinateIndex: number, value: number) {
        switch (ordinateIndex) {
            case Coordinate.X:
                this.x = value;
                break;
            case Coordinate.Y:
                this.y = value;
                break;
            case Coordinate.Z:
                this.z = value;
                break;
            case Coordinate.M:
                this.m = value;
                break;
            default:
                throw new Error("Invalid ordinate index: " + ordinateIndex);
        }
    }

    public toString(): string {
        return "(" + this.x + ", " + this.y + ", " + this.getZ() + " m=" + this.getM() + ")";
    }
}