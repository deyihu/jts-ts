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

/**
 * Provides constants representing the dimensions of a point, a curve and a surface.
 * Also provides constants representing the dimensions of the empty geometry and
 * non-empty geometries, and the wildcard constant {@link #DONTCARE} meaning "any dimension".
 * These constants are used as the entries in {@link IntersectionMatrix}s.
 * 
 * @version 1.7
 */
export class Dimension {

    /**
     *  Dimension value of a point (0).
     */
    public static P: number = 0;

    /**
     *  Dimension value of a curve (1).
     */
    public static L: number = 1;

    /**
     *  Dimension value of a surface (2).
     */
    public static A: number = 2;

    /**
     *  Dimension value of the empty geometry (-1).
     */
    public static FALSE: number = -1;

    /**
     *  Dimension value of non-empty geometries (= {P, L, A}).
     */
    public static TRUE: number = -2;

    /**
     *  Dimension value for any dimension (= {FALSE, TRUE}).
     */
    public static DONTCARE: number = -3;

    /**
     * Symbol for the FALSE pattern matrix entry
     */
    public static SYM_FALSE: string = 'F';

    /**
     * Symbol for the TRUE pattern matrix entry
     */
    public static SYM_TRUE: string = 'T';

    /**
     * Symbol for the DONTCARE pattern matrix entry
     */
    public static SYM_DONTCARE: string = '*';

    /**
     * Symbol for the P (dimension 0) pattern matrix entry
     */
    public static SYM_P: string = '0';

    /**
     * Symbol for the L (dimension 1) pattern matrix entry
     */
    public static SYM_L: string = '1';

    /**
     * Symbol for the A (dimension 2) pattern matrix entry
     */
    public static SYM_A: string = '2';

    /**
     *  Converts the dimension value to a dimension symbol, for example, <code>TRUE =&gt; 'T'</code>
     *  .
     *
     *@param  dimensionValue  a number that can be stored in the <code>IntersectionMatrix</code>
     *      . Possible values are <code>{TRUE, FALSE, DONTCARE, 0, 1, 2}</code>.
     *@return                 a character for use in the string representation of
     *      an <code>IntersectionMatrix</code>. Possible values are <code>{T, F, * , 0, 1, 2}</code>
     *      .
     */
    public static toDimensionSymbol(dimensionValue: number): string {
        switch (dimensionValue) {
            case Dimension.FALSE:
                return Dimension.SYM_FALSE;
            case Dimension.TRUE:
                return Dimension.SYM_TRUE;
            case Dimension.DONTCARE:
                return Dimension.SYM_DONTCARE;
            case Dimension.P:
                return Dimension.SYM_P;
            case Dimension.L:
                return Dimension.SYM_L;
            case Dimension.A:
                return Dimension.SYM_A;
        }
        throw new Error("Unknown dimension value: " + dimensionValue);
    }

    /**
     *  Converts the dimension symbol to a dimension value, for example, <code>'*' =&gt; DONTCARE</code>
     *  .
     *
     *@param  dimensionSymbol  a character for use in the string representation of
     *      an <code>IntersectionMatrix</code>. Possible values are <code>{T, F, * , 0, 1, 2}</code>
     *      .
     *@return a number that can be stored in the <code>IntersectionMatrix</code>
     *      . Possible values are <code>{TRUE, FALSE, DONTCARE, 0, 1, 2}</code>.
     */
    public static toDimensionValue(dimensionSymbol: string): number {
        switch (dimensionSymbol.toUpperCase()) {
            case Dimension.SYM_FALSE:
                return Dimension.FALSE;
            case Dimension.SYM_TRUE:
                return Dimension.TRUE;
            case Dimension.SYM_DONTCARE:
                return Dimension.DONTCARE;
            case Dimension.SYM_P:
                return Dimension.P;
            case Dimension.SYM_L:
                return Dimension.L;
            case Dimension.SYM_A:
                return Dimension.A;
        }
        throw new Error("Unknown dimension symbol: " + dimensionSymbol);
    }
}