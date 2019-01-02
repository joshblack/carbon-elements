/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { rem } from './units';

// Initial map of our breakpoints and their values
export const breakpoints = {
  sm: {
    width: rem(320),
    columns: 4,
    margin: rem(0),
  },
  md: {
    width: rem(672),
    columns: 8,
    margin: rem(16),
  },
  lg: {
    width: rem(1056),
    columns: 16,
    margin: rem(16),
  },
  xlg: {
    width: rem(1312),
    columns: 16,
    margin: rem(16),
  },
  max: {
    width: rem(1584),
    columns: 16,
    margin: rem(16),
  },
};

// export function breakpointUp(name) {
// return `@media (min-width: ${breakpoints[name].width})`;
// }

// export function breakpointDown(name) {
// return `@media (max-width: ${breakpoints[name].width})`;
// }

// export function breakpoint(...args) {
// return breakpointUp(...args);
// }
