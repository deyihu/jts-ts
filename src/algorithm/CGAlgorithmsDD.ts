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
// package org.locationtech.jts.algorithm;

// import org.locationtech.jts.geom.Coordinate;
// import org.locationtech.jts.math.DD;
import { Coordinate } from '../geom/Coordinate';
import { isInfinite, isNumber } from '../util/NumberUtil';
import { DD } from './../math/DD';

/**
 * Implements basic computational geometry algorithms using {@link DD} arithmetic.
 * 
 * @author Martin Davis
 *
 */
export class CGAlgorithmsDD {
    private CGAlgorithmsDD() { }

    /**
     * Returns the index of the direction of the point {@code q} relative to
     * a vector specified by {@code p1-p2}.
     * 
     * @param p1 the origin point of the vector
     * @param p2 the final point of the vector
     * @param q the point to compute the direction to
     * 
     * @return {@code 1} if q is counter-clockwise (left) from p1-p2
     *         {@code -1} if q is clockwise (right) from p1-p2
     *         {@code 0} if q is collinear with p1-p2
     */
    // public static int orientationIndex(Coordinate p1, Coordinate p2, Coordinate q) {
    //     return orientationIndex(p1.x, p1.y, p2.x, p2.y, q.x, q.y);
    // }

    /**
     * Returns the index of the direction of the point {@code q} relative to
     * a vector specified by {@code p1-p2}.
     * 
     * @param p1x the x ordinate of the vector origin point
     * @param p1y the y ordinate of the vector origin point
     * @param p2x the x ordinate of the vector final point
     * @param p2y the y ordinate of the vector final point
     * @param qx the x ordinate of the query point
     * @param qy the y ordinate of the query point
     * 
     * @return 1 if q is counter-clockwise (left) from p1-p2
     *        -1 if q is clockwise (right) from p1-p2
     *         0 if q is collinear with p1-p2
     */
    public static orientationIndex(p1x: number | Coordinate, p1y: number | Coordinate, p2x: number | Coordinate, p2y?: number, qx?: number, qy?: number): number {
        // // fast filter for orientation index
        // // avoids use of slow extended-precision arithmetic in many cases
        // let index = orientationIndexFilter(p1x, p1y, p2x, p2y, qx, qy);
        // if (index <= 1) return index;

        // // normalize coordinates
        // const dx1 = DD.valueOf(p2x).selfAdd(-p1x);
        // const dy1 = DD.valueOf(p2y).selfAdd(-p1y);
        // const dx2 = DD.valueOf(qx).selfAdd(-p2x);
        // const dy2 = DD.valueOf(qy).selfAdd(-p2y);

        // // sign of determinant - unrolled for performance
        // return dx1.selfMultiply(dy2).selfSubtract(dy1.selfMultiply(dx2)).signum();
        if (isNumber(p1x)) {
            return CGAlgorithmsDD._orientationIndex((p1x as number), (p1y as number), (p2x as number), (p2y as number), (qx as number), (qy as number));
        }
        const p1 = (p1x as Coordinate), p2 = (p1y as Coordinate), q = (p2x as Coordinate);
        return CGAlgorithmsDD._orientationIndex(p1.x, p1.y, p2.x, p2.y, q.x, q.y);
    }

    public static _orientationIndex(p1x: number, p1y: number, p2x: number, p2y: number, qx: number, qy: number): number {
        // fast filter for orientation index
        // avoids use of slow extended-precision arithmetic in many cases
        let index = CGAlgorithmsDD.orientationIndexFilter(p1x, p1y, p2x, p2y, qx, qy);
        if (index <= 1) return index;

        // normalize coordinates
        const dx1 = DD.valueOf(p2x).selfAdd(-p1x);
        const dy1 = DD.valueOf(p2y).selfAdd(-p1y);
        const dx2 = DD.valueOf(qx).selfAdd(-p2x);
        const dy2 = DD.valueOf(qy).selfAdd(-p2y);

        // sign of determinant - unrolled for performance
        return dx1.selfMultiply(dy2).selfSubtract(dy1.selfMultiply(dx2)).signum();
    }

    /**
     * Computes the sign of the determinant of the 2x2 matrix
     * with the given entries.
     * 
     * @return -1 if the determinant is negative,
     *          1 if the determinant is positive,
     *          0 if the determinant is 0.
     */
    public static signOfDet2x2(dx1: DD | number, dy1: DD | number, dx2: DD | number, dy2: DD | number): number {
        if (dx1 instanceof DD) {
            const det = dx1.multiply(dy2).selfSubtract((dy1 as DD).multiply(dx2));
            return det.signum();
        }
        const x1 = DD.valueOf(dx1);
        const y1 = DD.valueOf((dy1 as number));
        const x2 = DD.valueOf((dx2 as number));
        const y2 = DD.valueOf((dy2 as number));

        const det = x1.multiply(y2).selfSubtract(y1.multiply(x2));
        return det.signum();

    }

