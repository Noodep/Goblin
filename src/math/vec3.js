'use strict';

/**
 * Vector manipulation library
 * @version 0.40
 */
export default class Vec3 {

	/**
	 * @constructor
	 *
	 * @param {number} [x=0] - x value.
	 * @param {number} [y=0] - y value.
	 * @param {number} [z=0] - z value.
	 */
	constructor(x,y,z) {
		this._v = new Float32Array(3);
		this._v[0] = x || 0.0;
		this._v[1] = y || 0.0;
		this._v[2] = z || 0.0;
	}

	/**
	 * Copies values of vector v3 into this vector.
	 * @param {Vec3} v3 - Vector from which to copy values. 
	 * @return {Vec3} - This vector.
	 */
	copy(v3) {
		this._v[0] = v._v[0];
		this._v[1] = v._v[1];
		this._v[2] = v._v[2];
		return this;
	}

	/**
	 * Clones this vector.
	 * @return {Vec3} - The newly cloned vector.
	 */
	clone() {
		return new v3(this._v[0],this._v[1],this._v[2]);
	}

	/**
	 * Negates this vector.
	 * @return {Vec3} - Negated vector.
	 */
	negate() {
		this._v[0] = -this._v[0];
		this._v[1] = -this._v[1];
		this._v[2] = -this._v[2];
		return this;
	}

	/**
	 * Inverses this vector.
	 * @return {Vec3} - Inversed vector.
	 */
	inverse() {
		this._v[0] = 1 / this._v[0];
		this._v[1] = 1 / this._v[1];
		this._v[2] = 1 / this._v[2];
		return this;
	}

	/**
	 * Multiplies this vector by a scalar.
	 * @param {number} n - Scalar by which to multiply this vector.
	 * @return {Vec3} - Multiplied vector.
	 */
	scale(n) {
		this._v[0] *= n;
		this._v[1] *= n;
		this._v[2] *= n;
		return this;
	}

	/**
	 * Multiplies this vector by another vector.
	 * @param {Vec3} v3 - Vector by which to multiply this vector.
	 * @return {Vec3} - Multiplied vector.
	 */
	multiply(v3) {
		this._v[0] *= v3._v[0];
		this._v[1] *= v3._v[1];
		this._v[2] *= v3._v[2];
		return this;
	}

	/**
	 * Computes the cross product of this vector by another vector.
	 * @param {Vec3} v3 - Vector by which to compute the cross product.
	 * @return {Vec3} - Result of the cross product.
	 */
	cross(v3) {
		var x = this._v[0], y = this._v[1], z = this._v[2];
		this._v[0] = y * v3._v[2] - z * v3._v[1];
		this._v[1] = z * v3._v[0] - x * v3._v[2];
		this._v[2] = x * v3._v[1] - y * v3._v[0];
		return this;
	}
}
