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

import { isNumber } from "../util/NumberUtil";

/**
 * Implements some 2D matrix operations 
 * (in particular, solving systems of linear equations).
 * 
 * @author Martin Davis
 *
 */
export class Matrix {
    private static swapRows(m: Array<number> | Array<Array<number>>, i: number, j: number) {
        if (isNumber(m[0])) {
            if (i == j) return;
            const temp = m[i];
            m[i] = m[j];
            m[j] = temp;
            return;
        } else if (isNumber(m[0][0])) {
            if (i == j) return;
            for (let col = 0; col < (m[0] as Array<number>).length; col++) {
                const temp = m[i][col];
                m[i][col] = m[j][col];
                m[j][col] = temp;
            }
        }
    }

    // private static void swapRows(double[] m, int i, int j) {
    //     if (i == j) return;
    // double temp = m[i];
    //     m[i] = m[j];
    //     m[j] = temp;
    // }

    /**
     * Solves a system of equations using Gaussian Elimination.
     * In order to avoid overhead the algorithm runs in-place
     * on A - if A should not be modified the client must supply a copy.
     * 
     * @param a an nxn matrix in row/column order )modified by this method)
     * @param b a vector of length n
     * 
     * @return a vector containing the solution (if any)
     * or null if the system has no or no unique solution
     * 
     * @throws IllegalArgumentException if the matrix is the wrong size 
     */
    public static solve(a: Array<Array<number>>, b: Array<number>): Array<number> | null {
        const n = b.length;
        if (a.length != n || a[0].length !== n)
            throw new Error("Matrix A is incorrectly sized");

        // Use Gaussian Elimination with partial pivoting.
        // Iterate over each row
        for (let i = 0; i < n; i++) {
            // Find the largest pivot in the rows below the current one.
            let maxElementRow = i;
            for (let j = i + 1; j < n; j++)
                if (Math.abs(a[j][i]) > Math.abs(a[maxElementRow][i]))
                    maxElementRow = j;

            if (a[maxElementRow][i] == 0.0)
                return null;

            // Exchange current row and maxElementRow in A and b.
            Matrix.swapRows(a, i, maxElementRow);
            Matrix.swapRows(b, i, maxElementRow);

            // Eliminate using row i
            for (let j = i + 1; j < n; j++) {
                let rowFactor = a[j][i] / a[i][i];
                for (let k = n - 1; k >= i; k--)
                    a[j][k] -= a[i][k] * rowFactor;
                b[j] -= b[i] * rowFactor;
            }
        }

        /**
         * A is now (virtually) in upper-triangular form.
         * The solution vector is determined by back-substitution.
         */
        const solution: Array<number> = [];
        for (let j = n - 1; j >= 0; j--) {
            let t = 0.0;
            for (let k = j + 1; k < n; k++)
                t += a[j][k] * solution[k];
            solution[j] = (b[j] - t) / a[j][j];
        }
        return solution;
    }

}