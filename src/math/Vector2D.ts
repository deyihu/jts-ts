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
// package org.locationtech.jts.math;

import { CGAlgorithmsDD } from "../algorithm/CGAlgorithmsDD";
import { Coordinate } from "../geom/Coordinate";
import { isNumber, isUndefined } from "../util/NumberUtil";
import { Angle } from './../algorithm/Angle';

// import org.locationtech.jts.algorithm.Angle;
// import org.locationtech.jts.algorithm.CGAlgorithmsDD;
// import org.locationtech.jts.geom.Coordinate;
// import org.locationtech.jts.util.Assert;

/**
 * A 2-dimensional mathematical vector represented by double-precision X and Y components.
 * 
 * @author mbdavis
 * 
 */
export class Vector2D {

    public static create(x: number | Coordinate | Vector2D, y?: number | Coordinate): Vector2D {
        if (x instanceof Vector2D) {
            return new Vector2D(x);
        } else if (isNumber(x) && isNumber(y)) {
            return new Vector2D(x, y);
        } else if (x instanceof Coordinate && isUndefined(y)) {
            return new Vector2D(x);
        } else {
            const to = y, from = x;
            return new Vector2D(from, to);
        }
    }
    /**
     * Creates a new vector with given X and Y components.
     * 
     * @param x the x component
     * @param y the y component
     * @return a new vector
     */
    // public static Vector2D create(double x, double y) {
    //     return new Vector2D(x, y);
    // }

    /**
     * Creates a new vector from an existing one.
     * 
     * @param v the vector to copy
     * @return a new vector
     */
    // public static Vector2D create(Vector2D v) {
    //     return new Vector2D(v);
    // }

    /**
     * Creates a vector from a {@link Coordinate}. 
     * 
     * @param coord the Coordinate to copy
     * @return a new vector
     */
    // public static Vector2D create(Coordinate coord) {
    //     return new Vector2D(coord);
    // }

    /**
     * Creates a vector with the direction and magnitude
     * of the difference between the 
     * <tt>to</tt> and <tt>from</tt> {@link Coordinate}s.
     * 
     * @param from the origin Coordinate
     * @param to the destination Coordinate
     * @return a new vector
     */
    // public static Vector2D create(Coordinate from, Coordinate to) {
    //     return new Vector2D(from, to);
    // }

    /**
     * The X component of this vector.
     */
    private x: number;

    /**
     * The Y component of this vector.
     */
    private y: number;

    public constructor(x?: number | Coordinate | Vector2D, y?: number | Coordinate) {
        if (isUndefined(x)) {
            this.x = 0.0;
            this.y = 0.0;
        } else if (isNumber(x) && isNumber(y)) {
            this.x = (x as number);
            this.y = (y as number);
        } else if (x instanceof Vector2D) {
            const v = x;
            this.x = v.x;
            this.y = v.y;
        } else if (x instanceof Coordinate && isUndefined(y)) {
            const v = x;
            this.x = v.x;
            this.y = v.y;
        } else if (x instanceof Coordinate && y instanceof Coordinate) {
            const to = y, from = x;
            x = to.x - from.x;
            y = to.y - from.y;
        }
    }

    // public Vector2D() {
    //     this(0.0, 0.0);
    // }

    // public Vector2D(double x, double y) {
    //     this.x = x;
    //     this.y = y;
    // }

    // public Vector2D(Vector2D v) {
    //     x = v.x;
    //     y = v.y;
    // }

    // public Vector2D(Coordinate from, Coordinate to) {
    //     x = to.x - from.x;
    //     y = to.y - from.y;
    // }

