import React from 'react';
import styled from 'styled-components';
import { ALMOST_BLACK } from './variables';

const SpinnerComponent = styled.div`
  margin: 20px auto;
  border: 16px solid;
  border-color: #bbbbbb ${ALMOST_BLACK};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Spinner = props => {
  const { isLoading } = props;

  return isLoading ? (
    <div className={props.className}>
      <SpinnerComponent />
    </div>
  ) : (
    props.children
  );
};

export default Spinner;
