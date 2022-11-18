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

// import java.util.Random;

/**
 * Various utility functions for mathematical and numerical operations.
 * 
 * @author mbdavis
 *
 */
export class MathUtil {
    /**
     * Clamps a <tt>double</tt> value to a given range.
     * @param x the value to clamp
     * @param min the minimum value of the range
     * @param max the maximum value of the range
     * @return the clamped value
     */
    public static clamp(x: number, min: number, max: number): number {

        if (x < min) return min;
        if (x > max) return max;
        return x;
    }

    /**
     * Clamps an <tt>int</tt> value to a given range.
     * @param x the value to clamp
     * @param min the minimum value of the range
     * @param max the maximum value of the range
     * @return the clamped value
     */
    // public static clamp(int x, int min, int max): number {
    //     if (x < min) return min;
    //     if (x > max) return max;
    //     return x;
    // }

    /**
     * Clamps an integer to a given maximum limit.
     * 
     * @param x the value to clamp
     * @param max the maximum value
     * @return the clamped value
     */
    public static clampMax(x: number, max: number): number {
        if (x > max) return max;
        return x;
    }

    /**
     * Computes the ceiling function of the dividend of two integers.
     * 
     * @param num the numerator
     * @param denom the denominator
     * @return the ceiling of num / denom
     */
    public static ceil(num: number, denom: number): number {
        const div = num / denom;
        return div * denom >= num ? div : div + 1;
    }

    private static LOG_10: number = Math.log(10);

    /**
     * Computes the base-10 logarithm of a <tt>double</tt> value.
     * <ul>
     * <li>If the argument is NaN or less than zero, then the result is NaN.
     * <li>If the argument is positive infinity, then the result is positive infinity.
     * <li>If the argument is positive zero or negative zero, then the result is negative infinity.
     * </ul>
     *   
     * @param x a positive number
     * @return the value log a, the base-10 logarithm of the input value
     */
    public static log10(x: number): number {
        const ln = Math.log(x);
        if (ln === Infinity || ln === -Infinity) return ln;
        if (Number.isNaN(ln)) return ln;
        return ln / MathUtil.LOG_10;
    }

    /**
     * Computes an index which wraps around a given maximum value.
     * For values &gt;= 0, this is equals to <tt>val % max</tt>.
     * For values &lt; 0, this is equal to <tt>max - (-val) % max</tt>
     * 
     * @param index the value to wrap
     * @param max the maximum value (or modulus)
     * @return the wrapped index
     */
    public static wrap(index: number, max: number): number {
        if (index < 0) {
            return max - ((-index) % max);
        }
        return index % max;
    }

    /**
     * Computes the average of two numbers.
     * 
     * @param x1 a number
     * @param x2 a number
     * @return the average of the inputs
     */
    public static average(x1: number, x2: number): number {
        return (x1 + x2) / 2.0;
    }

    public static max(v1: number, v2: number, v3: number, v4?: number): number {
        if (v4 !== undefined) {
            let max = v1;
            if (v2 > max) max = v2;
            if (v3 > max) max = v3;
            if (v4 > max) max = v4;
            return max;
        }
        let max = v1;
        if (v2 > max) max = v2;
        if (v3 > max) max = v3;
        return max;
    }

    // public static max(v1: number, v2: number, v3: number, v4: number): number {
    //     let max = v1;
    //     if (v2 > max) max = v2;
    //     if (v3 > max) max = v3;
    //     if (v4 > max) max = v4;
    //     return max;
    // }

    public static min(v1: number, v2: number, v3: number, v4: number) {
        let min = v1;
        if (v2 < min) min = v2;
        if (v3 < min) min = v3;
        if (v4 < min) min = v4;
        return min;
    }

    /**
     * The inverse of the Golden Ratio phi.
     */
    public static PHI_INV: number = (Math.sqrt(5) - 1.0) / 2.0;

    /**
     * Generates a quasi-random sequence of numbers in the range [0,1].
     * They are produced by an additive recurrence with 1/&phi; as the constant.
     * This produces a low-discrepancy sequence which is more evenly
     * distribute than random numbers.
     * <p>
     * See <a href='https://en.wikipedia.org/wiki/Low-discrepancy_sequence#Additive_recurrence'>Wikipedia: Low-discrepancy Sequences - Additive Recurrence</a>.
     * <p>
     * The sequence is initialized by calling it 
     * with any positive fractional number; 0 works well for most uses.
     * 
     * @param curr the current number in the sequence
     * @return the next value in the sequence
     */
    // public static double quasirandom(curr: number, alpha?: number) {
    //     if (alpha === undefined) {
    //         alpha = MathUtil.PHI_INV;
    //     }
    //     return quasirandom(curr, PHI_INV);
    // }

    /**
     * Generates a quasi-random sequence of numbers in the range [0,1].
     * They are produced by an additive recurrence with constant &alpha;.
     * <pre>
     *     R(&alpha;) :  t<sub>n</sub> = { t<sub>0</sub> + n&alpha; },  n = 1,2,3,...   
     * </pre>
     * When &alpha; is irrational this produces a 
     * <a href='https://en.wikipedia.org/wiki/Low-discrepancy_sequence#Additive_recurrence'>Low discrepancy sequence</a>
     *  which is more evenly
     * distributed than random numbers.
     * <p>
     * The sequence is initialized by calling it 
     * with any positive fractional number. 0 works well for most uses.
     * 
     * @param curr the current number in the sequence
     * @param alpha the sequence additive constant
     * @return the next value in the sequence
     */
    public static quasirandom(curr: number, alpha?: number): number {
        if (alpha === undefined) {
            alpha = MathUtil.PHI_INV;
        }
        let next = curr + alpha;
        if (next < 1) return next;
        return next - Math.floor(next);
    }

    /**
     * Generates a randomly-shuffled list of the integers from [0..n-1].
     * <p>
     * One use is to randomize points inserted into a {@link KDtree}.
     * 
     * @param n the number of integers to shuffle
     * @return the shuffled array
     */
    public static shuffle(n: number): Array<number> {
        const rnd = Random(13);
        const ints: Array<number> = [];
        for (let i = 0; i < n; i++) {
            ints[i] = i;
        }
        for (let i = n - 1; i >= 1; i--) {
            let j = Random(i + 1);
            let last = ints[i];
            ints[i] = ints[j];
            ints[j] = last;
        }
        return ints;
    }
}

function Random(value) {
    return Math.round(Math.random() * value);
}