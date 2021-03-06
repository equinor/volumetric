import React from 'react';
import styled from 'styled-components';
import { ALMOST_BLACK } from './variables';
import PropTypes from 'prop-types';

const SpinnerComponent = styled.div`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;

  div {
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 32px 32px;
  }
  div:after {
    content: ' ';
    display: block;
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${ALMOST_BLACK};
  }

  div:nth-child(1) {
    animation-delay: -0.036s;
  }
  div:nth-child(1):after {
    top: 50px;
    left: 50px;
  }
  div:nth-child(2) {
    animation-delay: -0.072s;
  }
  div:nth-child(2):after {
    top: 54px;
    left: 45px;
  }
  div:nth-child(3) {
    animation-delay: -0.108s;
  }
  div:nth-child(3):after {
    top: 57px;
    left: 39px;
  }
  div:nth-child(4) {
    animation-delay: -0.144s;
  }
  div:nth-child(4):after {
    top: 58px;
    left: 32px;
  }
  div:nth-child(5) {
    animation-delay: -0.18s;
  }
  div:nth-child(5):after {
    top: 57px;
    left: 25px;
  }
  div:nth-child(6) {
    animation-delay: -0.216s;
  }
  div:nth-child(6):after {
    top: 54px;
    left: 19px;
  }
  div:nth-child(7) {
    animation-delay: -0.252s;
  }
  div:nth-child(7):after {
    top: 50px;
    left: 14px;
  }
  div:nth-child(8) {
    animation-delay: -0.288s;
  }
  div:nth-child(8):after {
    top: 45px;
    left: 10px;
  }
  @keyframes lds-roller {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Spinner = props => {
  const { isLoading } = props;
  return isLoading ? (
    <div className={props.className}>
      <SpinnerComponent>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </SpinnerComponent>
    </div>
  ) : (
    props.children
  );
};

const SmallSpinnerComponent = styled.div`
  border: 9px solid #f3f3f3;
  border-radius: 50%;
  border-top: 9px solid ${ALMOST_BLACK};
  width: 18px;
  height: 18px;
  -webkit-animation: spin 1.5s linear infinite; /* Safari */
  animation: spin 1.5s linear infinite;

  /* Safari */
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const SmallSpinner = props => {
  const { isLoading } = props;

  return isLoading ? (
    <div className={props.className}>
      <SmallSpinnerComponent />
    </div>
  ) : (
    props.children
  );
};

SmallSpinner.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

Spinner.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export const StyledSpinner = styled(Spinner)`
  margin-top: 15vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
