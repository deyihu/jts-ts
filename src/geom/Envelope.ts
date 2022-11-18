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

// import java.io.Serializable;

/**
 *  Defines a rectangular region of the 2D coordinate plane.
 *  It is often used to represent the bounding box of a {@link Geometry},
 *  e.g. the minimum and maximum x and y values of the {@link Coordinate}s.
 *  <p>
 *  Envelopes support infinite or half-infinite regions, by using the values of
 *  <code>Double.POSITIVE_INFINITY</code> and <code>Double.NEGATIVE_INFINITY</code>.
 *  Envelope objects may have a null value.
 *  <p>
 *  When Envelope objects are created or initialized,
 *  the supplies extent values are automatically sorted into the correct order.
 *
 *@version 1.7
 */
export class Envelope {
    // private static final long serialVersionUID = 5873921885273102420L;

    public hashCode(): number {
        //Algorithm from Effective Java by Joshua Bloch [Jon Aquino]
        let result = 17;
        const { minx, miny, maxx, maxy } = this;
        result = 37 * result + Coordinate.hashCode(minx);
        result = 37 * result + Coordinate.hashCode(maxx);
        result = 37 * result + Coordinate.hashCode(miny);
        result = 37 * result + Coordinate.hashCode(maxy);
        return result;
    }

    /**
     * Test the point q to see whether it intersects the Envelope defined by p1-p2
     * @param p1 one extremal point of the envelope
     * @param p2 another extremal point of the envelope
     * @param q the point to test for intersection
     * @return <code>true</code> if q intersects the envelope p1-p2
     */
    public static intersects(p1: Coordinate, p2: Coordinate, q: Coordinate, q2?: Coordinate): boolean {
        //OptimizeIt shows that Math#min and Math#max here are a bottleneck.
        //Replace with direct comparisons. [Jon Aquino]
        if (q2 === undefined) {
            if (((q.x >= (p1.x < p2.x ? p1.x : p2.x)) && (q.x <= (p1.x > p2.x ? p1.x : p2.x))) &&
                ((q.y >= (p1.y < p2.y ? p1.y : p2.y)) && (q.y <= (p1.y > p2.y ? p1.y : p2.y)))) {
                return true;
            }
            return false;
        }
        const q1 = q;
        let minq = Math.min(q1.x, q2.x);
        let maxq = Math.max(q1.x, q2.x);
        let minp = Math.min(p1.x, p2.x);
        let maxp = Math.max(p1.x, p2.x);

        if (minp > maxq)
            return false;
        if (maxp < minq)
            return false;

        minq = Math.min(q1.y, q2.y);
        maxq = Math.max(q1.y, q2.y);
        minp = Math.min(p1.y, p2.y);
        maxp = Math.max(p1.y, p2.y);

        if (minp > maxq)
            return false;
        if (maxp < minq)
            return false;
        return true;
    }

    /**
     * Tests whether the envelope defined by p1-p2
     * and the envelope defined by q1-q2
     * intersect.
     * 
     * @param p1 one extremal point of the envelope P
     * @param p2 another extremal point of the envelope P
     * @param q1 one extremal point of the envelope Q
     * @param q2 another extremal point of the envelope Q
     * @return <code>true</code> if Q intersects P
     */
    // public static boolean intersects(Coordinate p1, Coordinate p2, Coordinate q1, Coordinate q2) {
    //     const minq = Math.min(q1.x, q2.x);
    //     const maxq = Math.max(q1.x, q2.x);
    //     const minp = Math.min(p1.x, p2.x);
    //     const maxp = Math.max(p1.x, p2.x);

    //     if (minp > maxq)
    //         return false;
    //     if (maxp < minq)
    //         return false;

    //     minq = Math.min(q1.y, q2.y);
    //     maxq = Math.max(q1.y, q2.y);
    //     minp = Math.min(p1.y, p2.y);
    //     maxp = Math.max(p1.y, p2.y);