    /**
     * Computes the sign of the determinant of the 2x2 matrix
     * with the given entries.
     * 
     * @return -1 if the determinant is negative,
     *          1 if the determinant is positive,
     *          0 if the determinant is 0.
     */
    // public static int signOfDet2x2(double dx1, double dy1, double dx2, double dy2) {
    // DD x1 = DD.valueOf(dx1);
    // DD y1 = DD.valueOf(dy1);
    // DD x2 = DD.valueOf(dx2);
    // DD y2 = DD.valueOf(dy2);

    // DD det = x1.multiply(y2).selfSubtract(y1.multiply(x2));
    //     return det.signum();
    // }

    /**
     * A value which is safely greater than the
     * relative round-off error in double-precision numbers
     */
    private static DP_SAFE_EPSILON: number = 1e-15;

    /**
     * A filter for computing the orientation index of three coordinates.
     * <p>
     * If the orientation can be computed safely using standard DP
     * arithmetic, this routine returns the orientation index.
     * Otherwise, a value i > 1 is returned.
     * In this case the orientation index must 
     * be computed using some other more robust method.
     * The filter is fast to compute, so can be used to 
     * avoid the use of slower robust methods except when they are really needed,
     * thus providing better average performance.
     * <p>
     * Uses an approach due to Jonathan Shewchuk, which is in the public domain.
     * 
     * @param pax A coordinate
     * @param pay A coordinate
     * @param pbx B coordinate
     * @param pby B coordinate
     * @param pcx C coordinate
     * @param pcy C coordinate
     * @return the orientation index if it can be computed safely
     * @return i > 1 if the orientation index cannot be computed safely
     */
    private static orientationIndexFilter(pax: number, pay: number, pbx: number, pby: number, pcx: number, pcy: number): number {
        let detsum;

        let detleft = (pax - pcx) * (pby - pcy);
        let detright = (pay - pcy) * (pbx - pcx);
        let det = detleft - detright;

        if (detleft > 0.0) {
            if (detright <= 0.0) {
                return CGAlgorithmsDD.signum(det);
            }
            else {
                detsum = detleft + detright;
            }
        }
        else if (detleft < 0.0) {
            if (detright >= 0.0) {
                return CGAlgorithmsDD.signum(det);
            }
            else {
                detsum = -detleft - detright;
            }
        }
        else {
            return CGAlgorithmsDD.signum(det);
        }

        let errbound = CGAlgorithmsDD.DP_SAFE_EPSILON * detsum;
        if ((det >= errbound) || (-det >= errbound)) {
            return CGAlgorithmsDD.signum(det);
        }

        return 2;
    }

    private static signum(x: number): number {
        if (x > 0) return 1;
        if (x < 0) return -1;
        return 0;
    }

    /**
     * Computes an intersection point between two lines
     * using DD arithmetic.
     * If the lines are parallel (either identical
     * or separate) a null value is returned.
     * 
     * @param p1 an endpoint of line segment 1
     * @param p2 an endpoint of line segment 1
     * @param q1 an endpoint of line segment 2
     * @param q2 an endpoint of line segment 2
     * @return an intersection point if one exists, or null if the lines are parallel
     */
    public static intersection(p1: Coordinate, p2: Coordinate, q1: Coordinate, q2: Coordinate): Coordinate | null {
        const px = new DD(p1.y).selfSubtract(p2.y);
        const py = new DD(p2.x).selfSubtract(p1.x);
        const pw = new DD(p1.x).selfMultiply(p2.y).selfSubtract(new DD(p2.x).selfMultiply(p1.y));

        const qx = new DD(q1.y).selfSubtract(q2.y);
        const qy = new DD(q2.x).selfSubtract(q1.x);
        const qw = new DD(q1.x).selfMultiply(q2.y).selfSubtract(new DD(q2.x).selfMultiply(q1.y));

        const x = py.multiply(qw).selfSubtract(qy.multiply(pw));
        const y = qx.multiply(pw).selfSubtract(px.multiply(qw));
        const w = px.multiply(qy).selfSubtract(qx.multiply(py));

        const xInt = x.selfDivide(w).doubleValue();
        const yInt = y.selfDivide(w).doubleValue();

        if ((Number.isNaN(xInt)) || (isInfinite(xInt) || Number.isNaN(yInt)) || (isInfinite(yInt))) {
            return null;
        }

        return new Coordinate(xInt, yInt);
    }
}