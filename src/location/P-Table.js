import React from 'react';
import styled from 'styled-components';

const TabelStyled = styled.table`
  width: 100%;
  border: 1px solid black;
  border-collapse: collapse;
`;

const TabelHeader = styled.th`
  border: 1px solid black;
  border-collapse: collapse;
  background-color: black;
  color: white;
`;

const TabelRow = styled.tr`
  &:hover {
    background-color: #dadad3;
  };
`;

const TabelData = styled.td`
  border: 1px solid black;
  border-collapse: collapse;
  background-color: #eeeee7;
  padding: 10px;
  text-align: center;
  &:hover {
    background-color: #dadad3;
  };
`;

export default class PTable extends React.Component {
  render() {
    const {pValues}= this.props;
    const pCalcs = ['p10', 'p50', 'p90'];
    const metrics = ['GRV', 'NRV', 'NPV', 'HCPV', 'STOIIP'];
    const headers = ['Metric', ...metrics];

    const tabel = (
      <div>
        {headers.map((header) =>
          <p>Hello {header}</p>
        )}

      </div>
    );


    return (
      <div>
      {tabel}
      </div>
    );
  };
}





