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

import { Character } from "../util/Character";
import { isNumber, isUndefined } from "../util/NumberUtil";

// import java.io.Serializable;

/**
 * Implements extended-precision floating-point numbers 
 * which maintain 106 bits (approximately 30 decimal digits) of precision. 
 * <p>
 * A DoubleDouble uses a representation containing two double-precision values.
 * A number x is represented as a pair of doubles, x.hi and x.lo,
 * such that the number represented by x is x.hi + x.lo, where
 * <pre>
 *    |x.lo| &lt;= 0.5*ulp(x.hi)
 * </pre>
 * and ulp(y) means "unit in the last place of y".  
 * The basic arithmetic operations are implemented using 
 * convenient properties of IEEE-754 floating-point arithmetic.
 * <p>
 * The range of values which can be represented is the same as in IEEE-754.  
 * The precision of the representable numbers 
 * is twice as great as IEEE-754 double precision.
 * <p>
 * The correctness of the arithmetic algorithms relies on operations
 * being performed with standard IEEE-754 double precision and rounding.
 * This is the Java standard arithmetic model, but for performance reasons 
 * Java implementations are not
 * constrained to using this standard by default.  
 * Some processors (notably the Intel Pentium architecture) perform
 * floating point operations in (non-IEEE-754-standard) extended-precision.
 * A JVM implementation may choose to use the non-standard extended-precision
 * as its default arithmetic mode.
 * To prevent this from happening, this code uses the
 * Java <tt>strictfp</tt> modifier, 
 * which forces all operations to take place in the standard IEEE-754 rounding model. 
 * <p>
 * The API provides both a set of value-oriented operations 
 * and a set of mutating operations.
 * Value-oriented operations treat DoubleDouble values as 
 * immutable; operations on them return new objects carrying the result
 * of the operation.  This provides a simple and safe semantics for
 * writing DoubleDouble expressions.  However, there is a performance
 * penalty for the object allocations required.
 * The mutable interface updates object values in-place.
 * It provides optimum memory performance, but requires
 * care to ensure that aliasing errors are not created
 * and constant values are not changed.
 * <p>
 * For example, the following code example constructs three DD instances:
 * two to hold the input values and one to hold the result of the addition.
 * <pre>
 *     DD a = new DD(2.0);
 *     DD b = new DD(3.0);
 *     DD c = a.add(b);
 * </pre>
 * In contrast, the following approach uses only one object:
 * <pre>
 *     DD a = new DD(2.0);
 *     a.selfAdd(3.0);
 * </pre>
 * <p>
 * This implementation uses algorithms originally designed variously by 
 * Knuth, Kahan, Dekker, and Linnainmaa.  
 * Douglas Priest developed the first C implementation of these techniques. 
 * Other more recent C++ implementation are due to Keith M. Briggs and David Bailey et al.
 * 
 * <h3>References</h3>
 * <ul>
 * <li>Priest, D., <i>Algorithms for Arbitrary Precision Floating Point Arithmetic</i>,
 * in P. Kornerup and D. Matula, Eds., Proc. 10th Symposium on Computer Arithmetic, 
 * IEEE Computer Society Press, Los Alamitos, Calif., 1991.
 * <li>Yozo Hida, Xiaoye S. Li and David H. Bailey, 
 * <i>Quad-Double Arithmetic: Algorithms, Implementation, and Application</i>, 
 * manuscript, Oct 2000; Lawrence Berkeley National Laboratory Report BNL-46996.
 * <li>David Bailey, <i>High Precision Software Directory</i>; 
 * <tt>http://crd.lbl.gov/~dhbailey/mpdist/index.html</tt>
 * </ul>
 * 
 * 
 * @author Martin Davis
 *
 */
export class DD {
    /**
     * The value nearest to the constant Pi.
     */
    public static PI: DD = new DD(
        3.141592653589793116e+00,
        1.224646799147353207e-16);

    /**
     * The value nearest to the constant 2 * Pi.
     */
    public static TWO_PI: DD = new DD(
        6.283185307179586232e+00,
        2.449293598294706414e-16);

    /**
     * The value nearest to the constant Pi / 2.
     */
    public static PI_2: DD = new DD(
        1.570796326794896558e+00,
        6.123233995736766036e-17);

    /**
     * The value nearest to the constant e (the natural logarithm base). 
     */
    public static E: DD = new DD(
        2.718281828459045091e+00,
        1.445646891729250158e-16);

    /**
     * A value representing the result of an operation which does not return a valid number.
     */
    public static NaN: DD = new DD(NaN, NaN);

    /**
     * The smallest representable relative difference between two {link @ DoubleDouble} values
     */
    public static EPS: number = 1.23259516440783e-32;  /* = 2^-106 */

    private static createNaN(): DD {
        return new DD(NaN, NaN);
    }

    /**
     * Converts the string argument to a DoubleDouble number.
     * 
     * @param str a string containing a representation of a numeric value
     * @return the extended precision version of the value
     * @throws NumberFormatException if <tt>s</tt> is not a valid representation of a number
     */
    public static valueOf(str: string | number): DD {
        if (isNumber(str)) {
            return new DD(str);
        }
        return DD.parse((str as string));
    }

    /**
     * Converts the <tt>double</tt> argument to a DoubleDouble number.
     * 
     * @param x a numeric value
     * @return the extended precision version of the value
     */
    // public static valueOf(double x): DD { return new DD(x); }

    /**
     * The value to split a double-precision value on during multiplication
     */
    // private static SPLIT: number = 134217729.0D; // 2^27+1, for IEEE double
    private static SPLIT: number = Math.pow(2, 27) + 1;// 2^27+1, for IEEE double

