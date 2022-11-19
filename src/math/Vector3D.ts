/*
 * Copyright (c) 2016 Martin Davis.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License 2.0
 * and Eclipse Distribution License v. 1.0 which accompanies this distribution.
 * The Eclipse Public License is available at http://www.eclipse.org/legal/epl-v20.html
 * and the Eclipse Distribution License is available at
 *
 * http://www.eclipse.org/org/documents/edl-v10.php.
 */

import { Coordinate } from "../geom/Coordinate";
import { isNumber, isUndefined } from "../util/NumberUtil";

// package org.locationtech.jts.math;

// import org.locationtech.jts.geom.Coordinate;

/**
 * Represents a vector in 3-dimensional Cartesian space.
 * 
 * @author mdavis
 *
 */
export class Vector3D {

    /**
     * Computes the dot product of the 3D vectors AB and CD.
     * 
     * @param A the start point of the first vector
     * @param B the end point of the first vector
     * @param C the start point of the second vector
     * @param D the end point of the second vector
     * @return the dot product
     */
    public static dot(A: Coordinate, B: Coordinate, C?: Coordinate, D?: Coordinate): number | undefined {
        if (isUndefined(C)) {
            const v1 = A, v2 = B;
            return v1.x * v2.x + v1.y * v2.y + v1.getZ() * v2.getZ();
        }
        if (C !== undefined && D !== undefined) {
            const ABx = B.x - A.x;
            const ABy = B.y - A.y;
            const ABz = B.getZ() - A.getZ();
            const CDx = D.x - C.x;
            const CDy = D.y - C.y;
            const CDz = D.getZ() - C.getZ();
            return ABx * CDx + ABy * CDy + ABz * CDz;
        }
    }

    /**
     * Creates a new vector with given X, Y and Z components.
     * 
     * @param x the X component
     * @param y the Y component
     * @param z the Z component
     * @return a new vector
     */
    public static create(x: number | Coordinate, y?: number, z?: number): Vector3D {
        if (x instanceof Coordinate) {
            return new Vector3D(x);
        }
        return new Vector3D(x, y, z);
    }

    /**
     * Creates a vector from a 3D {@link Coordinate}. 
     * The coordinate should have the
     * X,Y and Z ordinates specified.
     * 
     * @param coord the Coordinate to copy
     * @return a new vector
     */
    // public static create(coord: Coordinate): Vector3D {
    //     return new Vector3D(coord);
    // }

    /**
     * Computes the 3D dot-product of two {@link Coordinate}s.
     * 
   * @param v1 the first vector
   * @param v2 the second vector
     * @return the dot product of the vectors
     */
    // public static dot(v1: Coordinate, v2: Coordinate): number {
    //     return v1.x * v2.x + v1.y * v2.y + v1.getZ() * v2.getZ();
    // }

    private x: number;
    private y: number;
    private z: number;


    public constructor(x: Coordinate | number, y?: Coordinate | number, z?: number) {
        if (isNumber(x) && isNumber(y) && isNumber(z)) {
            this.x = (x as number);
            this.y = (y as number);
            this.z = (z as number);
        } else if (x instanceof Coordinate && y instanceof Coordinate) {
            const to = y, from = x;
            this.x = to.x - from.x;
            this.y = to.y - from.y;
            this.z = to.getZ() - from.getZ();
        } else if (x instanceof Coordinate) {
            const v = x;
            this.x = v.x;
            this.y = v.y;
            this.z = v.getZ();
        }
    }

    /**
     * Creates a new 3D vector from a {@link Coordinate}. The coordinate should have
     * the X,Y and Z ordinates specified.
     * 
     * @param v the Coordinate to copy
     */
    // public Vector3D(Coordinate v) {
    //     x = v.x;
    //     y = v.y;
    //     z = v.getZ();
    // }

    /**
     * Creates a new vector with the direction and magnitude
     * of the difference between the 
     * <tt>to</tt> and <tt>from</tt> {@link Coordinate}s.
     * 
     * @param from the origin Coordinate
     * @param to the destination Coordinate
     */
    // public Vector3D(Coordinate from, Coordinate to) {
    //     x = to.x - from.x;
    //     y = to.y - from.y;
    //     z = to.getZ() - from.getZ();
    // }

