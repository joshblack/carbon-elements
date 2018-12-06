import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

export function Grid({
  bleed,
  condensed,
  children,
  className: customClassName,
  element,
  fluid,
  hang,
  padding,
  ...rest
}) {
  const className = cx({
    'bx--grid': !fluid,
    'bx--fluid-grid': fluid,
    'bx--grid--bleed': bleed,
    'bx--grid--condensed': condensed,
    'bx--grid--padding': padding,
    'bx--grid--hang': hang,
  });
  return React.createElement(
    element,
    {
      ...rest,
      className,
    },
    children
  );
}

Grid.defaultProps = {
  element: 'div',
  fluid: false,
};

export function Row({
  children,
  className: customClassName,
  element,
  ...rest
}) {
  const className = cx({
    'bx--row': true,
    [customClassName]: !!customClassName,
  });
  return React.createElement(
    element,
    {
      ...rest,
      className,
    },
    children
  );
}

Row.defaultProps = {
  element: 'div',
};

export function Column({
  breakpoints,
  className: customClassName,
  children,
  element,
  offset,
  ...rest
}) {
  const className = cx({
    'bx--col': breakpoints.length === 0,
    [customClassName]: !!customClassName,
    ...breakpoints.reduce(
      (acc, [breakpoint, span]) => ({
        ...acc,
        [`bx--col-${breakpoint}-${span}`]: true,
      }),
      {}
    ),
  });
  return React.createElement(
    element,
    {
      ...rest,
      className,
    },
    children
  );
}

Column.defaultProps = {
  breakpoints: [],
  element: 'div',
};