    /**
     * The high-order component of the double-double precision value.
     */
    private hi: number = 0.0;

    /**
     * The low-order component of the double-double precision value.
     */
    private lo: number = 0.0;

    public constructor(hi?: number | string | DD, lo?: number) {
        if (isUndefined(hi)) {
            this.init(0.0);
            return;
        }
        if (hi instanceof DD) {
            this.init(hi);
            return;
        }
        if (isNumber(hi) && isUndefined(lo)) {
            this.init((hi as number));
            return;
        }
        if (typeof hi === 'string') {
            this.init(DD.parse(hi));
            return;
        }
        this.init((hi as number), lo);
    }

    /**
     * Creates a new DoubleDouble with value 0.0.
     */
    // public DD() {
    //     init(0.0);
    // }

    /**
     * Creates a new DoubleDouble with value x.
     * 
     * @param x the value to initialize
     */
    // public DD(double x) {
    //     init(x);
    // }

    /**
     * Creates a new DoubleDouble with value (hi, lo).
     * 
     * @param hi the high-order component 
     * @param lo the high-order component 
     */
    // public DD(double hi, double lo) {
    //     init(hi, lo);
    // }

    /**
     * Creates a new DoubleDouble with value equal to the argument.
     * 
     * @param dd the value to initialize
     */
    // public DD(DD dd) {
    //     init(dd);
    // }

    /**
     * Creates a new DoubleDouble with value equal to the argument.
     * 
     * @param str the value to initialize by
     * @throws NumberFormatException if <tt>str</tt> is not a valid representation of a number
     */
    // public DD(String str) {
    //     this(parse(str));
    // }

    /**
     * Creates a new DoubleDouble with the value of the argument.
     * 
     * @param dd the DoubleDouble value to copy
     * @return a copy of the input value
     */
    public static copy(dd: DD): DD {
        return new DD(dd);
    }

    /**
     * Creates and returns a copy of this value.
     * 
     * @return a copy of this value
     */
    public clone(): Object {
        return new DD(this);
        // try {
        //     return super.clone();
        // }
        // catch (CloneNotSupportedException ex) {
        //     // should never reach here
        //     return null;
        // }
    }

    /**
     * init
     */
    public init(hi: number | DD, lo?: number) {
        if (hi instanceof DD) {
            const dd = hi;
            this.hi = dd.hi;
            this.lo = dd.lo;
            return;
        }
        if (isNumber(hi) && isUndefined(lo)) {
            this.hi = hi;
            this.lo = 0.0;
            return;
        }
        if (typeof lo === 'number') {
            this.hi = hi;
            this.lo = lo;
        }

    }

    //   private final void init(double x)
    // {
    //     this.hi = x;
    //     this.lo = 0.0;
    // }

    //   private final void init(double hi, double lo)
    // {
    //     this.hi = hi;
    //     this.lo = lo;
    // }

    //   private final void init(DD dd)
    // {
    //     hi = dd.hi;
    //     lo = dd.lo;
    // }

    /*
    double getHighComponent() { return hi; }
    
    double getLowComponent() { return lo; }
    */

    // Testing only - should not be public
    /*
    public void RENORM()
    {
      double s = hi + lo;
      double err = lo - (s - hi);
      hi = s;
      lo = err;
    }
    */

    /**
     * Set the value for the DD object. This method supports the mutating
     * operations concept described in the class documentation (see above).
     * @param value a DD instance supplying an extended-precision value.
     * @return a self-reference to the DD instance.
     */
    public setValue(value: DD | number): DD {
        this.init(value);
        return this;
    }

    /**
     * Set the value for the DD object. This method supports the mutating
     * operations concept described in the class documentation (see above).
     * @param value a floating point value to be stored in the instance.
     * @return a self-reference to the DD instance.
     */
    // public DD setValue(double value) {
    //     init(value);
    //     return this;
    // }


    /**
     * Returns a new DoubleDouble whose value is <tt>(this + y)</tt>.
     * 
     * @param y the addend
     * @return <tt>(this + y)</tt>
     */
    public add(y: DD | number): DD {
        if (isNumber(y)) {
            return DD.copy(this).selfAdd(y);
        }
        return DD.copy(this).selfAdd(y);
    }

    /**
     * Returns a new DoubleDouble whose value is <tt>(this + y)</tt>.
     * 
     * @param y the addend
     * @return <tt>(this + y)</tt>
     */
    // public final DD add(double y) {
    //     return DD.copy(this).selfAdd(y);
    // }

    public selfAdd(yhi: DD | number, ylo?: number): DD {
        if (yhi instanceof DD) {
            this.hi = yhi.hi;
            this.lo = yhi.lo;
            return this;
        }
        if (isNumber(yhi) && isUndefined(ylo)) {
            const y = yhi;
            let H, h, S, s, e, f;
            S = this.hi + y;
            e = S - this.hi;
            s = S - e;
            s = (y - e) + (this.hi - s);
            f = s + this.lo;
            H = S + f;
            h = f + (S - H);
            this.hi = H + h;
            this.lo = h + (H - this.hi);
            return this;
        }
        let H, h, T, t, S, s, e, f;
        S = this.hi + yhi;
        T = this.lo + (ylo as number);
        e = S - this.hi;
        f = T - this.lo;
        s = S - e;
        t = T - f;
        s = (yhi - e) + (this.hi - s);
        t = ((ylo as number) - f) + (this.lo - t);
        e = s + T; H = S + e; h = e + (S - H); e = t + h;

        const zhi = H + e;
        const zlo = e + (H - zhi);
        this.hi = zhi;
        this.lo = zlo;
        return this;

    }
    /**
     * Adds the argument to the value of <tt>this</tt>.
     * To prevent altering constants, 
     * this method <b>must only</b> be used on values known to 
     * be newly created. 
     * 
     * @param y the addend
     * @return this object, increased by y
     */
    // public final DD selfAdd(DD y) {
    //     return selfAdd(y.hi, y.lo);
    // }

