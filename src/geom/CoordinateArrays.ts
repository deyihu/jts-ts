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
import { CoordinateList } from "./CoordinateList";
import { Coordinates } from "./Coordinates";
import { Envelope } from "./Envelope";
import { MathUtil } from "./../math/MathUtil";

// import java.lang.reflect.Array;
// import java.util.Collection;
// import java.util.Comparator;

// import org.locationtech.jts.math.MathUtil;


/**
 * Useful utility functions for handling Coordinate arrays
 *
 * @version 1.7
 */
export class CoordinateArrays {
    private static coordArrayType: Array<Coordinate> = [];

    private CoordinateArrays() {
    }

    /**
     * Determine dimension based on subclass of {@link Coordinate}.
     *
     * @param pts supplied coordinates
     * @return number of ordinates recorded
     */
    public static dimension(pts: Array<Coordinate>): number {
        if (pts == null || pts.length == 0) {
            return 3; // unknown, assume default
        }
        let dimension = 0;
        for (const coordinate of pts) {
            dimension = Math.max(dimension, Coordinates.dimension(coordinate));
        }
        return dimension;
    }

    /**
     * Determine number of measures based on subclass of {@link Coordinate}.
     *
     * @param pts supplied coordinates
     * @return number of measures recorded
     */
    public static measures(pts: Array<Coordinate>): number {
        if (pts == null || pts.length == 0) {
            return 0; // unknown, assume default
        }
        let measures = 0;
        for (const coordinate of pts) {
            measures = Math.max(measures, Coordinates.measures(coordinate));
        }
        return measures;
    }


    /**
     * Utility method ensuring array contents are of consistent dimension and measures.
     * <p>
     * Array is modified in place if required, coordinates are replaced in the array as required
     * to ensure all coordinates have the same dimension and measures. The final dimension and
     * measures used are the maximum found when checking the array.
     * </p>
     *
     * @param array Modified in place to coordinates of consistent dimension and measures.
     */
    public static enforceConsistency(array: Array<Coordinate>, dimension?: number, measures?: number): Array<Coordinate> | null {
        if (array == null) {
            return null;
        }
        if (dimension !== undefined) {
            const sample = Coordinates.create(dimension, measures);
            const type = sample.type;
            let isConsistent = true;
            for (let i = 0; i < array.length; i++) {
                const coordinate = array[i];
                if (coordinate != null && !(coordinate.type === type)) {
                    isConsistent = false;
                    break;
                }
            }
            if (isConsistent) {
                return array;
            }
            else {
                // const coordinateType = sample.type;
                const copy: Array<Coordinate> = [];
                for (let i = 0; i < copy.length; i++) {
                    const coordinate = array[i];
                    if (coordinate != null && !(coordinate.type === type)) {
                        const duplicate = Coordinates.create(dimension, measures);
                        duplicate.setCoordinate(coordinate);
                        copy[i] = duplicate;
                    }
                    else {
                        copy[i] = coordinate;
                    }
                }
                return copy;
            }
        }
        // step one check
        let maxDimension = -1;
        let maxMeasures = -1;
        let isConsistent = true;
        for (let i = 0; i < array.length; i++) {
            const coordinate = array[i];
            if (coordinate != null) {
                const d = Coordinates.dimension(coordinate);
                const m = Coordinates.measures(coordinate);
                if (maxDimension == -1) {
                    maxDimension = d;
                    maxMeasures = m;
                    continue;
                }
                if (d != maxDimension || m != maxMeasures) {
                    isConsistent = false;
                    maxDimension = Math.max(maxDimension, d);
                    maxMeasures = Math.max(maxMeasures, m);
                }
            }
        }
        if (!isConsistent) {
            // step two fix
            const sample = Coordinates.create(maxDimension, maxMeasures);
            const type = sample.type;

            for (let i = 0; i < array.length; i++) {
                const coordinate = array[i];
                if (coordinate != null && !(coordinate.type === type)) {
                    const duplicate = Coordinates.create(maxDimension, maxMeasures);
                    duplicate.setCoordinate(coordinate);
                    array[i] = duplicate;
                }
            }
        }
        return null;
    }

