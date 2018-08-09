import { ALMOST_BLACK } from '../../../common/variables';
import styled from 'styled-components';

export const LocationListStyled = styled.div`
  border: 1px solid ${ALMOST_BLACK}
  overflow: auto;
  max-height: 300px;
  height: 100%;
  flex-grow: 1;
`;

export const ColumnStyled = styled.div`
  margin: 0 ${props => (props.right ? '0' : '10px')} 0
    ${props => (props.left ? '0' : '10px')};
  flex-grow: 1;
`;