    /**
     * Adds the argument to the value of <tt>this</tt>.
     * To prevent altering constants, 
     * this method <b>must only</b> be used on values known to 
     * be newly created. 
     * 
     * @param y the addend
     * @return this object, increased by y
     */
    // public final DD selfAdd(double y) {
    // double H, h, S, s, e, f;
    //     S = hi + y;
    //     e = S - hi;
    //     s = S - e;
    //     s = (y - e) + (hi - s);
    //     f = s + lo;
    //     H = S + f;
    //     h = f + (S - H);
    //     hi = H + h;
    //     lo = h + (H - hi);
    //     return this;
    //     // return selfAdd(y, 0.0);
    // }

    // private final DD selfAdd(double yhi, double ylo) {
    // double H, h, T, t, S, s, e, f;
    //     S = hi + yhi;
    //     T = lo + ylo;
    //     e = S - hi;
    //     f = T - lo;
    //     s = S - e;
    //     t = T - f;
    //     s = (yhi - e) + (hi - s);
    //     t = (ylo - f) + (lo - t);
    //     e = s + T; H = S + e; h = e + (S - H); e = t + h;

    // double zhi = H + e;
    // double zlo = e + (H - zhi);
    //     hi = zhi;
    //     lo = zlo;
    //     return this;
    // }

    /**
     * Computes a new DoubleDouble object whose value is <tt>(this - y)</tt>.
     * 
     * @param y the subtrahend
     * @return <tt>(this - y)</tt>
     */
    public subtract(y: DD | number): DD {
        if (isNumber(y)) {
            return this.add(-y);
        }
        const dd = (y as DD);
        return this.add(dd.negate());
    }

    /**
     * Computes a new DoubleDouble object whose value is <tt>(this - y)</tt>.
     * 
     * @param y the subtrahend
     * @return <tt>(this - y)</tt>
     */
    // public final DD subtract(double y) {
    //     return add(-y);
    // }


    /**
     * Subtracts the argument from the value of <tt>this</tt>.
     * To prevent altering constants, 
     * this method <b>must only</b> be used on values known to 
     * be newly created. 
     * 
     * @param y the addend
     * @return this object, decreased by y
     */
    public selfSubtract(y: DD | number): DD {
        if (isNumber(y)) {
            if (this.isNaN()) return this;
            return this.selfAdd(-y, 0.0);
        }
        if (this.isNaN()) return this;
        const dd = (y as DD);
        return this.selfAdd(-dd.hi, -dd.lo);
    }

    /**
     * Subtracts the argument from the value of <tt>this</tt>.
     * To prevent altering constants, 
     * this method <b>must only</b> be used on values known to 
     * be newly created. 
     * 
     * @param y the addend
     * @return this object, decreased by y
     */
    // public final DD selfSubtract(double y) {
    //     if (isNaN()) return this;
    //     return selfAdd(-y, 0.0);
    // }

    /**
     * Returns a new DoubleDouble whose value is <tt>-this</tt>.
     * 
     * @return <tt>-this</tt>
     */
    public negate(): DD {
        if (this.isNaN()) return this;
        return new DD(-this.hi, -this.lo);
    }

    /**
     * Returns a new DoubleDouble whose value is <tt>(this * y)</tt>.
     * 
     * @param y the multiplicand
     * @return <tt>(this * y)</tt>
     */
    public multiply(y: DD | number): DD {
        if (isNumber(y)) {
            if (Number.isNaN(y)) return DD.createNaN();
            return DD.copy(this).selfMultiply(y, 0.0);
        }
        const dd = (y as DD);
        if (dd.isNaN()) return DD.createNaN();
        return DD.copy(this).selfMultiply(dd);
    }

    /**
     * Returns a new DoubleDouble whose value is <tt>(this * y)</tt>.
     * 
     * @param y the multiplicand
     * @return <tt>(this * y)</tt>
     */
    // public final DD multiply(double y) {
    //     if (Double.isNaN(y)) return createNaN();
    //     return copy(this).selfMultiply(y, 0.0);
    // }

    public selfMultiply(dhi: DD | number, dlo?: number): DD {
        let yhi, ylo;
        if (dhi instanceof DD) {
            yhi = dhi.hi;
            ylo = dhi.lo;
        } else if (isNumber(dhi) && isUndefined(dlo)) {
            yhi = dhi;
            ylo = 0.0;
        } else {
            yhi = dhi;
            ylo = dlo;
        }
        let hx, tx, hy, ty, C, c;
        C = DD.SPLIT * this.hi; hx = C - this.hi; c = DD.SPLIT * yhi;
        hx = C - hx; tx = this.hi - hx; hy = c - yhi;
        C = this.hi * yhi; hy = c - hy; ty = yhi - hy;
        c = ((((hx * hy - C) + hx * ty) + tx * hy) + tx * ty) + (this.hi * ylo + this.lo * yhi);
        const zhi = C + c; hx = C - zhi;
        const zlo = c + hx;
        this.hi = zhi;
        this.lo = zlo;
        return this;
    }

    /**
     * Multiplies this object by the argument, returning <tt>this</tt>.
     * To prevent altering constants, 
     * this method <b>must only</b> be used on values known to 
     * be newly created. 
     * 
     * @param y the value to multiply by
     * @return this object, multiplied by y
     */
    // public final DD selfMultiply(DD y) {
    //     return selfMultiply(y.hi, y.lo);
    // }