    //     if (minp > maxq)
    //         return false;
    //     if (maxp < minq)
    //         return false;
    //     return true;
    // }

    /**
     *  the minimum x-coordinate
     */
    private minx: number;

    /**
     *  the maximum x-coordinate
     */
    private maxx: number;

    /**
     *  the minimum y-coordinate
     */
    private miny: number;

    /**
     *  the maximum y-coordinate
     */
    private maxy: number;

    public constructor(x1?: number | Coordinate | Envelope, x2?: number | Coordinate, y1?: number, y2?: number) {
        if (x1 === undefined) {
            this.init();
        }
        if (x1 instanceof Envelope) {
            this.init(x1);
        }
        if (x1 instanceof Coordinate && x2 instanceof Coordinate) {
            const p1 = x1, p2 = x2;
            this.init(p1.x, p2.x, p1.y, p2.y);
        }
        if (x1 instanceof Coordinate && x2 === undefined) {
            const p = x1;
            this.init(p.x, p.x, p.y, p.y);
        }
        this.init(x1, x2, y1, y2);
    }

    /**
     *  Creates a null <code>Envelope</code>.
     */
    // public Envelope() {
    //     init();
    // }

    /**
     *  Creates an <code>Envelope</code> for a region defined by maximum and minimum values.
     *
     *@param  x1  the first x-value
     *@param  x2  the second x-value
     *@param  y1  the first y-value
     *@param  y2  the second y-value
     */
    // public Envelope(double x1, double x2, double y1, double y2) {
    //     init(x1, x2, y1, y2);
    // }

    /**
     *  Creates an <code>Envelope</code> for a region defined by two Coordinates.
     *
     *@param  p1  the first Coordinate
     *@param  p2  the second Coordinate
     */
    // public Envelope(Coordinate p1, Coordinate p2) {
    //     init(p1.x, p2.x, p1.y, p2.y);
    // }

    /**
     *  Creates an <code>Envelope</code> for a region defined by a single Coordinate.
     *
     *@param  p  the Coordinate
     */
    // public Envelope(Coordinate p) {
    //     init(p.x, p.x, p.y, p.y);
    // }

    /**
     *  Create an <code>Envelope</code> from an existing Envelope.
     *
     *@param  env  the Envelope to initialize from
     */
    // public Envelope(Envelope env) {
    //     init(env);
    // }

    public init(x1?: number | Coordinate | Envelope, x2?: number | Coordinate, y1?: number, y2?: number) {
        if (x1 === undefined) {
            this.setToNull();
        }
        if (x1 instanceof Coordinate && x2 instanceof Coordinate) {
            const p1 = x1, p2 = x2;
            this.minx = Math.min(p1.x, p1.x);
            this.maxx = Math.max(p1.x, p1.x);
            this.miny = Math.min(p1.y, p2.y);
            this.maxy = Math.max(p1.y, p2.y);
        }
        if (x1 instanceof Coordinate && x2 === undefined) {
            const p = x1;
            this.minx = p.x;
            this.maxx = p.x;
            this.miny = p.y;
            this.maxy = p.y;
        }
        if (x1 instanceof Envelope) {
            const env = x1;
            this.minx = env.minx;
            this.maxx = env.maxx;
            this.miny = env.miny;
            this.maxy = env.maxy;
        }
        if (typeof x1 === 'number' && typeof x2 === 'number' && typeof y1 === 'number' && typeof y2 === 'number') {
            this.minx = Math.min(x1, x2);
            this.maxx = Math.max(x1, x2);
            this.miny = Math.min(y1, y2);
            this.maxy = Math.max(y1, y2);
        }
    }
    /**
     *  Initialize to a null <code>Envelope</code>.
     */
    // public void init() {
    //     setToNull();
    // }

