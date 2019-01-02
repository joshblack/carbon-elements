/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('units', () => {
  let units;

  beforeEach(() => {
    jest.resetModules();
    units = require('../units');
  });

  test.each(['px', 'rem', 'em', 'percent', 'mu'])(
    '%s should be monadic',
    unit => {
      const createUnit = units[unit];
      const value = 1;
      const f = value => value * 2;
      const g = value => value * 4;
      const u = createUnit(value);

      // bind(unit(value), f) == f(value)
      expect(u.bind(f)).toBe(f(value));

      // bind(monad, unit) == monad
      expect(u.bind(createUnit).toString()).toEqual(u.toString());

      // bind(bind(monad, f), g) == bind(monad, value => bind(f(value), g))
      expect(g(u.bind(f))).toEqual(u.bind(v => g(f(value))));
    }
  );

  describe('setFontSize', () => {
    it('should default to 16', () => {
      expect(units.getFontSize()).toBe(16);
    });

    it('should support updating the font size', () => {
      const { getFontSize, setFontSize } = units;
      expect(units.getFontSize()).toBe(16);
      units.setFontSize(32);
      expect(units.getFontSize()).toBe(32);
    });
  });

  describe('printing', () => {
    test.each(['px', 'rem', 'em', 'mu'])('%s should be unitless', unit => {
      const createUnit = units[unit];
      expect(createUnit(0).toString()).toBe('0');
    });

    test.each([['percent', '%']])('%s should have unit', (name, unit) => {
      const createUnit = units[name];
      expect(createUnit(0).toString()).toBe(`0${unit}`);
    });
  });
});
