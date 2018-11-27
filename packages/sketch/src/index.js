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

console.log(Svg.G);

function Icon({ basename, descriptor }) {
  const { attrs, content } = descriptor;
  const { width, height, ...rest } = attrs;
  return (
    <Svg
      name="icon-name"
      width={32}
      height={32}
      stroke="#000000"
      strokeWidth={1}
      style={{ strokeWidth: 1, stroke: '#000000' }}>
      <Svg.G name="group" width={16} height={16} fill="#000000" />
    </Svg>
  );

  return (
    <Svg {...rest} name={basename} width={width} height={height}>
      <Svg.Rect
        name="Transparent Background"
        width={width}
        height={height}
        fill="#efefef"
        fillOpacity={0}
      />
      <Svg.G name="path">{content.map(renderSvg)}</Svg.G>
    </Svg>
  );
}

export default () => {
  // <View fill="#000000" width={100}>
  // {meta.slice(0, 50).map(icon => (
  // <Icon key={icon.basename} {...icon} />
  // ))}
  // </View>,
  render(
    <View name="Icons">
      <Icon {...meta[0]} />
    </View>,
    context.document.currentPage()
  );
};