    /**
     *  Initialize an <code>Envelope</code> for a region defined by maximum and minimum values.
     *
     *@param  x1  the first x-value
     *@param  x2  the second x-value
     *@param  y1  the first y-value
     *@param  y2  the second y-value
     */
    // public void init(double x1, double x2, double y1, double y2) {
    //     if (x1 < x2) {
    //         minx = x1;
    //         maxx = x2;
    //     }
    //     else {
    //         minx = x2;
    //         maxx = x1;
    //     }
    //     if (y1 < y2) {
    //         miny = y1;
    //         maxy = y2;
    //     }
    //     else {
    //         miny = y2;
    //         maxy = y1;
    //     }
    // }

    /**
     * Creates a copy of this envelope object.
     * 
     * @return a copy of this envelope
     */
    public copy(): Envelope {
        return new Envelope(this);
    }

    /**
     *  Initialize an <code>Envelope</code> to a region defined by two Coordinates.
     *
     *@param  p1  the first Coordinate
     *@param  p2  the second Coordinate
     */
    // public void init(Coordinate p1, Coordinate p2) {
    //     init(p1.x, p2.x, p1.y, p2.y);
    // }

    /**
     *  Initialize an <code>Envelope</code> to a region defined by a single Coordinate.
     *
     *@param  p  the coordinate
     */
    // public void init(Coordinate p) {
    //     init(p.x, p.x, p.y, p.y);
    // }

    /**
     *  Initialize an <code>Envelope</code> from an existing Envelope.
     *
     *@param  env  the Envelope to initialize from
     */
    // public void init(Envelope env) {
    //     this.minx = env.minx;
    //     this.maxx = env.maxx;
    //     this.miny = env.miny;
    //     this.maxy = env.maxy;
    // }


    /**
     *  Makes this <code>Envelope</code> a "null" envelope, that is, the envelope
     *  of the empty geometry.
     */
    public setToNull() {
        this.minx = 0;
        this.maxx = -1;
        this.miny = 0;
        this.maxy = -1;
    }

    /**
     *  Returns <code>true</code> if this <code>Envelope</code> is a "null"
     *  envelope.
     *
     *@return    <code>true</code> if this <code>Envelope</code> is uninitialized
     *      or is the envelope of the empty geometry.
     */
    public isNull(): boolean {
        return this.maxx < this.minx;
    }

    /**
     *  Returns the difference between the maximum and minimum x values.
     *
     *@return    max x - min x, or 0 if this is a null <code>Envelope</code>
     */
    public getWidth(): number {
        if (this.isNull()) {
            return 0;
        }
        return this.maxx - this.minx;
    }

    /**
     *  Returns the difference between the maximum and minimum y values.
     *
     *@return    max y - min y, or 0 if this is a null <code>Envelope</code>
     */
    public getHeight(): number {
        if (this.isNull()) {
            return 0;
        }
        return this.maxy - this.miny;
    }

    /**
     * Gets the length of the diameter (diagonal) of the envelope.
     * 
     * @return the diameter length
     */
    public getDiameter(): number {
        if (this.isNull()) {
            return 0;
        }
        const w = this.getWidth();
        const h = this.getHeight();
        return Math.hypot(w, h);
    }
    /**
     *  Returns the <code>Envelope</code>s minimum x-value. min x &gt; max x
     *  indicates that this is a null <code>Envelope</code>.
     *
     *@return    the minimum x-coordinate
     */
    public getMinX(): number {
        return this.minx;
    }

    /**
     *  Returns the <code>Envelope</code>s maximum x-value. min x &gt; max x
     *  indicates that this is a null <code>Envelope</code>.
     *
     *@return    the maximum x-coordinate
     */
    public getMaxX(): number {
        return this.maxx;
    }

    /**
     *  Returns the <code>Envelope</code>s minimum y-value. min y &gt; max y
     *  indicates that this is a null <code>Envelope</code>.
     *
     *@return    the minimum y-coordinate
     */
    public getMinY(): number {
        return this.miny;
    }