    /**
     * Multiplies this object by the argument, returning <tt>this</tt>.
     * To prevent altering constants, 
     * this method <b>must only</b> be used on values known to 
     * be newly created. 
     * 
     * @param y the value to multiply by
     * @return this object, multiplied by y
     */
    // public final DD selfMultiply(double y) {
    //     return selfMultiply(y, 0.0);
    // }

    // private final DD selfMultiply(double yhi, double ylo) {
    // double hx, tx, hy, ty, C, c;
    //     C = SPLIT * hi; hx = C - hi; c = SPLIT * yhi;
    //     hx = C - hx; tx = hi - hx; hy = c - yhi;
    //     C = hi * yhi; hy = c - hy; ty = yhi - hy;
    //     c = ((((hx * hy - C) + hx * ty) + tx * hy) + tx * ty) + (hi * ylo + lo * yhi);
    // double zhi = C + c; hx = C - zhi; 
    // double zlo = c + hx;
    //     hi = zhi;
    //     lo = zlo;
    //     return this;
    // }

    /**
     * Computes a new DoubleDouble whose value is <tt>(this / y)</tt>.
     * 
     * @param y the divisor
     * @return a new object with the value <tt>(this / y)</tt>
     */
    public divide(y: DD | number): DD {
        if (y instanceof DD) {
            let hc, tc, hy, ty, C, c, U, u;
            C = this.hi / y.hi; c = DD.SPLIT * C; hc = c - C; u = DD.SPLIT * y.hi; hc = c - hc;
            tc = C - hc; hy = u - y.hi; U = C * y.hi; hy = u - hy; ty = y.hi - hy;
            u = (((hc * hy - U) + hc * ty) + tc * hy) + tc * ty;
            c = ((((this.hi - U) - u) + this.lo) - C * y.lo) / y.hi;
            u = C + c;

            const zhi = u;
            const zlo = (C - u) + c;
            return new DD(zhi, zlo);
        }
        if (Number.isNaN(y)) return DD.createNaN();
        return DD.copy(this).selfDivide(y, 0.0);
    }

    public selfDivide(dhi: DD | number, dlo?: number): DD {
        let yhi, ylo;
        if (dhi instanceof DD) {
            yhi = dhi.hi;
            ylo = dhi.lo;
        } else if (isNumber(dhi) && isUndefined(dlo)) {
            yhi = dhi;
            ylo = 0.0;
        } else {
            yhi = dhi;
            ylo = dlo;
        }
        let hc, tc, hy, ty, C, c, U, u;
        C = this.hi / yhi; c = DD.SPLIT * C; hc = c - C; u = DD.SPLIT * yhi; hc = c - hc;
        tc = C - hc; hy = u - yhi; U = C * yhi; hy = u - hy; ty = yhi - hy;
        u = (((hc * hy - U) + hc * ty) + tc * hy) + tc * ty;
        c = ((((this.hi - U) - u) + this.lo) - C * ylo) / yhi;
        u = C + c;

        this.hi = u;
        this.lo = (C - u) + c;
        return this;
    }

    /**
     * Computes a new DoubleDouble whose value is <tt>(this / y)</tt>.
     * 
     * @param y the divisor
     * @return a new object with the value <tt>(this / y)</tt>
     */
    // public final DD divide(double y) {
    //     if (Double.isNaN(y)) return createNaN();
    //     return copy(this).selfDivide(y, 0.0);
    // }

    /**
     * Divides this object by the argument, returning <tt>this</tt>.
     * To prevent altering constants, 
     * this method <b>must only</b> be used on values known to 
     * be newly created. 
     * 
     * @param y the value to divide by
     * @return this object, divided by y
     */
    // public final DD selfDivide(DD y) {
    //     return selfDivide(y.hi, y.lo);
    // }

    /**
     * Divides this object by the argument, returning <tt>this</tt>.
     * To prevent altering constants, 
     * this method <b>must only</b> be used on values known to 
     * be newly created. 
     * 
     * @param y the value to divide by
     * @return this object, divided by y
     */
    // public final DD selfDivide(double y) {
    //     return selfDivide(y, 0.0);
    // }

    // private final DD selfDivide(double yhi, double ylo) {
    // double hc, tc, hy, ty, C, c, U, u;
    //     C = hi / yhi; c = SPLIT * C; hc = c - C; u = SPLIT * yhi; hc = c - hc;
    //     tc = C - hc; hy = u - yhi; U = C * yhi; hy = u - hy; ty = yhi - hy;
    //     u = (((hc * hy - U) + hc * ty) + tc * hy) + tc * ty;
    //     c = ((((hi - U) - u) + lo) - C * ylo) / yhi;
    //     u = C + c;

    //     hi = u;
    //     lo = (C - u) + c;
    //     return this;
    // }

    /**
     * Returns a DoubleDouble whose value is  <tt>1 / this</tt>.
     * 
     * @return the reciprocal of this value
     */
    public reciprocal(): DD {
        let hc, tc, hy, ty, C, c, U, u;
        C = 1.0 / this.hi;
        c = DD.SPLIT * C;
        hc = c - C;
        u = DD.SPLIT * this.hi;
        hc = c - hc; tc = C - hc; hy = u - this.hi; U = C * this.hi; hy = u - hy; ty = this.hi - hy;
        u = (((hc * hy - U) + hc * ty) + tc * hy) + tc * ty;
        c = ((((1.0 - U) - u)) - C * this.lo) / this.hi;

        const zhi = C + c;
        const zlo = (C - zhi) + c;
        return new DD(zhi, zlo);
    }

