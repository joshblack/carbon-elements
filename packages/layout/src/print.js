/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Print the given unit with its value. Useful for printing CSS values like
 * `100%`
 * @param {string} unit
 * @return {(value: string) => string}
 */
export function print(unit) {
  return value => {
    return `${value}${unit}`;
  };
}

/**
 * Printer for units that are unitless when they have a zero value. Useful for
 * things like `rem` values where zero is printed as `0`
 * @param {string} unit
 * @return {(value: string) => string}
 */
export function unitless(unit) {
  const _print = print(unit);
  return value => {
    if (value === 0) {
      return '0';
    }
    return _print(value);
  };
}