    /**
     *  Returns the <code>Envelope</code>s maximum y-value. min y &gt; max y
     *  indicates that this is a null <code>Envelope</code>.
     *
     *@return    the maximum y-coordinate
     */
    public getMaxY(): number {
        return this.maxy;
    }

    /**
     * Gets the area of this envelope.
     * 
     * @return the area of the envelope
     * @return 0.0 if the envelope is null
     */
    public getArea(): number {
        return this.getWidth() * this.getHeight();
    }

    /**
     * Gets the minimum extent of this envelope across both dimensions.
     * 
     * @return the minimum extent of this envelope
     */
    public minExtent(): number {
        if (this.isNull()) return 0.0;
        const w = this.getWidth();
        const h = this.getHeight();
        if (w < h) return w;
        return h;
    }

    /**
     * Gets the maximum extent of this envelope across both dimensions.
     * 
     * @return the maximum extent of this envelope
     */
    public maxExtent(): number {
        if (this.isNull()) return 0.0;
        const w = this.getWidth();
        const h = this.getHeight();
        if (w > h) return w;
        return h;
    }

    /**
     *  Enlarges this <code>Envelope</code> so that it contains
     *  the given {@link Coordinate}. 
     *  Has no effect if the point is already on or within the envelope.
     *
     *@param  p  the Coordinate to expand to include
     */
    public expandToInclude(x: number | Coordinate | Envelope, y?: number) {
        if (x instanceof Envelope) {
            const other = x;
            if (other.isNull()) {
                return;
            }
            if (this.isNull()) {
                this.minx = other.getMinX();
                this.maxx = other.getMaxX();
                this.miny = other.getMinY();
                this.maxy = other.getMaxY();
            }
            else {
                this.minx = Math.min(other.minx, this.minx);
                this.maxx = Math.max(other.maxx, this.maxx);
                this.miny = Math.min(other.miny, this.miny);
                this.maxx = Math.max(other.maxy, this.maxx);
            }
        }
        if (typeof x === 'number' && typeof y === 'number') {
            this._expandToInclude(x, y);
        }
        if (x instanceof Coordinate) {
            const p = x;
            this._expandToInclude(p.x, p.y);
        }
    }

    public _expandToInclude(x: number, y: number) {
        if (this.isNull()) {
            this.minx = x;
            this.maxx = x;
            this.miny = y;
            this.maxy = y;
        }
        else {
            this.minx = Math.min(x, this.minx);
            this.maxx = Math.max(x, this.maxx);
            this.miny = Math.min(y, this.miny);
            this.maxx = Math.max(y, this.maxx);

        }
    }

    /**
     *  Enlarges this <code>Envelope</code> so that it contains
     *  the given point. 
     *  Has no effect if the point is already on or within the envelope.
     *
     *@param  x  the value to lower the minimum x to or to raise the maximum x to
     *@param  y  the value to lower the minimum y to or to raise the maximum y to
     */
    // public void expandToInclude(double x, double y) {
    //     if (isNull()) {
    //         minx = x;
    //         maxx = x;
    //         miny = y;
    //         maxy = y;
    //     }
    //     else {
    //         if (x < minx) {
    //             minx = x;
    //         }
    //         if (x > maxx) {
    //             maxx = x;
    //         }
    //         if (y < miny) {
    //             miny = y;
    //         }
    //         if (y > maxy) {
    //             maxy = y;
    //         }
    //     }
    // }

    /**
     *  Enlarges this <code>Envelope</code> so that it contains
     *  the <code>other</code> Envelope. 
     *  Has no effect if <code>other</code> is wholly on or
     *  within the envelope.
     *
     *@param  other  the <code>Envelope</code> to expand to include
     */
    // public void expandToInclude(Envelope other) {
    //     if (other.isNull()) {
    //         return;
    //     }
    //     if (isNull()) {
    //         minx = other.getMinX();
    //         maxx = other.getMaxX();
    //         miny = other.getMinY();
    //         maxy = other.getMaxY();
    //     }
    //     else {
    //         if (other.minx < minx) {
    //             minx = other.minx;
    //         }
    //         if (other.maxx > maxx) {
    //             maxx = other.maxx;
    //         }
    //         if (other.miny < miny) {
    //             miny = other.miny;
    //         }
    //         if (other.maxy > maxy) {
    //             maxy = other.maxy;
    //         }
    //     }
    // }


