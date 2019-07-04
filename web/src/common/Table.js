import { ALMOST_BLACK, LIST_SEPARATOR_COLOR } from './variables';
import styled from 'styled-components';

export const Table = styled.table`
  display: flex;
  flex-flow: column;
  color: ${ALMOST_BLACK};
`;

export const Row = styled.tr`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-bottom: 1px solid ${LIST_SEPARATOR_COLOR};
  padding: 10px 5px;
  min-height: 32px;
`;

export const TD = styled.td`
  flex: ${props => (props.grow ? props.grow : 1)};
  padding-right: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const OverflowTD = styled(TD)`
  overflow: hidden;
`;

export const TH = styled.th`
  text-align: start;
  padding-right: 20px;
  flex: ${props => (props.grow ? props.grow : 1)};
  font-weight: 400;
  font-family: Equinor-Medium;
`;