    /**
     * Returns the largest (closest to positive infinity) 
     * value that is not greater than the argument 
     * and is equal to a mathematical integer.
     * Special cases:
     * <ul>
     * <li>If this value is NaN, returns NaN.
     * </ul>
     * 
     * @return the largest (closest to positive infinity) 
     * value that is not greater than the argument 
     * and is equal to a mathematical integer.
     */
    public floor(): DD {
        if (this.isNaN()) return DD.createNaN();
        let fhi = Math.floor(this.hi);
        let flo = 0.0;
        // Hi is already integral.  Floor the low word
        if (fhi == this.hi) {
            flo = Math.floor(this.lo);
        }
        // do we need to renormalize here?    
        return new DD(fhi, flo);
    }

    /**
     * Returns the smallest (closest to negative infinity) value 
     * that is not less than the argument and is equal to a mathematical integer. 
     * Special cases:
     * <ul>
     * <li>If this value is NaN, returns NaN.
     * </ul>
     * 
     * @return the smallest (closest to negative infinity) value 
     * that is not less than the argument and is equal to a mathematical integer. 
     */
    public ceil(): DD {
        if (this.isNaN()) return DD.createNaN();
        let fhi = Math.ceil(this.hi);
        let flo = 0.0;
        // Hi is already integral.  Ceil the low word
        if (fhi == this.hi) {
            flo = Math.ceil(this.lo);
            // do we need to renormalize here?
        }
        return new DD(fhi, flo);
    }

    /**
     * Returns an integer indicating the sign of this value.
     * <ul>
     * <li>if this value is &gt; 0, returns 1
     * <li>if this value is &lt; 0, returns -1
     * <li>if this value is = 0, returns 0
     * <li>if this value is NaN, returns 0
     * </ul>
     * 
     * @return an integer indicating the sign of this value
     */
    public signum(): number {
        const { hi, lo } = this;
        if (hi > 0) return 1;
        if (hi < 0) return -1;
        if (lo > 0) return 1;
        if (lo < 0) return -1;
        return 0;
    }

    /**
     * Rounds this value to the nearest integer.
     * The value is rounded to an integer by adding 1/2 and taking the floor of the result.
     * Special cases:
     * <ul>
     * <li>If this value is NaN, returns NaN.
     * </ul>
     *
     * @return this value rounded to the nearest integer
     */
    public rint(): DD {
        if (this.isNaN()) return this;
        // may not be 100% correct
        const plus5 = this.add(0.5);
        return plus5.floor();
    }

    /**
     * Returns the integer which is largest in absolute value and not further
     * from zero than this value.  
     * Special cases:
     * <ul>
     * <li>If this value is NaN, returns NaN.
     * </ul>
     *  
     * @return the integer which is largest in absolute value and not further from zero than this value
     */
    public trunc(): DD {
        if (this.isNaN()) return DD.createNaN();
        if (this.isPositive())
            return this.floor();
        else
            return this.ceil();
    }

    /**
     * Returns the absolute value of this value.
     * Special cases:
     * <ul>
     * <li>If this value is NaN, it is returned.
     * </ul>
     * 
     * @return the absolute value of this value
     */
    public abs(): DD {
        if (this.isNaN()) return DD.createNaN();
        if (this.isNegative())
            return this.negate();
        return new DD(this);
    }

    /**
     * Computes the square of this value.
     * 
     * @return the square of this value.
     */
    public sqr(): DD {
        return this.multiply(this);
    }

    /**
     * Squares this object.
     * To prevent altering constants, 
     * this method <b>must only</b> be used on values known to 
     * be newly created. 
     * 
     * @return the square of this value.
     */
    public selfSqr(): DD {
        return this.selfMultiply(this);
    }

    /**
     * Computes the square of this value.
     * 
     * @return the square of this value.
     */
    public static sqr(x: number): DD {
        return DD.valueOf(x).selfMultiply(x);
    }

    /**
     * Computes the positive square root of this value.
     * If the number is NaN or negative, NaN is returned.
     * 
     * @return the positive square root of this number. 
     * If the argument is NaN or less than zero, the result is NaN.
     */
    public sqrt(): DD {
        /* Strategy:  Use Karp's trick:  if x is an approximation
        to sqrt(a), then
           sqrt(a) = a*x + [a - (a*x)^2] * x / 2   (approx)
        The approximation is accurate to twice the accuracy of x.
        Also, the multiplication (a*x) and [-]*x can be done with
        only half the precision.
     */

        if (this.isZero())
            return DD.valueOf(0.0);

        if (this.isNegative()) {
            return DD.createNaN();
        }

        let x = 1.0 / Math.sqrt(this.hi);
        let ax = this.hi * x;

        const axdd = DD.valueOf(ax);
        const diffSq = this.subtract(axdd.sqr());
        const d2 = diffSq.hi * (x * 0.5);

        return axdd.add(d2);
    }

    public static sqrt(x: number): DD {
        return DD.valueOf(x).sqrt();
    }

    /**
     * Computes the value of this number raised to an integral power.
     * Follows semantics of Java Math.pow as closely as possible.
     * 
     * @param exp the integer exponent
     * @return x raised to the integral power exp
     */
    public pow(exp: number): DD {
        if (exp == 0.0)
            return DD.valueOf(1.0);

        let r = new DD(this);
        let s = DD.valueOf(1.0);
        let n = Math.abs(exp);

        if (n > 1) {
            /* Use binary exponentiation */
            while (n > 0) {
                if (n % 2 == 1) {
                    s.selfMultiply(r);
                }
                n /= 2;
                if (n > 0)
                    r = r.sqr();
            }
        } else {
            s = r;
        }

        /* Compute the reciprocal if n is negative. */
        if (exp < 0)
            return s.reciprocal();
        return s;
    }