    /**
     * Expands this envelope by a given distance in all directions.
     * Both positive and negative distances are supported.
     *
     * @param distance the distance to expand the envelope
     */
    public expandBy(deltaX: number, deltaY?: number) {
        if (deltaY === undefined) {
            this._expandBy(deltaX, deltaX);
        } else {
            this._expandBy(deltaX, deltaY);
        }
    }

    /**
     * Expands this envelope by a given distance in all directions.
     * Both positive and negative distances are supported.
     *
     * @param deltaX the distance to expand the envelope along the the X axis
     * @param deltaY the distance to expand the envelope along the the Y axis
     */
    // public void expandBy(double deltaX, double deltaY) {
    //     if (isNull()) return;

    //     minx -= deltaX;
    //     maxx += deltaX;
    //     miny -= deltaY;
    //     maxy += deltaY;

    //     // check for envelope disappearing
    //     if (minx > maxx || miny > maxy)
    //         setToNull();
    // }

    public _expandBy(deltaX: number, deltaY: number) {
        if (this.isNull()) return;

        this.minx -= deltaX;
        this.maxx += deltaX;
        this.miny -= deltaY;
        this.maxy += deltaY;

        // check for envelope disappearing
        if (this.minx > this.maxx || this.miny > this.maxy)
            this.setToNull();
    }

    /**
     * Translates this envelope by given amounts in the X and Y direction.
     *
     * @param transX the amount to translate along the X axis
     * @param transY the amount to translate along the Y axis
     */
    public translate(transX: number, transY: number) {
        if (this.isNull()) {
            return;
        }
        this.init(this.getMinX() + transX, this.getMaxX() + transX,
            this.getMinY() + transY, this.getMaxY() + transY);
    }

    /**
     * Computes the coordinate of the centre of this envelope (as long as it is non-null
     *
     * @return the centre coordinate of this envelope
     * <code>null</code> if the envelope is null
     */
    public centre(): Coordinate | null {
        if (this.isNull()) return null;
        return new Coordinate(
            (this.getMinX() + this.getMaxX()) / 2.0,
            (this.getMinY() + this.getMaxY()) / 2.0);
    }

    /**
     * Computes the intersection of two {@link Envelope}s.
     *
     * @param env the envelope to intersect with
     * @return a new Envelope representing the intersection of the envelopes (this will be
     * the null envelope if either argument is null, or they do not intersect
     */
    public intersection(env: Envelope): Envelope {
        if (this.isNull() || env.isNull() || !this.intersects(env)) return new Envelope();
        const { minx, miny, maxx, maxy } = this;
        const intMinX = minx > env.minx ? minx : env.minx;
        const intMinY = miny > env.miny ? miny : env.miny;
        const intMaxX = maxx < env.maxx ? maxx : env.maxx;
        const intMaxY = maxy < env.maxy ? maxy : env.maxy;
        return new Envelope(intMinX, intMaxX, intMinY, intMaxY);
    }

    public intersects(a: number | Coordinate | Envelope, b?: number | Coordinate): boolean {
        if (a instanceof Envelope) {
            const other = a;
            if (this.isNull() || other.isNull()) { return false; }
            const { minx, miny, maxx, maxy } = this;
            return !(other.minx > maxx ||
                other.maxx < minx ||
                other.miny > maxy ||
                other.maxy < miny);
        }
        if ((a instanceof Coordinate) && (b instanceof Coordinate)) {
            if (this.isNull()) { return false; }
            const { minx, miny, maxx, maxy } = this;
            const envminx = (a.x < b.x) ? a.x : b.x;
            if (envminx > maxx) return false;

            const envmaxx = (a.x > b.x) ? a.x : b.x;
            if (envmaxx < minx) return false;

            const envminy = (a.y < b.y) ? a.y : b.y;
            if (envminy > maxy) return false;

            const envmaxy = (a.y > b.y) ? a.y : b.y;
            if (envmaxy < miny) return false;

            return true;
        }
        if (a instanceof Coordinate && b === undefined) {
            const p = a;
            return this._intersects(p.x, p.y);
        }
        if (typeof a === 'number' && typeof b === 'number') {
            return this._intersects(a, b);
        }
        return false;
    }

