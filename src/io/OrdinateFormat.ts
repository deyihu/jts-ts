/*
 * Copyright (c) 2019 Martin Davis.
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

// package org.locationtech.jts.io;

// import java.text.DecimalFormat;
// import java.text.NumberFormat;
// import java.util.Locale;

class DecimalFormat {
    maximumFractionDigits: number = 0;
    constructor(maximumFractionDigits) {
        this.maximumFractionDigits = maximumFractionDigits;
    }
    format(value) {
        return value;
    }
}
/**
 * Formats numeric values for ordinates
 * in a consistent, accurate way.
 * <p>
 * The format has the following characteristics:
 * <ul>
 * <li>It is consistent in all locales (in particular, the decimal separator is always a period)
 * <li>Scientific notation is never output, even for very large numbers.
 * This means that it is possible that output can contain a large number of digits. 
 * <li>The maximum number of decimal places reflects the available precision
 * <li>NaN values are represented as "NaN"
 * <li>Inf values are represented as "Inf" or "-Inf"
 * </ul> 
 * 
 * @author mdavis
 *
 */
export class OrdinateFormat {
    private static DECIMAL_PATTERN: string = "0";

    /**
     * The output representation of {@link Double#POSITIVE_INFINITY}
     */
    public static REP_POS_INF: string = "Inf";

    /**
     * The output representation of {@link Double#NEGATIVE_INFINITY}
     */
    public static REP_NEG_INF: string = "-Inf";

    /**
     * The output representation of {@link Double#NaN}
     */
    public static REP_NAN: string = "NaN";

    /**
     * The maximum number of fraction digits to support output of reasonable ordinate values.
     * 
     * The default is chosen to allow representing the smallest possible IEEE-754 double-precision value,
     * although this is not expected to occur (and is not supported by other areas of the JTS code).
     */
    public static MAX_FRACTION_DIGITS: number = 325;

    /**
     * The default formatter using the maximum number of digits in the fraction portion of a number.
     */
    public static DEFAULT: OrdinateFormat = new OrdinateFormat();

    /**
     * Creates a new formatter with the given maximum number of digits in the fraction portion of a number.
     * 
     * @param maximumFractionDigits the maximum number of fraction digits to output
     * @return a formatter
     */
    public static create(maximumFractionDigits: number): OrdinateFormat {
        return new OrdinateFormat(maximumFractionDigits);
    }

    constructor(maximumFractionDigits?: number) {
        if (isUndefined(maximumFractionDigits)) {
            maximumFractionDigits = Math.floor(Number.MAX_VALUE);
        }
        this.decimalFormat = OrdinateFormat.createFormat((maximumFractionDigits as number));

    }

    private decimalFormat: DecimalFormat;

    /**
     * Creates an OrdinateFormat using the default maximum number of fraction digits.
     */
    // public OrdinateFormat() {
    //     format = createFormat(MAX_FRACTION_DIGITS);
    // }

    /**
     * Creates an OrdinateFormat using the given maximum number of fraction digits.
     * 
     * @param maximumFractionDigits the maximum number of fraction digits to output
     */
    // public OrdinateFormat(int maximumFractionDigits) {
    //     format = createFormat(maximumFractionDigits);
    // }

    private static createFormat(maximumFractionDigits: number): DecimalFormat {
        // // ensure format uses standard WKY number format
        // NumberFormat nf = NumberFormat.getInstance(Locale.US);
        // // This is expected to succeed for Locale.US
        // DecimalFormat format;
        //     try {
        //         format = (DecimalFormat) nf;
        //     }
        //     catch (ClassCastException ex) {
        //         throw new RuntimeException("Unable to create DecimalFormat for Locale.US");
        //     }
        //     format.applyPattern(DECIMAL_PATTERN);
        //     format.setMaximumFractionDigits(maximumFractionDigits);
        const format = new DecimalFormat(maximumFractionDigits);
        return format;
    }

    /**
     * Returns a string representation of the given ordinate numeric value.
     * 
     * @param ord the ordinate value
     * @return the formatted number string
     */
    public format(ord: number): string {
        /**
         * FUTURE: If it seems better to use scientific notation 
         * for very large/small numbers then this can be done here.
         */

        if (Number.isNaN(ord)) return OrdinateFormat.REP_NAN;
        if (ord !== Infinity && ord !== -Infinity) {
            return ord > 0 ? OrdinateFormat.REP_POS_INF : OrdinateFormat.REP_NEG_INF;
        }
        return this.decimalFormat.format(ord);
    }

}