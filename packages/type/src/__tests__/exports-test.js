/**
 * @jest-environment node
 */

import * as CarbonType from '../';

describe('type', () => {
  it('should export type helpers', () => {
    expect(Object.keys(CarbonType)).toMatchInlineSnapshot(`
Array [
  "fontFamilies",
  "fontFamily",
  "fontWeights",
  "fontWeight",
  "print",
  "reset",
  "getTypeSize",
  "scale",
  "spacing",
  "caption01",
  "label01",
  "helperText01",
  "bodyShort01",
  "bodyLong01",
  "bodyShort02",
  "bodyLong02",
  "code01",
  "code02",
  "heading01",
  "heading02",
  "heading03",
  "productiveHeading04",
  "productiveHeading05",
  "expressiveHeading04",
  "expressiveHeading05",
  "quotation01",
  "quotation02",
  "display01",
  "display02",
  "display03",
  "display04",
]
`);
  });
});