    /**
     * Computes the determinant of the 2x2 matrix with the given entries.
     * 
     * @param x1 a double value
     * @param y1 a double value
     * @param x2 a double value
     * @param y2 a double value
     * @return the determinant of the values
     */
    // public static DD determinant(double x1, double y1, double x2, double y2) {
    //     return determinant(valueOf(x1), valueOf(y1), valueOf(x2), valueOf(y2));
    // }

    /**
     * Computes the determinant of the 2x2 matrix with the given entries.
     * 
     * @param x1 a matrix entry
     * @param y1 a matrix entry
     * @param x2 a matrix entry
     * @param y2 a matrix entry
     * @return the determinant of the matrix of values
     */
    public static determinant(x1: DD | number, y1: DD | number, x2: DD | number, y2: DD | number): DD {
        if (isNumber(x1) && isNumber(y1) && isNumber(x2) && isNumber(y2)) {
            x1 = DD.valueOf((x1 as number));
            y1 = DD.valueOf(y1 as number);
            x2 = DD.valueOf(x2 as number);
            y2 = DD.valueOf(y2 as number);
        }
        const det = (x1 as DD).multiply(y2).selfSubtract((y1 as DD).multiply(x2));
        return det;
    }

    /*------------------------------------------------------------
     *   Ordering Functions
     *------------------------------------------------------------
     */

    /**
     * Computes the minimum of this and another DD number.
     * 
     * @param x a DD number
     * @return the minimum of the two numbers
     */
    public min(x: DD): DD {
        if (this.le(x)) {
            return this;
        }
        else {
            return x;
        }
    }

    /**
     * Computes the maximum of this and another DD number.
     * 
     * @param x a DD number
     * @return the maximum of the two numbers
     */
    public max(x: DD): DD {
        if (this.ge(x)) {
            return this;
        }
        else {
            return x;
        }
    }

    /*------------------------------------------------------------
     *   Conversion Functions
     *------------------------------------------------------------
     */

    /**
     * Converts this value to the nearest double-precision number.
     * 
     * @return the nearest double-precision number to this value
     */
    public doubleValue(): number {
        return this.hi + this.lo;
    }

    /**
     * Converts this value to the nearest integer.
     * 
     * @return the nearest integer to this value
     */
    public intValue(): number {
        return parseInt((this.hi + ''));
    }

    /*------------------------------------------------------------
     *   Predicates
     *------------------------------------------------------------
     */

    /**
     * Tests whether this value is equal to 0.
     * 
     * @return true if this value is equal to 0
     */
    public isZero(): boolean {
        return this.hi == 0.0 && this.lo == 0.0;
    }

    /**
     * Tests whether this value is less than 0.
     * 
     * @return true if this value is less than 0
     */
    public isNegative(): boolean {
        return this.hi < 0.0 || (this.hi == 0.0 && this.lo < 0.0);
    }

    /**
     * Tests whether this value is greater than 0.
     * 
     * @return true if this value is greater than 0
     */
    public isPositive(): boolean {
        return this.hi > 0.0 || (this.hi == 0.0 && this.lo > 0.0);
    }

    /**
     * Tests whether this value is NaN.
     * 
     * @return true if this value is NaN
     */
    public isNaN(): boolean { return Number.isNaN(this.hi); }

    /**
     * Tests whether this value is equal to another <tt>DoubleDouble</tt> value.
     * 
     * @param y a DoubleDouble value
     * @return true if this value = y
     */
    public equals(y: DD): boolean {
        return this.hi == y.hi && this.lo == y.lo;
    }

    /**
     * Tests whether this value is greater than another <tt>DoubleDouble</tt> value.
     * @param y a DoubleDouble value
     * @return true if this value &gt; y
     */
    public gt(y: DD): boolean {
        return (this.hi > y.hi) || (this.hi == y.hi && this.lo > y.lo);
    }
    /**
     * Tests whether this value is greater than or equals to another <tt>DoubleDouble</tt> value.
     * @param y a DoubleDouble value
     * @return true if this value &gt;= y
     */
    public ge(y: DD): boolean {
        const { hi, lo } = this;
        return (hi > y.hi) || (hi == y.hi && lo >= y.lo);
    }
    /**
     * Tests whether this value is less than another <tt>DoubleDouble</tt> value.
     * @param y a DoubleDouble value
     * @return true if this value &lt; y
     */
    public lt(y: DD): boolean {
        const { hi, lo } = this;
        return (hi < y.hi) || (hi == y.hi && lo < y.lo);
    }
    /**
     * Tests whether this value is less than or equal to another <tt>DoubleDouble</tt> value.
     * @param y a DoubleDouble value
     * @return true if this value &lt;= y
     */
    public le(y: DD): boolean {
        const { hi, lo } = this;
        return (hi < y.hi) || (hi == y.hi && lo <= y.lo);
    }

    /**
     * Compares two DoubleDouble objects numerically.
     * 
     * @return -1,0 or 1 depending on whether this value is less than, equal to
     * or greater than the value of <tt>o</tt>
     */
    public compareTo(o: Object): number {
        const other = (o as DD);
        const { hi, lo } = this;
        if (hi < other.hi) return -1;
        if (hi > other.hi) return 1;
        if (lo < other.lo) return -1;
        if (lo > other.lo) return 1;
        return 0;
    }


    /*------------------------------------------------------------
     *   Output
     *------------------------------------------------------------
     */

