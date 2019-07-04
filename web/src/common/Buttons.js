import styled from 'styled-components';
import {
  DANGER_COLOR,
  DARKER_SUCCESS_COLOR,
  LIST_SEPARATOR_COLOR,
  SUCCESS_COLOR,
} from './variables';
import { Button } from './Input';

export const DeleteButton = styled.button`
  background: white none;
  border: 2px solid ${DANGER_COLOR};
  padding: 5px 7px;
  border-radius: 4px;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
  display: ${props => (props.disabled ? 'none' : 'block')};

  :hover {
    filter: brightness(75%);
  }
`;

export const SubmitButton = styled(Button)`
  background: ${props =>
      props.disabled ? LIST_SEPARATOR_COLOR : SUCCESS_COLOR}
    none;
  color: white;
  border: 1px solid
    ${props => (props.disabled ? LIST_SEPARATOR_COLOR : DARKER_SUCCESS_COLOR)};
  border-radius: 4px;
  padding: 8px 14px;
  font: inherit;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  outline: inherit;
  margin-top: 10px;
`;