    public _intersects(x: number, y: number): boolean {
        if (this.isNull()) return false;
        const { minx, miny, maxx, maxy } = this;
        return !(x > maxx ||
            x < minx ||
            y > maxy ||
            y < miny);
    }

    /**
     * Tests if the region defined by <code>other</code>
     * intersects the region of this <code>Envelope</code>.
     *
     *@param  other  the <code>Envelope</code> which this <code>Envelope</code> is
     *          being checked for intersecting
     *@return        <code>true</code> if the <code>Envelope</code>s intersect
     */
    // public boolean intersects(Envelope other) {
    //     if (isNull() || other.isNull()) { return false; }
    //     return !(other.minx > maxx ||
    //         other.maxx < minx ||
    //         other.miny > maxy ||
    //         other.maxy < miny);
    // }


    /**
     * Tests if the extent defined by two extremal points
     * intersects the extent of this <code>Envelope</code>.
     *
     *@param a a point
     *@param b another point
     *@return   <code>true</code> if the extents intersect
     */
    // public boolean intersects(Coordinate a, Coordinate b) {
    //     if (isNull()) { return false; }

    // double envminx = (a.x < b.x) ? a.x : b.x;
    //     if (envminx > maxx) return false;

    // double envmaxx = (a.x > b.x) ? a.x : b.x;
    //     if (envmaxx < minx) return false;

    // double envminy = (a.y < b.y) ? a.y : b.y;
    //     if (envminy > maxy) return false;

    // double envmaxy = (a.y > b.y) ? a.y : b.y;
    //     if (envmaxy < miny) return false;

    //     return true;
    // }

    /**
     * Tests if the point <code>p</code>
     * intersects (lies inside) the region of this <code>Envelope</code>.
     *
     *@param  p  the <code>Coordinate</code> to be tested
     *@return <code>true</code> if the point intersects this <code>Envelope</code>
     */
    // public boolean intersects(Coordinate p) {
    //     return intersects(p.x, p.y);
    // }

    /**
     *  Check if the point <code>(x, y)</code>
     *  intersects (lies inside) the region of this <code>Envelope</code>.
     *
     *@param  x  the x-ordinate of the point
     *@param  y  the y-ordinate of the point
     *@return        <code>true</code> if the point overlaps this <code>Envelope</code>
     */
    // public boolean intersects(double x, double y) {
    //     if (isNull()) return false;
    //     return !(x > maxx ||
    //         x < minx ||
    //         y > maxy ||
    //         y < miny);
    // }

    /**
 * Tests if the region defined by <code>other</code>
 * is disjoint from the region of this <code>Envelope</code>.
 *
 *@param  other  the <code>Envelope</code> being checked for disjointness
 *@return        <code>true</code> if the <code>Envelope</code>s are disjoint
 *
 *@see #intersects(Envelope)
 */
    public disjoint(other: Envelope): boolean {
        if (this.isNull() || other.isNull()) { return true; }
        const { minx, miny, maxx, maxy } = this;
        return other.minx > maxx ||
            other.maxx < minx ||
            other.miny > maxy ||
            other.maxy < miny;
    }

    public overlaps(a: number | Coordinate | Envelope, b?: number): boolean {
        if (a instanceof Envelope) {
            return this.intersects(a);
        }
        if (a instanceof Coordinate) {
            return this.intersects(a);
        }
        return this.intersects(a, b);
    }