    private static MAX_PRINT_DIGITS: number = 32;
    private static TEN: DD = DD.valueOf(10.0);
    private static ONE: DD = DD.valueOf(1.0);
    private static SCI_NOT_EXPONENT_CHAR: string = "E";
    private static SCI_NOT_ZERO: string = "0.0E0";

    /**
     * Dumps the components of this number to a string.
     * 
     * @return a string showing the components of the number
     */
    public dump(): string {
        const { hi, lo } = this;
        return "DD<" + hi + ", " + lo + ">";
    }

    /**
     * Returns a string representation of this number, in either standard or scientific notation.
     * If the magnitude of the number is in the range [ 10<sup>-3</sup>, 10<sup>8</sup> ]
     * standard notation will be used.  Otherwise, scientific notation will be used.
     * 
     * @return a string representation of this number
     */
    public toString(): string {
        const mag = DD.magnitude(this.hi);
        if (mag >= -3 && mag <= 20)
            return this.toStandardNotation();
        return this.toSciNotation();
    }

    /**
     * Returns the string representation of this value in standard notation.
     * 
     * @return the string representation in standard notation 
     */
    public toStandardNotation(): string {
        const specialStr = this.getSpecialNumberString();
        if (specialStr != null)
            return specialStr;

        const magnitude = [];
        const sigDigits = this.extractSignificantDigits(true, magnitude);
        let decimalPointPos = magnitude[0] + 1;

        let num = sigDigits;
        // add a leading 0 if the decimal point is the first char
        if (sigDigits.charAt(0) == '.') {
            num = "0" + sigDigits;
        }
        else if (decimalPointPos < 0) {
            num = "0." + DD.stringOfChar('0', -decimalPointPos) + sigDigits;
        }
        else if (sigDigits.indexOf('.') == -1) {
            // no point inserted - sig digits must be smaller than magnitude of number
            // add zeroes to end to make number the correct size
            let numZeroes = decimalPointPos - sigDigits.length;
            let zeroes = DD.stringOfChar('0', numZeroes);
            num = sigDigits + zeroes + ".0";
        }

        if (this.isNegative())
            return "-" + num;
        return num;
    }

    /**
     * Returns the string representation of this value in scientific notation.
     * 
     * @return the string representation in scientific notation 
     */
    public toSciNotation(): string {
        // special case zero, to allow as
        if (this.isZero())
            return DD.SCI_NOT_ZERO;

        const specialStr = this.getSpecialNumberString();
        if (specialStr != null)
            return specialStr;

        const magnitude = [];
        let digits = this.extractSignificantDigits(false, magnitude);
        let expStr = DD.SCI_NOT_EXPONENT_CHAR + magnitude[0];

        // should never have leading zeroes
        // MD - is this correct?  Or should we simply strip them if they are present?
        if (digits.charAt(0) == '0') {
            throw new Error("Found leading zero: " + digits);
        }

        // add decimal point
        let trailingDigits = "";
        if (digits.length > 1)
            trailingDigits = digits.substring(1);
        let digitsWithDecimal = digits.charAt(0) + "." + trailingDigits;

        if (this.isNegative())
            return "-" + digitsWithDecimal + expStr;
        return digitsWithDecimal + expStr;
    }


    /**
     * Extracts the significant digits in the decimal representation of the argument.
     * A decimal point may be optionally inserted in the string of digits
     * (as long as its position lies within the extracted digits
     * - if not, the caller must prepend or append the appropriate zeroes and decimal point).
     * 
     * @param y the number to extract ( >= 0)
     * @param decimalPointPos the position in which to insert a decimal point
     * @return the string containing the significant digits and possibly a decimal point
     */
    private extractSignificantDigits(insertDecimalPoint: boolean, magnitude: Array<number>): string {
        let y = this.abs();
        // compute *correct* magnitude of y
        let mag = DD.magnitude(y.hi);
        const scale = DD.TEN.pow(mag);
        y = y.divide(scale);

        // fix magnitude if off by one
        if (y.gt(DD.TEN)) {
            y = y.divide(DD.TEN);
            mag += 1;
        }
        else if (y.lt(DD.ONE)) {
            y = y.multiply(DD.TEN);
            mag -= 1;
        }

        let decimalPointPos = mag + 1;
        // StringBuffer buf = new StringBuffer();
        let str = '';
        const numDigits = DD.MAX_PRINT_DIGITS - 1;
        for (let i = 0; i <= numDigits; i++) {
            if (insertDecimalPoint && i == decimalPointPos) {
                // buf.append('.');
                str += '.';
            }
            const digit = parseInt(y.hi + '');
            //      System.out.println("printDump: [" + i + "] digit: " + digit + "  y: " + y.dump() + "  buf: " + buf);

            /**
             * This should never happen, due to heuristic checks on remainder below
             */
            if (digit < 0 || digit > 9) {
                //        System.out.println("digit > 10 : " + digit);
                //        throw new IllegalStateException("Internal errror: found digit = " + digit);
            }
            /**
             * If a negative remainder is encountered, simply terminate the extraction.  
             * This is robust, but maybe slightly inaccurate.
             * My current hypothesis is that negative remainders only occur for very small lo components, 
             * so the inaccuracy is tolerable
             */
            if (digit < 0) {
                break;
                // throw new IllegalStateException("Internal errror: found digit = " + digit);
            }
            let rebiasBy10 = false;
            let digitChar = '0';
            if (digit > 9) {
                // set flag to re-bias after next 10-shift
                rebiasBy10 = true;
                // output digit will end up being '9'
                // digitChar = '9';
                digitChar = '9';
            }
            else {
                // digitChar = (char)('0' + digit);
                digitChar = '0' + digit;
            }
            // buf.append(digitChar);
            str += digitChar;
            y = (y.subtract(DD.valueOf(digit))
                .multiply(DD.TEN));
            if (rebiasBy10)
                y.selfAdd(DD.TEN);

            let continueExtractingDigits = true;
            /**
             * Heuristic check: if the remaining portion of 
             * y is non-positive, assume that output is complete
             */
            //      if (y.hi <= 0.0)
            //        if (y.hi < 0.0)
            //        continueExtractingDigits = false;
            /**
             * Check if remaining digits will be 0, and if so don't output them.
             * Do this by comparing the magnitude of the remainder with the expected precision.
             */
            let remMag = DD.magnitude(y.hi);
            if (remMag < 0 && Math.abs(remMag) >= (numDigits - i))
                continueExtractingDigits = false;
            if (!continueExtractingDigits)
                break;
        }
        magnitude[0] = mag;
        return str;
    }


