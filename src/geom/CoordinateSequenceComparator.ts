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

import { isUndefined } from "../util/NumberUtil";
import { CoordinateSequence } from "./CoordinateSequence";

// package org.locationtech.jts.geom;

// import java.util.Comparator;

/**
 * Compares two {@link CoordinateSequence}s.
 * For sequences of the same dimension, the ordering is lexicographic.
 * Otherwise, lower dimensions are sorted before higher.
 * The dimensions compared can be limited; if this is done
 * ordinate dimensions above the limit will not be compared.
 * <p>
 * If different behaviour is required for comparing size, dimension, or
 * coordinate values, any or all methods can be overridden.
 *
 */
export class CoordinateSequenceComparator {
    /**
     * Compare two <code>double</code>s, allowing for NaN values.
     * NaN is treated as being less than any valid number.
     *
     * @param a a <code>double</code>
     * @param b a <code>double</code>
     * @return -1, 0, or 1 depending on whether a is less than, equal to or greater than b
     */
    public static compare(a: number, b: number): number {
        if (a < b) return -1;
        if (a > b) return 1;

        if (Number.isNaN(a)) {
            if (Number.isNaN(b)) return 0;
            return -1;
        }

        if (Number.isNaN(b)) return 1;
        return 0;
    }

    /**
     * The number of dimensions to test
     */
    protected dimensionLimit: number;

    constructor(dimensionLimit?: number) {
        if (isUndefined(dimensionLimit)) {
            dimensionLimit = Math.floor(Number.MAX_VALUE);
        }
        this.dimensionLimit = (dimensionLimit as number);
    }

    /**
     * Creates a comparator which will test all dimensions.
     */
    // public CoordinateSequenceComparator() {
    //     dimensionLimit = Integer.MAX_VALUE;
    // }

    /**
     * Creates a comparator which will test only the specified number of dimensions.
     *
     * @param dimensionLimit the number of dimensions to test
     */
    // public CoordinateSequenceComparator(int dimensionLimit) {
    //     this.dimensionLimit = dimensionLimit;
    // }

    /**
     * Compares two {@link CoordinateSequence}s for relative order.
     *
     * @param o1 a {@link CoordinateSequence}
     * @param o2 a {@link CoordinateSequence}
     * @return -1, 0, or 1 depending on whether o1 is less than, equal to, or greater than o2
     */
    public compare(o1: Object, o2: Object): number {
        const s1 = (o1 as CoordinateSequence);
        const s2 = (o2 as CoordinateSequence);

        let size1 = s1.size();
        let size2 = s2.size();

        let dim1 = s1.getDimension();
        let dim2 = s2.getDimension();

        let minDim = dim1;
        if (dim2 < minDim)
            minDim = dim2;
        let dimLimited = false;
        if (this.dimensionLimit <= minDim) {
            minDim = this.dimensionLimit;
            dimLimited = true;
        }

        // lower dimension is less than higher
        if (!dimLimited) {
            if (dim1 < dim2) return -1;
            if (dim1 > dim2) return 1;
        }

        // lexicographic ordering of point sequences
        let i = 0;
        while (i < size1 && i < size2) {
            let ptComp = this.compareCoordinate(s1, s2, i, minDim);
            if (ptComp != 0) return ptComp;
            i++;
        }
        if (i < size1) return 1;
        if (i < size2) return -1;

        return 0;
    }

    /**
     * Compares the same coordinate of two {@link CoordinateSequence}s
     * along the given number of dimensions.
     *
     * @param s1 a {@link CoordinateSequence}
     * @param s2 a {@link CoordinateSequence}
     * @param i the index of the coordinate to test
     * @param dimension the number of dimensions to test
     * @return -1, 0, or 1 depending on whether s1[i] is less than, equal to, or greater than s2[i]
     */
    protected compareCoordinate(s1: CoordinateSequence, s2: CoordinateSequence, i: number, dimension: number): number {
        for (let d = 0; d < dimension; d++) {
            let ord1 = s1.getOrdinate(i, d);
            let ord2 = s2.getOrdinate(i, d);
            let comp = this.compare(ord1, ord2);
            if (comp !== 0) return comp;
        }
        return 0;
    }
}