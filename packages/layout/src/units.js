/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { print, unitless } from './print';

/**
 * Default font size, Use with em() and rem() functions
 * @type {number}
 */
let baseFontSize = 16;

/**
 * Get the base font size
 * @return {number}
 */
export function getFontSize() {
  return baseFontSize;
}

/**
 * Update the base font size
 * @param {number} fontSize
 * @return {number}
 */
export function setFontSize(fontSize) {
  baseFontSize = fontSize;
  return baseFontSize;
}

/**
 * @typedef Unit
 * @interface
 * @template T, S
 * @property {'numeric' | 'percentage'} type
 * @property {(f: T => S) => S} bind
 * @property {(f: T => number) => T} lift
 * @property {Function} toString
 */

/**
 * Represent a pixel value in the browser. Supports unitless printing with the
 * `toString` method that is invoked when converting this value to a string.
 * @param {Unit | number} m
 * @return {Unit}
 */
export function px(m) {
  const print = unitless('px');
  const value = m.bind ? m.bind(v => v) : m;
  return {
    type: 'numeric',
    bind(f) {
      return f(value);
    },
    lift(f) {
      return px(f(value));
    },
    toString() {
      return print(value);
    },
  };
}

/**
 * Represent a rem value in the browser. Supports unitless printing with the
 * `toString` method that is invoked when converting this value to a string.
 * @param {Unit | number} m
 * @return {Unit}
 */
export function rem(value) {
  const print = unitless('rem');
  const normalized = value.bind ? value.bind(v => v) : value * 16;
  return {
    type: 'numeric',
    bind(f) {
      return f(value);
    },
    lift(f) {
      return rem(px(f(normalized)));
    },
    toString() {
      return print(normalized / 16);
    },
  };
}

/**
 * Represent an em value in the browser. Supports unitless printing with the
 * `toString` method that is invoked when converting this value to a string.
 * @param {Unit | number} m
 * @return {Unit}
 */
export function em(value) {
  const print = unitless('em');
  const normalized = value.bind ? value.bind(v => v) : value * 16;
  return {
    type: 'numeric',
    bind(f) {
      return f(value);
    },
    lift(f) {
      return em(px(f(normalized)));
    },
    toString() {
      return print(normalized / 16);
    },
  };
}

/**
 * Represent a % value in the browser. Supports printing with the `toString`
 * method that is invoked when converting this value to a string.
 * @param {number} value
 * @return {Unit}
 */
export function percent(value) {
  const _print = print('%');
  return {
    type: 'percentage',
    bind(f) {
      return f(value);
    },
    lift(f) {
      return percent(f(value));
    },
    toString() {
      return _print(value * 100);
    },
  };
}

/**
 * Represent a mini-unit during runtime. Will output to a `rem` when printed.
 * @param {Unit | number} m
 * @return {Unit}
 */
export function mu(value) {
  const print = unitless('rem');
  const normalized = value.bind ? value.bind(v => v) : value * 8;
  return {
    type: 'numeric',
    bind(f) {
      return f(value);
    },
    lift(f) {
      return mu(px(f(value)));
    },
    toString() {
      return print(value / 8);
    },
  };
}