    /**
     * Creates a string of a given length containing the given character
     * 
     * @param ch the character to be repeated
     * @param len the len of the desired string
     * @return the string 
     */
    private static stringOfChar(ch: string, len: number): string {
        // StringBuffer buf = new StringBuffer();
        let str = '';
        for (let i = 0; i < len; i++) {
            // buf.append(ch);
            str += ch;
        }
        return str;
    }

    /**
     * Returns the string for this value if it has a known representation.
     * (E.g. NaN or 0.0)
     * 
     * @return the string for this special number
     * or null if the number is not a special number
     */
    private getSpecialNumberString(): string | null {
        if (this.isZero()) return "0.0";
        if (this.isNaN()) return "NaN ";
        return null;
    }



    /**
     * Determines the decimal magnitude of a number.
     * The magnitude is the exponent of the greatest power of 10 which is less than
     * or equal to the number.
     * 
     * @param x the number to find the magnitude of
     * @return the decimal magnitude of x
     */
    private static magnitude(x: number): number {
        const xAbs = Math.abs(x);
        const xLog10 = Math.log(xAbs) / Math.log(10);
        // let xMag = (int) Math.floor(xLog10);
        let xMag = parseInt(Math.floor(xLog10) + '');
        /**
         * Since log computation is inexact, there may be an off-by-one error
         * in the computed magnitude. 
         * Following tests that magnitude is correct, and adjusts it if not
         */
        let xApprox = Math.pow(10, xMag);
        if (xApprox * 10 <= xAbs)
            xMag += 1;

        return xMag;
    }


    /*------------------------------------------------------------
     *   Input
     *------------------------------------------------------------
     */

    /**
     * Converts a string representation of a real number into a DoubleDouble value.
     * The format accepted is similar to the standard Java real number syntax.  
     * It is defined by the following regular expression:
     * <pre>
     * [<tt>+</tt>|<tt>-</tt>] {<i>digit</i>} [ <tt>.</tt> {<i>digit</i>} ] [ ( <tt>e</tt> | <tt>E</tt> ) [<tt>+</tt>|<tt>-</tt>] {<i>digit</i>}+
     * </pre>
     * 
     * @param str the string to parse
     * @return the value of the parsed number
     * @throws NumberFormatException if <tt>str</tt> is not a valid representation of a number
     */
    public static parse(str: string): DD {
        let i = 0;
        let strlen = str.length;

        // skip leading whitespace
        while (Character.isWhitespace(str.charAt(i)))
            i++;

        // check for sign
        let isNegative = false;
        if (i < strlen) {
            let signCh = str.charAt(i);
            if (signCh == '-' || signCh == '+') {
                i++;
                if (signCh == '-') isNegative = true;
            }
        }

        // scan all digits and accumulate into an integral value
        // Keep track of the location of the decimal point (if any) to allow scaling later
        const val = new DD();

        let numDigits = 0;
        let numBeforeDec = 0;
        let exp = 0;
        let hasDecimalChar = false;
        while (true) {
            if (i >= strlen)
                break;
            let ch: string = str.charAt(i);
            i++;
            if (Character.isDigit(ch)) {
                let d = ch.charCodeAt(0) - '0'.charCodeAt(0);
                val.selfMultiply(DD.TEN);
                // MD: need to optimize this
                val.selfAdd(d);
                numDigits++;
                continue;
            }
            if (ch == '.') {
                numBeforeDec = numDigits;
                hasDecimalChar = true;
                continue;
            }
            if (ch == 'e' || ch == 'E') {
                let expStr = str.substring(i);
                // this should catch any format problems with the exponent
                try {
                    // exp = Integer.parseInt(expStr);
                    exp = parseInt(expStr);
                }
                catch (ex) {
                    throw new Error("Invalid exponent " + expStr + " in string " + str);
                }
                break;
            }
            throw new Error("Unexpected character '" + ch
                + "' at position " + i
                + " in string " + str);
        }
        let val2 = val;

        // correct number of digits before decimal sign if we don't have a decimal sign in the string
        if (!hasDecimalChar) numBeforeDec = numDigits;

        // scale the number correctly
        let numDecPlaces = numDigits - numBeforeDec - exp;
        if (numDecPlaces == 0) {
            val2 = val;
        }
        else if (numDecPlaces > 0) {
            const scale = DD.TEN.pow(numDecPlaces);
            val2 = val.divide(scale);
        }
        else if (numDecPlaces < 0) {
            const scale = DD.TEN.pow(-numDecPlaces);
            val2 = val.multiply(scale);
        }
        // apply leading sign, if any
        if (isNegative) {
            return val2.negate();
        }
        return val2;

    }
}