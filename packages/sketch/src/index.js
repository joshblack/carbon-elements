import * as React from 'react';
import {
  render,
  Artboard,
  Document,
  Page,
  Text,
  View,
  Image,
  makeSymbol,
  Svg,
} from 'react-sketchapp';
import { colors, tokens } from '@carbon/colors';
import meta from '@carbon/icons/meta.json';
import {
  scale,
  caption01,
  label01,
  helperText01,
  bodyShort01,
  bodyLong01,
  bodyShort02,
  bodyLong02,
  code01,
  code02,
  heading01,
  heading02,
  heading03,
  productiveHeading04,
  productiveHeading05,
  expressiveHeading04,
  expressiveHeading05,
  quotation01,
  quotation02,
  display01,
  display02,
  display03,
  display04,
} from '@carbon/type';

const type = {
  caption01,
  label01,
  helperText01,
  bodyShort01,
  bodyLong01,
  bodyShort02,
  bodyLong02,
  code01,
  code02,
  heading01,
  heading02,
  heading03,
  productiveHeading04,
  productiveHeading05,
  expressiveHeading04,
  expressiveHeading05,
  quotation01,
  quotation02,
  display01,
  display02,
  display03,
  display04,
};

function renderSvg({ elem, attrs = {}, content = [] }, i) {
  const tagName = elem[0].toUpperCase() + elem.slice(1);
  return React.createElement(
    Svg[tagName],
    {
      ...attrs,
      key: i,
      name: 'path',
    },
    ...content.map(renderSvg)
  );
}

function Icon({ basename, descriptor }) {
  const { attrs, content } = descriptor;
  const { width, height, ...rest } = attrs;
  // <Svg.Rect
  // name="Transparent Background"
  // width={width}
  // height={height}
  // fill="#efefef"
  // fillOpacity={0}
  // />
  return (
    <Svg {...rest} name={basename} width={width} height={height}>
      <Svg.G name="path">{content.map(renderSvg)}</Svg.G>
    </Svg>
  );
}

export default () => {
  render(
    <View name="Elements">
      <View name="colors" style={{ display: 'flex', flexDirection: 'row' }}>
        {Object.keys(colors).map(key => (
          <View key={key} style={{ width: 150, height: 150, padding: 16 }}>
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: colors[key],
              }}
            />
            <Text>{key}</Text>
          </View>
        ))}
      </View>
      <View
        name="Color tokens"
        style={{ display: 'flex', flexDirection: 'row' }}>
        {Object.keys(tokens).map(key => (
          <View key={key} style={{ width: 150, height: 150, padding: 16 }}>
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: tokens[key],
              }}
            />
            <Text>{key}</Text>
          </View>
        ))}
      </View>
      <View name="Type">
        {Object.keys(type)
          .filter(key => {
            if (type[key].fontSize.includes('calc')) {
              return false;
            }
            return true;
          })
          .map(key => (
            <View key={key} style={{ padding: 16 }}>
              <Text>{key}</Text>
              <Text style={convert(type[key])}>Text Sample</Text>
            </View>
          ))}
      </View>
    </View>,
    context.document.currentPage()
  );
};

function convert(token) {
  return {
    fontFamily: token.fontFamily.split(',')[0].replace(/'/g, ''),
    fontSize: parseFloat(token.fontSize, 10) * 16,
    lineHeight: token.lineHeight,
    letterSpacing: parseFloat(token.letterSpacing, 10),
  };
  return {
    ...Object.keys(token)
      .filter(key => {
        if (key.includes('@media')) {
          return false;
        }
        if (typeof token[key] === 'string' && token[key].includes('calc')) {
          return false;
        }
        return true;
      })
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: token[key],
        }),
        {}
      ),
  };
}
