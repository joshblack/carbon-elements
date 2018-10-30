import camelCase from 'camel-case';
import pascalCase from 'pascal-case';
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
import * as CarbonIcons from '@carbon/icons';

function convertAttrsToProps(attrs) {
  return Object.keys(attrs).reduce((acc, key) => {
    return {
      ...acc,
      [camelCase(key)]: attrs[key],
    };
  }, {});
}

function renderToSvg(node) {
  const { elem, attrs = {}, content = [], name, size } = node;
  const tagName = pascalCase(elem);
  const tag = tagName === 'Svg' ? Svg : Svg[tagName];
  const props = convertAttrsToProps({
    ...attrs,
    name: name && `${name}-${size}`,
  });

  return React.createElement(tag, props, ...content.map(renderToSvg));
}

const Library = ({ icons: iconDescriptors }) => {
  const icons = Object.keys(iconDescriptors)
    // .slice(0, 50)
    .map(key => {
      const icon = iconDescriptors[key];
      const name = `${icon.name}-${icon.size}`;
      // TODO: make symbol for key, what should strategy be?
      return renderToSvg(iconDescriptors[key]);
    });
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        // width: 48 * 20, // 48 is the box size * number of icons per row (20),
      }}>
      {icons}
    </View>
  );
};

export default () => {
  render(<Library icons={CarbonIcons} />, context.document.currentPage());
};
