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
// package org.locationtech.jts.algorithm;

import { Coordinate } from "../geom/Coordinate";
import { CoordinateSequence } from './../geom/CoordinateSequence';

// import org.locationtech.jts.geom.Coordinate;
// import org.locationtech.jts.geom.CoordinateSequence;

/**
 * Functions for computing area.
 * 
 * @author Martin Davis
 *
 */
export class Area {

    /**
     * Computes the area for a ring. 
     * 
     * @param ring the coordinates forming the ring
     * @return the area of the ring
     */
    // public static double ofRing(Coordinate[] ring) {
    //     return Math.abs(ofRingSigned(ring));
    // }

    /**
     * Computes the area for a ring. 
     * 
     * @param ring the coordinates forming the ring
     * @return the area of the ring
     */
    public static ofRing(ring: CoordinateSequence | Array<Coordinate>): number {
        return Math.abs(Area.ofRingSigned(ring));
    }

    public static ofRingSigned(ring: Array<Coordinate> | CoordinateSequence): number {
        if (ring instanceof CoordinateSequence) {
            let n = ring.size();
            if (n < 3)
                return 0.0;
            /*
             * Based on the Shoelace formula.
             * http://en.wikipedia.org/wiki/Shoelace_formula
             */
            const p0 = ring.createCoordinate();
            const p1 = ring.createCoordinate();
            const p2 = ring.createCoordinate();
            ring.getCoordinate(0, p1);
            ring.getCoordinate(1, p2);
            let x0 = p1.x;
            p2.x -= x0;
            let sum = 0.0;
            for (let i = 1; i < n - 1; i++) {
                p0.y = p1.y;
                p1.x = p2.x;
                p1.y = p2.y;
                ring.getCoordinate(i + 1, p2);
                p2.x -= x0;
                sum += p1.x * (p0.y - p2.y);
            }
            return sum / 2.0;
        }
        if (ring.length < 3)
            return 0.0;
        let sum = 0.0;
        /*
         * Based on the Shoelace formula.
         * http://en.wikipedia.org/wiki/Shoelace_formula
         */
        let x0 = ring[0].x;
        for (let i = 1; i < ring.length - 1; i++) {
            let x = ring[i].x - x0;
            let y1 = ring[i + 1].y;
            let y2 = ring[i - 1].y;
            sum += x * (y2 - y1);
        }
        return sum / 2.0;
    }


    /**
     * Computes the signed area for a ring. The signed area is positive if the
     * ring is oriented CW, negative if the ring is oriented CCW, and zero if the
     * ring is degenerate or flat.
     * 
     * @param ring
     *          the coordinates forming the ring
     * @return the signed area of the ring
     */
    //     public static double ofRingSigned(Coordinate[] ring) {
    //     if (ring.length < 3)
    //         return 0.0;
    //     double sum = 0.0;
    //     /*
    //      * Based on the Shoelace formula.
    //      * http://en.wikipedia.org/wiki/Shoelace_formula
    //      */
    //     double x0 = ring[0].x;
    //     for (int i = 1; i < ring.length - 1; i++) {
    //       double x = ring[i].x - x0;
    //       double y1 = ring[i + 1].y;
    //       double y2 = ring[i - 1].y;
    //         sum += x * (y2 - y1);
    //     }
    //     return sum / 2.0;
    // }

    /**
     * Computes the signed area for a ring. The signed area is:
     * <ul>
     * <li>positive if the ring is oriented CW
     * <li>negative if the ring is oriented CCW
     * <li>zero if the ring is degenerate or flat
     * </ul>
     * 
     * @param ring
     *          the coordinates forming the ring
     * @return the signed area of the ring
     */
    //     public static double ofRingSigned(CoordinateSequence ring) {
    //     int n = ring.size();
    //     if (n < 3)
    //         return 0.0;
    //     /*
    //      * Based on the Shoelace formula.
    //      * http://en.wikipedia.org/wiki/Shoelace_formula
    //      */
    //     Coordinate p0 = ring.createCoordinate();
    //     Coordinate p1 = ring.createCoordinate();
    //     Coordinate p2 = ring.createCoordinate();
    //     ring.getCoordinate(0, p1);
    //     ring.getCoordinate(1, p2);
    //     double x0 = p1.x;
    //     p2.x -= x0;
    //     double sum = 0.0;
    //     for (int i = 1; i < n - 1; i++) {
    //         p0.y = p1.y;
    //         p1.x = p2.x;
    //         p1.y = p2.y;
    //         ring.getCoordinate(i + 1, p2);
    //         p2.x -= x0;
    //         sum += p1.x * (p0.y - p2.y);
    //     }
    //     return sum / 2.0;
    // }

}