    /**
     * Utility method ensuring array contents are of the specified dimension and measures.
     * <p>
     * Array is returned unmodified if consistent, or a copy of the array is made with
     * each inconsistent coordinate duplicated into an instance of the correct dimension and measures.
     * </p></>
     *
     * @param array coordinate array
     * @param dimension
     * @param measures
     * @return array returned, or copy created if required to enforce consistency.
     */
    // public static Coordinate[] enforceConsistency(Coordinate[] array, int dimension, int measures) {
    // Coordinate sample = Coordinates.create(dimension, measures);
    //     Class <?> type = sample.getClass();
    // boolean isConsistent = true;
    //     for (int i = 0; i < array.length; i++) {
    //   Coordinate coordinate = array[i];
    //         if (coordinate != null && !coordinate.getClass().equals(type)) {
    //             isConsistent = false;
    //             break;
    //         }
    //     }
    //     if (isConsistent) {
    //         return array;
    //     }
    //     else {
    //         Class <? extends Coordinate > coordinateType = sample.getClass();
    //   Coordinate copy[] = (Coordinate[]) Array.newInstance(coordinateType, array.length);
    //         for (int i = 0; i < copy.length; i++) {
    //     Coordinate coordinate = array[i];
    //             if (coordinate != null && !coordinate.getClass().equals(type)) {
    //       Coordinate duplicate = Coordinates.create(dimension, measures);
    //                 duplicate.setCoordinate(coordinate);
    //                 copy[i] = duplicate;
    //             }
    //             else {
    //                 copy[i] = coordinate;
    //             }
    //         }
    //         return copy;
    //     }
    // }

    /**
     * Tests whether an array of {@link Coordinate}s forms a ring,
     * by checking length and closure.
     * Self-intersection is not checked.
     *
     * @param pts an array of Coordinates
     * @return true if the coordinate form a ring.
     */
    public static isRing(pts: Array<Coordinate>): boolean {
        if (pts.length < 4) return false;
        if (!pts[0].equals2D(pts[pts.length - 1])) return false;
        return true;
    }

    /**
     * Finds a point in a list of points which is not contained in another list of points
     *
     * @param testPts the {@link Coordinate}s to test
     * @param pts     an array of {@link Coordinate}s to test the input points against
     * @return a {@link Coordinate} from <code>testPts</code> which is not in <code>pts</code>, '
     * or <code>null</code>
     */
    public static ptNotInList(testPts: Array<Coordinate>, pts: Array<Coordinate>): Coordinate | null {
        for (let i = 0; i < testPts.length; i++) {
            const testPt = testPts[i];
            if (CoordinateArrays.indexOf(testPt, pts) < 0)
                return testPt;
        }
        return null;
    }

    /**
     * Compares two {@link Coordinate} arrays
     * in the forward direction of their coordinates,
     * using lexicographic ordering.
     *
     * @param pts1
     * @param pts2
     * @return an integer indicating the order
     */
    public static compare(pts1: Array<Coordinate>, pts2: Array<Coordinate>): number {
        let i = 0;
        while (i < pts1.length && i < pts2.length) {
            let compare = pts1[i].compareTo(pts2[i]);
            if (compare != 0)
                return compare;
            i++;
        }
        // handle situation when arrays are of different length
        if (i < pts2.length) return -1;
        if (i < pts1.length) return 1;

        return 0;
    }

    /**
  * A {@link Comparator} for {@link Coordinate} arrays
  * in the forward direction of their coordinates,
  * using lexicographic ordering.
  */
    public static ForwardComparator: any = class ForwardComparator {
        public compare(o1: Object, o2: Object): number {
            const pts1: Array<Coordinate> = (o1 as Array<Coordinate>);
            const pts2: Array<Coordinate> = (o2 as Array<Coordinate>);

            return CoordinateArrays.compare(pts1, pts2);
        }
    }


    /**
     * Determines which orientation of the {@link Coordinate} array
     * is (overall) increasing.
     * In other words, determines which end of the array is "smaller"
     * (using the standard ordering on {@link Coordinate}).
     * Returns an integer indicating the increasing direction.
     * If the sequence is a palindrome, it is defined to be
     * oriented in a positive direction.
     *
     * @param pts the array of Coordinates to test
     * @return <code>1</code> if the array is smaller at the start
     * or is a palindrome,
     * <code>-1</code> if smaller at the end
     */
    public static increasingDirection(pts: Array<Coordinate>): number {
        for (let i = 0; i < pts.length / 2; i++) {
            let j = pts.length - 1 - i;
            // skip equal points on both ends
            let comp = pts[i].compareTo(pts[j]);
            if (comp != 0)
                return comp;
        }
        // array must be a palindrome - defined to be in positive direction
        return 1;
    }