    /**
     * Creates a vector with the givne components.
     * 
     * @param x the X component
     * @param y the Y component
     * @param z the Z component
     */
    // public Vector3D(double x, double y, double z) {
    //     this.x = x;
    //     this.y = y;
    //     this.z = z;
    // }

    /**
     * Gets the X component of this vector.
     * 
     * @return the value of the X component
     */
    public getX(): number {
        return this.x;
    }

    /**
     * Gets the Y component of this vector.
     * 
     * @return the value of the Y component
     */
    public getY(): number {
        return this.y;
    }

    /**
     * Gets the Z component of this vector.
     * 
     * @return the value of the Z component
     */
    public getZ(): number {
        return this.z;
    }

    /**
     * Computes a vector which is the sum
     * of this vector and the given vector.
     * 
     * @param v the vector to add
     * @return the sum of this and <code>v</code>
     */
    public add(v: Vector3D): Vector3D {
        const { x, y, z } = this;
        return Vector3D.create(x + v.x, y + v.y, z + v.z);
    }

    /**
   * Computes a vector which is the difference
   * of this vector and the given vector.
   * 
   * @param v the vector to subtract
   * @return the difference of this and <code>v</code>
   */
    public subtract(v: Vector3D): Vector3D {
        const { x, y, z } = this;
        return Vector3D.create(x - v.x, y - v.y, z - v.z);
    }

    /**
     * Creates a new vector which has the same direction
     * and with length equals to the length of this vector
     * divided by the scalar value <code>d</code>.
     * 
     * @param d the scalar divisor
     * @return a new vector with divided length
     */
    public divide(d: number): Vector3D {
        const { x, y, z } = this;
        return Vector3D.create(x / d, y / d, z / d);
    }

    /**
     * Computes the dot-product of two vectors
     * 
     * @param v a vector
     * @return the dot product of the vectors
     */
    public dot(v: Vector3D): number {
        const { x, y, z } = this;
        return x * v.x + y * v.y + z * v.z;
    }

    /**
   * Computes the length of this vector.
   * 
   * @return the length of the vector
   */
    public length(): number {
        const { x, y, z } = this;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * Computes the length of a vector.
     * 
     * @param v a coordinate representing a 3D vector
     * @return the length of the vector
     */
    public static vlength(v: Coordinate): number {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.getZ() * v.getZ());
    }

    /**
     * Computes a vector having identical direction
     * but normalized to have length 1.
     * 
     * @return a new normalized vector
     */
    public normalize(): Vector3D {
        const length = this.length();
        if (length > 0.0)
            return this.divide(this.length());
        return Vector3D.create(0.0, 0.0, 0.0);
    }

    /**
     * Computes a vector having identical direction
     * but normalized to have length 1.
     * 
     * @param v a coordinate representing a 3D vector
     * @return a coordinate representing the normalized vector
     */
    public static normalize(v: Coordinate): Coordinate {
        const len = Vector3D.vlength(v);
        return new Coordinate(v.x / len, v.y / len, v.getZ() / len);
    }

    /**
     * Gets a string representation of this vector
     * 
     * @return a string representing this vector
     */
    public toString(): string {
        const { x, y, z } = this;
        return "[" + x + ", " + y + ", " + z + "]";
    }

    /**
     * Tests if a vector <tt>o</tt> has the same values for the components.
     * 
     * @param o a <tt>Vector3D</tt> with which to do the comparison.
     * @return true if <tt>other</tt> is a <tt>Vector3D</tt> with the same values
     *         for the x and y components.
     */
    public equals(o: Object): boolean {
        if (!(o instanceof Vector3D)) {
            return false;
        }
        const v = (o as Vector3D);
        const { x, y, z } = this;
        return x == v.x && y == v.y && z == v.z;
    }

    /**
     * Gets a hashcode for this vector.
     * 
     * @return a hashcode for this vector
     */
    public hashCode(): number {
        // Algorithm from Effective Java by Joshua Bloch
        let result = 17;
        const { x, y, z } = this;
        result = 37 * result + Coordinate.hashCode(x);
        result = 37 * result + Coordinate.hashCode(y);
        result = 37 * result + Coordinate.hashCode(z);
        return result;
    }

}