    /**
    * @deprecated Use #intersects instead.
    */
    // public boolean overlaps(Coordinate p) {
    //     return intersects(p);
    // }


    /**
     * @deprecated Use #intersects instead. In the future, #overlaps may be
     * changed to be a true overlap check; that is, whether the intersection is
     * two-dimensional.
     */
    // public boolean overlaps(Envelope other) {
    //     return intersects(other);
    // }


    /**
     * @deprecated Use #intersects instead.
     */
    // public boolean overlaps(double x, double y) {
    //     return intersects(x, y);
    // }

    public contains(a: number | Coordinate | Envelope, b?: number): boolean {
        if (a instanceof Envelope) {
            this.covers(a);
        }
        if (a instanceof Coordinate) {
            this.covers(a);
        }
        return this.covers(a, b);
    }
    /**
     * Tests if the <code>Envelope other</code>
     * lies wholely inside this <code>Envelope</code> (inclusive of the boundary).
     * <p>
     * Note that this is <b>not</b> the same definition as the SFS <tt>contains</tt>,
     * which would exclude the envelope boundary.
     *
     *@param  other the <code>Envelope</code> to check
     *@return true if <code>other</code> is contained in this <code>Envelope</code>
     *
     *@see #covers(Envelope)
     */
    // public boolean contains(Envelope other) {
    //     return covers(other);
    // }

    /**
     * Tests if the given point lies in or on the envelope.
     * <p>
     * Note that this is <b>not</b> the same definition as the SFS <tt>contains</tt>,
     * which would exclude the envelope boundary.
     *
     *@param  p  the point which this <code>Envelope</code> is
     *      being checked for containing
     *@return    <code>true</code> if the point lies in the interior or
     *      on the boundary of this <code>Envelope</code>.
     *      
     *@see #covers(Coordinate)
     */
    // public boolean contains(Coordinate p) {
    //     return covers(p);
    // }

    /**
     * Tests if the given point lies in or on the envelope.
     * <p>
     * Note that this is <b>not</b> the same definition as the SFS <tt>contains</tt>,
     * which would exclude the envelope boundary.
     *
     *@param  x  the x-coordinate of the point which this <code>Envelope</code> is
     *      being checked for containing
     *@param  y  the y-coordinate of the point which this <code>Envelope</code> is
     *      being checked for containing
     *@return    <code>true</code> if <code>(x, y)</code> lies in the interior or
     *      on the boundary of this <code>Envelope</code>.
     *      
     *@see #covers(double, double)
     */
    // public boolean contains(double x, double y) {
    //     return covers(x, y);
    // }

    /**
     * Tests if an envelope is properly contained in this one.
     * The envelope is properly contained if it is contained 
     * by this one but not equal to it.
     * 
     * @param other the envelope to test
     * @return true if the envelope is properly contained
     */
    public containsProperly(other: Envelope): boolean {
        if (this.equals(other))
            return false;
        return this.covers(other);
    }

    public covers(a: number | Coordinate | Envelope, b?: number): boolean {
        if (a instanceof Envelope) {
            const other = a;
            if (this.isNull() || other.isNull()) { return false; }
            const { minx, miny, maxx, maxy } = this;
            return other.getMinX() >= minx &&
                other.getMaxX() <= maxx &&
                other.getMinY() >= miny &&
                other.getMaxY() <= maxy;
        }
        if (a instanceof Coordinate) {
            const p = a;
            return this._covers(p.x, p.y);
        }
        if (typeof b === 'number') {
            return this._covers(a, b);
        }
        return false;

    }

    public _covers(x: number, y: number): boolean {
        if (this.isNull()) return false;
        const { minx, miny, maxx, maxy } = this;
        return x >= minx &&
            x <= maxx &&
            y >= miny &&
            y <= maxy;
    }