    /**
     * Determines whether two {@link Coordinate} arrays of equal length
     * are equal in opposite directions.
     *
     * @param pts1
     * @param pts2
     * @return <code>true</code> if the two arrays are equal in opposite directions.
     */
    private static isEqualReversed(pts1: Array<Coordinate>, pts2: Array<Coordinate>): boolean {
        for (let i = 0; i < pts1.length; i++) {
            const p1 = pts1[i];
            const p2 = pts2[pts1.length - i - 1];
            if (p1.compareTo(p2) != 0)
                return false;
        }
        return true;
    }

    /**
     * A {@link Comparator} for {@link Coordinate} arrays
     * modulo their directionality.
     * E.g. if two coordinate arrays are identical but reversed
     * they will compare as equal under this ordering.
     * If the arrays are not equal, the ordering returned
     * is the ordering in the forward direction.
     */
    public static BidirectionalComparator: any = class {
        public compare(o1: Object, o2: Object): number {
            const pts1: Array<Coordinate> = (o1 as Array<Coordinate>)
            const pts2: Array<Coordinate> = (o2 as Array<Coordinate>);

            if (pts1.length < pts2.length) return -1;
            if (pts1.length > pts2.length) return 1;

            if (pts1.length == 0) return 0;

            let forwardComp = CoordinateArrays.compare(pts1, pts2);
            let isEqualRev = CoordinateArrays.isEqualReversed(pts1, pts2);
            if (isEqualRev)
                return 0;
            return forwardComp;
        }

        public OLDcompare(o1: Object, o2: Object): number {
            const pts1: Array<Coordinate> = (o1 as Array<Coordinate>);
            const pts2: Array<Coordinate> = (o2 as Array<Coordinate>);

            if (pts1.length < pts2.length) return -1;
            if (pts1.length > pts2.length) return 1;

            if (pts1.length == 0) return 0;

            let dir1 = CoordinateArrays.increasingDirection(pts1);
            let dir2 = CoordinateArrays.increasingDirection(pts2);

            let i1 = dir1 > 0 ? 0 : pts1.length - 1;
            let i2 = dir2 > 0 ? 0 : pts1.length - 1;

            for (let i = 0; i < pts1.length; i++) {
                let comparePt = pts1[i1].compareTo(pts2[i2]);
                if (comparePt != 0)
                    return comparePt;
                i1 += dir1;
                i2 += dir2;
            }
            return 0;
        }

    }

    /**
     * Creates a deep copy of the argument {@link Coordinate} array.
     *
     * @param coordinates an array of Coordinates
     * @return a deep copy of the input
     */
    // public static copyDeep(coordinates: Array<Coordinate>): Array<Coordinate> {
    //     const copy: Array<Coordinate> = [];
    //     for (let i = 0; i < coordinates.length; i++) {
    //         copy[i] = coordinates[i].copy();
    //     }
    //     return copy;
    // }

    /**
     * Creates a deep copy of a given section of a source {@link Coordinate} array
     * into a destination Coordinate array.
     * The destination array must be an appropriate size to receive
     * the copied coordinates.
     *
     * @param src       an array of Coordinates
     * @param srcStart  the index to start copying from
     * @param dest      the
     * @param destStart the destination index to start copying to
     * @param length    the number of items to copy
     */
    public static copyDeep(src: Array<Coordinate>, srcStart?: number, dest?: Array<Coordinate>, destStart?: number, length?: number): Array<Coordinate> | undefined {
        if (srcStart === undefined) {
            const copy: Array<Coordinate> = [];
            for (let i = 0; i < src.length; i++) {
                copy[i] = src[i].copy();
            }
            return copy;
        }
        if (dest && destStart !== undefined && length !== undefined) {
            for (let i = 0; i < length; i++) {
                dest[destStart + i] = src[srcStart + i].copy();
            }
        }
    }

    /**
     * Converts the given Collection of Coordinates into a Coordinate array.
     */
    public static toCoordinateArray(coordList: CoordinateList): Array<Coordinate> {
        return coordList.toCoordinateArray();
    }

