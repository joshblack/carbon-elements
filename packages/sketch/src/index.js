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

const icon = meta[0];

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
          <View key={key} style={{ padding: 16 }}>
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
          <View key={key} style={{ padding: 16 }}>
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

      <View
        name="Icons"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'row',
          flexDirection: 'row',
          width: 500,
        }}>
        {meta.slice(0, 50).map(icon => (
          <Icon key={icon.outputOptions.moduleName} {...icon} />
        ))}
      </View>
    </View>,
    context.document.currentPage()
  );
};
