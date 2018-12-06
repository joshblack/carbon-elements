import PropTypes from 'prop-types';
import React from 'react';

export default function Emoji({ 'aria-label': ariaLabel, children, ...rest }) {
  return (
    <span {...rest} aria-label={ariaLabel} role="img">
      {children}
    </span>
  );
}

Emoji.propTypes = {
  'aria-label': PropTypes.string.isRequired,
};
