/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Wrap a given value in a `group`. Useful for order of operations when you want
 * a certain expression to be evaluated first.
 */
export function group(value) {
  return {
    type: 'group',
    bind(f) {
      return f(value);
    },
    lift(f) {
      return group(f(value));
    },
    toString() {
      return `(${value})`;
    },
  };
}

/**
 * Wrap a given expression for the given infix operator for units a and b.
 * Useful for represention expressions on values that don't operate at compile
 * time, for example: `100% + 1rem`.
 */
export function expression(operator, a, b) {
  const value = [operator, a, b];
  return {
    type: 'expression',
    bind(f) {
      return f(value);
    },
    lift(f) {
      return expression(f(value));
    },
    toString() {
      return `${a} ${operator} ${b}`;
    },
  };
}

/**
 * Wrap a given expression in a `calc` function, or directly print a value if no
 * expression is given. Useful for expressions with mixed units, like `100% +
 * 1rem`. Will directly print values if no expression is given.
 */
export function calc(value) {
  return {
    bind(f) {
      return f(value);
    },
    lift(f) {
      return calc(f(value));
    },
    toString() {
      if (value.type === 'expression') {
        return `calc(${value})`;
      }
      return value.toString();
    },
  };
}

/**
 * Add a variable number of values together to create a single value, or an
 * expression
 */
export function add(...values) {
  return values.reduce((a, b) => {
    if (a.type === b.type) {
      return a.lift(v1 => b.bind(v2 => v1 + v2));
    }
    return expression('+', a, b);
  });
}

/**
 * Subtract a variable number of values together to create a single value, or an
 * expression
 */
export function subtract(...values) {
  return values.reduce((a, b) => {
    if (a.type === b.type) {
      return a.lift(v1 => b.bind(v2 => v1 - v2));
    }
    return expression('-', a, b);
  });
}

/**
 * Multiply the given values by each other, regardless of unit.
 */
export function multiply(...values) {
  return values.reduce((a, b) => {
    return a.lift(v1 => b.bind(v2 => v1 * v2));
  });
}

/**
 * Divide the given values by each other, regardless of unit.
 */
export function divide(...values) {
  return values.reduce((a, b) => {
    return a.lift(v1 => b.bind(v2 => v1 / v2));
  });
}
