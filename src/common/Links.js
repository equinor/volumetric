import { DARKER_SUCCESS_COLOR } from './variables';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const PageLink = styled(Link)`
  outline: none;
  padding: 8px 12px;
  text-decoration: none;
  font-family: Equinor-Medium;
  color: ${DARKER_SUCCESS_COLOR};
  border: 2px solid ${DARKER_SUCCESS_COLOR};
  border-radius: 4px;
  margin-left: 20px;
`;
