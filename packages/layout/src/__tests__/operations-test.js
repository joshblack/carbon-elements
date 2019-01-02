/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  add,
  subtract,
  divide,
  multiply,
  group,
  expression,
  calc,
} from '../operations';
import { mu, percent, px, rem } from '../units';

describe('operations', () => {
  describe('group', () => {
    it('should create a group and forward along its value', () => {
      expect(group(1).toString()).toBe('(1)');
    });
  });

  describe('expression', () => {
    it('should print an expression with the given infix operator', () => {
      expect(expression('+', '1', '2').toString()).toBe('1 + 2');
    });

    it('should print an expression with nested types', () => {
      expect(expression('+', percent(1), rem(1)).toString()).toBe(
        '100% + 1rem'
      );
    });

    it('should print an expression with nested operations', () => {
      expect(
        expression('+', percent(1), group(add(percent(0.5), rem(1)))).toString()
      ).toBe('100% + (50% + 1rem)');
    });
  });

  describe('calc', () => {
    it('should wrap an expression', () => {
      expect(calc(expression('+', percent(1), rem(1))).toString()).toBe(
        'calc(100% + 1rem)'
      );
    });

    it('should forward along unit values', () => {
      expect(calc(rem(1)).toString()).toBe('1rem');
    });
  });

  describe('add', () => {
    it('should add values of the same type', () => {
      expect(add(px(16), px(16)).toString()).toBe('32px');
      expect(add(px(16), px(16), px(16)).toString()).toBe('48px');
    });

    it('should create an expression with values of different types', () => {
      expect(add(percent(0.5), px(16)).toString()).toBe('50% + 16px');
    });
  });

  describe('subtract', () => {
    it('should subtract values of the same type', () => {
      expect(subtract(px(32), px(16)).toString()).toBe('16px');
      expect(subtract(px(32), px(16), px(8)).toString()).toBe('8px');
    });

    it('should create an expression with values of different types', () => {
      expect(subtract(percent(0.5), px(16)).toString()).toBe('50% - 16px');
    });
  });

  describe('multiply', () => {
    it('should multiply values of all units', () => {
      expect(multiply(px(16), percent(0.5)).toString()).toBe('8px');
    });
  });

  describe('divide', () => {
    it('should multiply values of all units', () => {
      expect(divide(px(16), percent(1)).toString()).toBe('16px');
    });
  });
});