    // public Vector2D(Coordinate v) {
    //     x = v.x;
    //     y = v.y;
    // }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getComponent(index: number): number {
        if (index == 0)
            return this.x;
        return this.y;
    }

    public add(v: Vector2D): Vector2D {
        const { x, y } = this;
        return Vector2D.create(x + v.x, y + v.y);
    }

    public subtract(v: Vector2D): Vector2D {
        const { x, y } = this;
        return Vector2D.create(x - v.x, y - v.y);
    }

    /**
     * Multiplies the vector by a scalar value.
     * 
     * @param d the value to multiply by
     * @return a new vector with the value v * d
     */
    public multiply(d: number): Vector2D {
        const { x, y } = this;
        return Vector2D.create(x * d, y * d);
    }

    /**
     * Divides the vector by a scalar value.
     * 
     * @param d the value to divide by
     * @return a new vector with the value v / d
     */
    public divide(d: number): Vector2D {
        const { x, y } = this;
        return Vector2D.create(x / d, y / d);
    }

    public negate(): Vector2D {
        const { x, y } = this;
        return Vector2D.create(-x, -y);
    }

    public length(): number {
        const { x, y } = this;
        return Math.hypot(x, y);
    }

    public lengthSquared(): number {
        const { x, y } = this;
        return x * x + y * y;
    }

    public normalize(): Vector2D {
        let length = this.length();
        if (length > 0.0)
            return this.divide(length);
        return Vector2D.create(0.0, 0.0);
    }

    public average(v: Vector2D): Vector2D {
        return this.weightedSum(v, 0.5);
    }

    /**
     * Computes the weighted sum of this vector
     * with another vector,
     * with this vector contributing a fraction
     * of <tt>frac</tt> to the total.
     * <p>
     * In other words, 
     * <pre>
     * sum = frac * this + (1 - frac) * v
     * </pre>
     * 
     * @param v the vector to sum
     * @param frac the fraction of the total contributed by this vector
     * @return the weighted sum of the two vectors
     */
    public weightedSum(v: Vector2D, frac: number): Vector2D {
        const { x, y } = this;
        return Vector2D.create(
            frac * x + (1.0 - frac) * v.x,
            frac * y + (1.0 - frac) * v.y);
    }

    /**
     * Computes the distance between this vector and another one.
     * @param v a vector
     * @return the distance between the vectors
     */
    public distance(v: Vector2D): number {
        const { x, y } = this;
        const delx = v.x - x;
        const dely = v.y - y;
        return Math.hypot(delx, dely);
    }

    /**
     * Computes the dot-product of two vectors
     * 
     * @param v a vector
     * @return the dot product of the vectors
     */
    public dot(v: Vector2D): number {
        const { x, y } = this;
        return x * v.x + y * v.y;
    }

    // public double angle() {
    //     return Math.atan2(y, x);
    // }

    public angle(v?: Vector2D): number {
        const { x, y } = this;
        if (isUndefined(v)) {
            return Math.atan2(y, x);
        }
        return Angle.diff((v as Vector2D).angle(), this.angle());
    }

    public angleTo(v: Vector2D): number {
        let a1 = this.angle();
        let a2 = v.angle();
        let angDel = a2 - a1;

        // normalize, maintaining orientation
        if (angDel <= -Math.PI)
            return angDel + Angle.PI_TIMES_2;
        if (angDel > Math.PI)
            return angDel - Angle.PI_TIMES_2;
        return angDel;
    }

    public rotate(angle: number): Vector2D {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const { x, y } = this;
        return Vector2D.create(
            x * cos - y * sin,
            x * sin + y * cos
        );
    }

    /**
     * Rotates a vector by a given number of quarter-circles (i.e. multiples of 90
     * degrees or Pi/2 radians). A positive number rotates counter-clockwise, a
     * negative number rotates clockwise. Under this operation the magnitude of
     * the vector and the absolute values of the ordinates do not change, only
     * their sign and ordinate index.
     * 
     * @param numQuarters
     *          the number of quarter-circles to rotate by
     * @return the rotated vector.
     */
    public rotateByQuarterCircle(numQuarters: number): Vector2D | null {
        let nQuad = numQuarters % 4;
        if (numQuarters < 0 && nQuad != 0) {
            nQuad = nQuad + 4;
        }
        const { x, y } = this;
        switch (nQuad) {
            case 0:
                return Vector2D.create(x, y);
            case 1:
                return Vector2D.create(-y, x);
            case 2:
                return Vector2D.create(-x, -y);
            case 3:
                return Vector2D.create(y, -x);
        }
        // Assert.shouldNeverReachHere();
        return null;
    }

    public isParallel(v: Vector2D): boolean {
        return 0.0 == CGAlgorithmsDD.signOfDet2x2(this.x, this.y, v.x, v.y);
    }

    public translate(coord: Coordinate): Coordinate {
        return new Coordinate(this.x + coord.x, this.y + coord.y);
    }

    public toCoordinate(): Coordinate {
        return new Coordinate(this.x, this.y);
    }

    /**
     * Creates a copy of this vector
     * 
     * @return a copy of this vector
     */
    public clone(): Object {
        return new Vector2D(this);
    }

    /**
     * Gets a string representation of this vector
     * 
     * @return a string representing this vector
     */
    public toString(): string {
        const { x, y } = this;
        return "[" + x + ", " + y + "]";
    }

    /**
     * Tests if a vector <tt>o</tt> has the same values for the x and y
     * components.
     * 
     * @param o
     *          a <tt>Vector2D</tt> with which to do the comparison.
     * @return true if <tt>other</tt> is a <tt>Vector2D</tt> with the same
     *         values for the x and y components.
     */
    public equals(o: Object): boolean {
        if (!(o instanceof Vector2D)) {
            return false;
        }
        const v = (o as Vector2D);
        return this.x == v.x && this.y == v.y;
    }

    /**
     * Gets a hashcode for this vector.
     * 
     * @return a hashcode for this vector
     */
    public hashCode(): number {
        // Algorithm from Effective Java by Joshua Bloch
        let result = 17;
        result = 37 * result + Coordinate.hashCode(this.x);
        result = 37 * result + Coordinate.hashCode(this.y);
        return result;
    }


}