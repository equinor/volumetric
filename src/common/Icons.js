import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.svg`
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;

  &:hover path {
    fill: ${props => props.hoverColor || 'gray'};
  }
`;

const Path = styled.path`
  fill: ${props => props.color || 'white'};
`;

// https://www.iconfinder.com/
// https://icomoon.io/app/#/select

export const ICONS = {
  cross:
    'M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z',
};

function Icon({ size, icon, color, hoverColor, onClick, flipX, flipY }) {
  return (
    <Wrapper
      transform={`scale(${flipX ? -1 : 1} ${flipY ? -1 : 1})`}
      width={`${size}px`}
      height={`${size}px`}
      viewBox={`0 0 32 32`}
      onClick={onClick}
      hoverColor={hoverColor}
    >
      <Path d={icon} color={color} />
    </Wrapper>
  );
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};

Icon.defaultProps = {
  size: 16,
  flipX: false,
  flipY: false,
};

export default Icon;
