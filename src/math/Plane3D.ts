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
import { Vector3D } from "./Vector3D";

// package org.locationtech.jts.math;

// import org.locationtech.jts.geom.Coordinate;

/**
 * Models a plane in 3-dimensional Cartesian space.
 * 
 * @author mdavis
 *
 */
export class Plane3D {

    /**
     * Enums for the 3 coordinate planes
     */
    public static XY_PLANE: number = 1;
    public static YZ_PLANE: number = 2;
    public static XZ_PLANE: number = 3;

    private normal: Vector3D;
    private basePt: Coordinate;

    public Plane3D(normal: Vector3D, basePt: Coordinate) {
        this.normal = normal;
        this.basePt = basePt;
    }

    /**
     * Computes the oriented distance from a point to the plane.
     * The distance is:
     * <ul>
     * <li><b>positive</b> if the point lies above the plane (relative to the plane normal)
     * <li><b>zero</b> if the point is on the plane
     * <li><b>negative</b> if the point lies below the plane (relative to the plane normal)
     * </ul> 
     * 
     * @param p the point to compute the distance for
     * @return the oriented distance to the plane
     */
    public orientedDistance(p: Coordinate): number {
        const pb = new Vector3D(p, this.basePt);
        let pbdDotNormal = pb.dot(this.normal);
        if (Number.isNaN(pbdDotNormal))
            throw new Error("3D Coordinate has NaN ordinate");
        const d = pbdDotNormal / this.normal.length();
        return d;
    }

    /**
     * Computes the axis plane that this plane lies closest to.
     * <p>
     * Geometries lying in this plane undergo least distortion
     * (and have maximum area)
     * when projected to the closest axis plane.
     * This provides optimal conditioning for
     * computing a Point-in-Polygon test.
     *  
     * @return the index of the closest axis plane.
     */
    public closestAxisPlane(): number {
        const xmag = Math.abs(this.normal.getX());
        const ymag = Math.abs(this.normal.getY());
        const zmag = Math.abs(this.normal.getZ());
        if (xmag > ymag) {
            if (xmag > zmag)
                return Plane3D.YZ_PLANE;
            else
                return Plane3D.XY_PLANE;
        }
        // y >= x
        else if (zmag > ymag) {
            return Plane3D.XY_PLANE;
        }
        // y >= z
        return Plane3D.XZ_PLANE;
    }

}