/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { print, unitless } from '../print';

test('print', () => {
  expect(print('%')(0)).toBe('0%');
  expect(print('%')(1)).toBe('1%');
});

test('unitless', () => {
  expect(unitless('px')(0)).toBe('0');
  expect(unitless('px')(1)).toBe('1px');
});