    /**
     * Tests if the given point lies in or on the envelope.
     *
     *@param  x  the x-coordinate of the point which this <code>Envelope</code> is
     *      being checked for containing
     *@param  y  the y-coordinate of the point which this <code>Envelope</code> is
     *      being checked for containing
     *@return    <code>true</code> if <code>(x, y)</code> lies in the interior or
     *      on the boundary of this <code>Envelope</code>.
     */
    // public boolean covers(double x, double y) {
    //     if (isNull()) return false;
    //     return x >= minx &&
    //         x <= maxx &&
    //         y >= miny &&
    //         y <= maxy;
    // }

    /**
     * Tests if the given point lies in or on the envelope.
     *
     *@param  p  the point which this <code>Envelope</code> is
     *      being checked for containing
     *@return    <code>true</code> if the point lies in the interior or
     *      on the boundary of this <code>Envelope</code>.
     */
    // public boolean covers(Coordinate p) {
    //     return covers(p.x, p.y);
    // }

    /**
     * Tests if the <code>Envelope other</code>
     * lies wholely inside this <code>Envelope</code> (inclusive of the boundary).
     *
     *@param  other the <code>Envelope</code> to check
     *@return true if this <code>Envelope</code> covers the <code>other</code> 
     */
    // public boolean covers(Envelope other) {
    //     if (isNull() || other.isNull()) { return false; }
    //     return other.getMinX() >= minx &&
    //         other.getMaxX() <= maxx &&
    //         other.getMinY() >= miny &&
    //         other.getMaxY() <= maxy;
    // }

    /**
     * Computes the distance between this and another
     * <code>Envelope</code>.
     * The distance between overlapping Envelopes is 0.  Otherwise, the
     * distance is the Euclidean distance between the closest points.
     */
    public distance(env: Envelope): number {
        if (this.intersects(env)) return 0;

        const { minx, miny, maxx, maxy } = this;
        let dx = 0.0;
        if (maxx < env.minx)
            dx = env.minx - maxx;
        else if (minx > env.maxx)
            dx = minx - env.maxx;

        let dy = 0.0;
        if (maxy < env.miny)
            dy = env.miny - maxy;
        else if (miny > env.maxy) dy = miny - env.maxy;

        // if either is zero, the envelopes overlap either vertically or horizontally
        if (dx == 0.0) return dy;
        if (dy == 0.0) return dx;
        return Math.hypot(dx, dy);
    }

    public equals(other: Object): boolean {
        if (!(other instanceof Envelope)) {
            return false;
        }
        const otherEnvelope = (other as Envelope);
        if (this.isNull()) {
            return otherEnvelope.isNull();
        }
        const { minx, miny, maxx, maxy } = this;
        return maxx == otherEnvelope.getMaxX() &&
            maxy == otherEnvelope.getMaxY() &&
            minx == otherEnvelope.getMinX() &&
            miny == otherEnvelope.getMinY();
    }

    public toString(): string {
        const { minx, miny, maxx, maxy } = this;
        return "Env[" + minx + " : " + maxx + ", " + miny + " : " + maxy + "]";
    }

    /**
     * Compares two envelopes using lexicographic ordering.
     * The ordering comparison is based on the usual numerical
     * comparison between the sequence of ordinates.
     * Null envelopes are less than all non-null envelopes.
     * 
     * @param o an Envelope object
     */
    public compareTo(o: Object): number {
        const env: Envelope = (o as Envelope);
        // compare nulls if present
        if (this.isNull()) {
            if (env.isNull()) return 0;
            return -1;
        }
        else {
            if (env.isNull()) return 1;
        }
        // compare based on numerical ordering of ordinates
        const { minx, miny, maxx, maxy } = this;
        if (minx < env.minx) return -1;
        if (minx > env.minx) return 1;
        if (miny < env.miny) return -1;
        if (miny > env.miny) return 1;
        if (maxx < env.maxx) return -1;
        if (maxx > env.maxx) return 1;
        if (maxy < env.maxy) return -1;
        if (maxy > env.maxy) return 1;
        return 0;


    }
}