    /**
     * Tests whether {@link Coordinate#equals(Object)} returns true for any two consecutive Coordinates
     * in the given array.
     * 
     * @param coord an array of coordinates
     * @return true if the array has repeated points
     */
    public static hasRepeatedPoints(coord: Array<Coordinate>): boolean {
        for (let i = 1; i < coord.length; i++) {
            if (coord[i - 1].equals(coord[i])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns either the given coordinate array if its length is greater than the
     * given amount, or an empty coordinate array.
     */
    public static atLeastNCoordinatesOrNothing(n: number, c: Array<Coordinate>): Array<Coordinate> {
        return c.length >= n ? c : [];
    }

    /**
     * If the coordinate array argument has repeated points,
     * constructs a new array containing no repeated points.
     * Otherwise, returns the argument.
     *
     * @param coord an array of coordinates
     * @return the array with repeated coordinates removed
     * @see #hasRepeatedPoints(Coordinate[])
     */
    public static removeRepeatedPoints(coord: Array<Coordinate>): Array<Coordinate> {
        if (!CoordinateArrays.BidirectionalComparator.hasRepeatedPoints(coord)) return coord;
        const coordList = new CoordinateList(coord, false);
        return coordList.toCoordinateArray();
    }

    /**
     * Tests whether an array has any repeated or invalid coordinates.
     * 
     * @param coord an array of coordinates
     * @return true if the array contains repeated or invalid coordinates
     * @see Coordinate#isValid()
     */
    public static hasRepeatedOrInvalidPoints(coord: Array<Coordinate>): boolean {
        for (let i = 1; i < coord.length; i++) {
            if (!coord[i].isValid())
                return true;
            if (coord[i - 1].equals(coord[i])) {
                return true;
            }
        }
        return false;
    }

    /**
     * If the coordinate array argument has repeated or invalid points,
     * constructs a new array containing no repeated points.
     * Otherwise, returns the argument.
     * 
     * @param coord an array of coordinates
     * @return the array with repeated and invalid coordinates removed
     * @see #hasRepeatedOrInvalidPoints(Coordinate[])
     * @see Coordinate#isValid() 
     */
    public static removeRepeatedOrInvalidPoints(coord: Array<Coordinate>): Array<Coordinate> {
        if (!CoordinateArrays.hasRepeatedOrInvalidPoints(coord)) return coord;
        const coordList = new CoordinateList();
        for (let i = 0; i < coord.length; i++) {
            if (!coord[i].isValid()) continue;
            coordList.add(coord[i], false);
        }
        return coordList.toCoordinateArray();
    }

    /**
     * Collapses a coordinate array to remove all null elements.
     *
     * @param coord the coordinate array to collapse
     * @return an array containing only non-null elements
     */
    public static removeNull(coord: Array<Coordinate>): Array<Coordinate> {
        let nonNull = 0;
        for (let i = 0; i < coord.length; i++) {
            if (coord[i] !== null) nonNull++;
        }
        const newCoord: Array<Coordinate> = [];
        // empty case
        if (nonNull === 0) return newCoord;

        let j = 0;
        for (let i = 0; i < coord.length; i++) {
            if (coord[i] !== null) newCoord[j++] = coord[i];
        }
        return newCoord;
    }

    /**
     * Reverses the coordinates in an array in-place.
     */
    public static reverse(coord: Array<Coordinate>) {
        if (coord.length <= 1)
            return;

        let last = coord.length - 1;
        let mid = last / 2;
        for (let i = 0; i <= mid; i++) {
            const tmp = coord[i];
            coord[i] = coord[last - i];
            coord[last - i] = tmp;
        }
    }

    /**
     * Returns true if the two arrays are identical, both null, or pointwise
     * equal (as compared using Coordinate#equals)
     *
     * @see Coordinate#equals(Object)
     */
    // public static equals(coord1: Array<Coordinate>, coord2: Array<Coordinate>): boolean {
    //     if (coord1 === coord2) return true;
    //     if (coord1 === null || coord2 === null) return false;
    //     if (coord1.length !== coord2.length) return false;
    //     for (let i = 0; i < coord1.length; i++) {
    //         if (!coord1[i].equals(coord2[i])) return false;
    //     }
    //     return true;
    // }

    /**
     * Returns true if the two arrays are identical, both null, or pointwise
     * equal, using a user-defined {@link Comparator} for {@link Coordinate} s
     *
     * @param coord1               an array of Coordinates
     * @param coord2               an array of Coordinates
     * @param coordinateComparator a Comparator for Coordinates
     */
    public static equals(coord1: Array<Coordinate>, coord2: Array<Coordinate>, coordinateComparator): boolean {
        if (coordinateComparator === undefined) {
            if (coord1 === coord2) return true;
            if (coord1 === null || coord2 === null) return false;
            if (coord1.length !== coord2.length) return false;
            for (let i = 0; i < coord1.length; i++) {
                if (!coord1[i].equals(coord2[i])) return false;
            }
            return true;
        }
        if (coord1 == coord2) return true;
        if (coord1 == null || coord2 == null) return false;
        if (coord1.length != coord2.length) return false;
        for (let i = 0; i < coord1.length; i++) {
            if (coordinateComparator.compare(coord1[i], coord2[i]) !== 0)
                return false;
        }
        return true;
    }

    /**
     * Returns the minimum coordinate, using the usual lexicographic comparison.
     *
     * @param coordinates the array to search
     * @return the minimum coordinate in the array, found using <code>compareTo</code>
     * @see Coordinate#compareTo(Coordinate)
     */
    public static minCoordinate(coordinates: Array<Coordinate>): Coordinate {
        let minCoord: Coordinate = coordinates[0];
        for (let i = 0; i < coordinates.length; i++) {
            if (undefined === minCoord || minCoord.compareTo(coordinates[i]) > 0) {
                minCoord = coordinates[i];
            }
        }
        return minCoord;
    }

    /**
   * Shifts the positions of the coordinates until the coordinate
   * at <code>indexOfFirstCoordinate</code> is first.
   * <p/>
   * If {@code ensureRing} is {@code true}, first and last
   * coordinate of the returned array are equal.
   *
   * @param coordinates            the array to rearrange
   * @param indexOfFirstCoordinate the index of the coordinate to make first
   * @param ensureRing             flag indicating if returned array should form a ring.
   */
    public static scroll(coordinates: Array<Coordinate>, indexOfFirstCoordinate: number | Coordinate, ensureRing?: boolean) {
        if (indexOfFirstCoordinate instanceof Coordinate) {
            indexOfFirstCoordinate = CoordinateArrays.indexOf(indexOfFirstCoordinate, coordinates);
        }
        if (ensureRing === undefined) {
            ensureRing = CoordinateArrays.isRing(coordinates);
        }
        let i = indexOfFirstCoordinate;
        if (i <= 0) return;

        const newCoordinates: Array<Coordinate> = [];
        if (!ensureRing) {
            // System.arraycopy(coordinates, i, newCoordinates, 0, coordinates.length - i);
            // System.arraycopy(coordinates, 0, newCoordinates, coordinates.length - i, i);
            arraycopy(coordinates, i, newCoordinates, 0, coordinates.length - i);
            arraycopy(coordinates, 0, newCoordinates, coordinates.length - i, i);
        } else {
            let last = coordinates.length - 1;

            // fill in values
            let j;
            for (j = 0; j < last; j++)
                newCoordinates[j] = coordinates[(i + j) % last];

            // Fix the ring (first == last)
            newCoordinates[j] = newCoordinates[0].copy();
        }
        // System.arraycopy(newCoordinates, 0, coordinates, 0, coordinates.length);
        arraycopy(newCoordinates, 0, coordinates, 0, coordinates.length);
    }

    /**
     * Shifts the positions of the coordinates until <code>firstCoordinate</code>
     * is first.
     *
     * @param coordinates     the array to rearrange
     * @param firstCoordinate the coordinate to make first
     */
    // public static void scroll(Coordinate[] coordinates, Coordinate firstCoordinate) {
    // int i = indexOf(firstCoordinate, coordinates);
    //     scroll(coordinates, i);
    // }

    /**
     * Shifts the positions of the coordinates until the coordinate
     * at <code>firstCoordinate</code> is first.
     *
     * @param coordinates            the array to rearrange
     * @param indexOfFirstCoordinate the index of the coordinate to make first
     */
    // public static void scroll(Coordinate[] coordinates, int indexOfFirstCoordinate) {
    //     scroll(coordinates, indexOfFirstCoordinate, CoordinateArrays.isRing(coordinates));
    // }

    /**
     * Shifts the positions of the coordinates until the coordinate
     * at <code>indexOfFirstCoordinate</code> is first.
     * <p/>
     * If {@code ensureRing} is {@code true}, first and last
     * coordinate of the returned array are equal.
     *
     * @param coordinates            the array to rearrange
     * @param indexOfFirstCoordinate the index of the coordinate to make first
     * @param ensureRing             flag indicating if returned array should form a ring.
     */
    // public static void scroll(Coordinate[] coordinates, int indexOfFirstCoordinate, boolean ensureRing) {
    // int i = indexOfFirstCoordinate;
    //     if (i <= 0) return;

    //     Coordinate[] newCoordinates = new Coordinate[coordinates.length];
    //     if (!ensureRing) {
    //         System.arraycopy(coordinates, i, newCoordinates, 0, coordinates.length - i);
    //         System.arraycopy(coordinates, 0, newCoordinates, coordinates.length - i, i);
    //     } else {
    //   int last = coordinates.length - 1;

    //   // fill in values
    //   int j;
    //         for (j = 0; j < last; j++)
    //             newCoordinates[j] = coordinates[(i + j) % last];

    //         // Fix the ring (first == last)
    //         newCoordinates[j] = newCoordinates[0].copy();
    //     }
    //     System.arraycopy(newCoordinates, 0, coordinates, 0, coordinates.length);
    // }

    /**
     * Returns the index of <code>coordinate</code> in <code>coordinates</code>.
     * The first position is 0; the second, 1; etc.
     *
     * @param coordinate  the <code>Coordinate</code> to search for
     * @param coordinates the array to search
     * @return the position of <code>coordinate</code>, or -1 if it is
     * not found
     */
    public static indexOf(coordinate: Coordinate, coordinates: Array<Coordinate>): number {
        for (let i = 0; i < coordinates.length; i++) {
            if (coordinate.equals(coordinates[i])) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Extracts a subsequence of the input {@link Coordinate} array
     * from indices <code>start</code> to
     * <code>end</code> (inclusive).
     * The input indices are clamped to the array size;
     * If the end index is less than the start index,
     * the extracted array will be empty.
     *
     * @param pts   the input array
     * @param start the index of the start of the subsequence to extract
     * @param end   the index of the end of the subsequence to extract
     * @return a subsequence of the input array
     */
    public static extract(pts: Array<Coordinate>, start: number, end: number): Array<Coordinate> {
        start = MathUtil.clamp(start, 0, pts.length);
        end = MathUtil.clamp(end, -1, pts.length);

        let npts = end - start + 1;
        if (end < 0) npts = 0;
        if (start >= pts.length) npts = 0;
        if (end < start) npts = 0;

        const extractPts: Array<Coordinate> = [];
        if (npts == 0) return extractPts;

        let iPts = 0;
        for (let i = start; i <= end; i++) {
            extractPts[iPts++] = pts[i];
        }
        return extractPts;
    }

    /**
     * Computes the envelope of the coordinates.
     *
     * @param coordinates the coordinates to scan
     * @return the envelope of the coordinates
     */
    public static envelope(coordinates: Array<Coordinate>): Envelope {
        const env = new Envelope();
        for (let i = 0; i < coordinates.length; i++) {
            env.expandToInclude(coordinates[i]);
        }
        return env;
    }

    /**
     * Extracts the coordinates which intersect an {@link Envelope}.
     *
     * @param coordinates the coordinates to scan
     * @param env         the envelope to intersect with
     * @return an array of the coordinates which intersect the envelope
     */
    public static intersection(coordinates: Array<Coordinate>, env: Envelope): Array<Coordinate> {
        const coordList = new CoordinateList();
        for (let i = 0; i < coordinates.length; i++) {
            if (env.intersects(coordinates[i]))
                coordList.add(coordinates[i], true);
        }
        return coordList.toCoordinateArray();
    }

}

function arraycopy(coordinates: Array<Coordinate>, srcPos: number, dest: Array<Coordinate>, destPos: number, length: number) {
    const len = srcPos + length;
    let idx = destPos;
    for (let i = srcPos; i < len; i++) {
        dest[idx] = coordinates[i];
        idx++;
    }
}

