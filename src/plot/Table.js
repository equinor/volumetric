import React from 'react';
import styled from 'styled-components';

const HEADERS = ['Realization', 'grv', 'nrv', 'npv', 'hcpv', 'stoiip'];

const Table = styled.table`
  border-collapse: collapse;
  flex-grow: 1;
  height: 400px;
  min-width: 600px;
`;

const TR = styled.tr``;

const TD = styled.td`
  padding: 15px;
  border: 1px solid lightgray;
`;

const TH = styled.th`
  padding: 15px;
  text-align: left;
  border: 1px solid lightgray;
`;

const Headers = () => {
  return (
    <thead>
      <TR>{HEADERS.map(name => <TH key={name}>{name}</TH>)}</TR>
    </thead>
  );
};

const handleNull = item => (item === null ? '-' : item);

const Body = ({ metrics, rows }) => {
  return (
    <tbody>
      {rows.map((row, rowIndex) => {
        return (
          <TR key={`table-row-${rowIndex}`}>
            {row.map((key, index) => (
              <TD key={`${key}-${index}`}>
                {handleNull(metrics[rowIndex][key])}
              </TD>
            ))}
          </TR>
        );
      })}
    </tbody>
  );
};

export default ({ metrics }) => {
  const rows = metrics.map(row =>
    Object.keys(row).filter(key =>
      HEADERS.map(header => header.toLowerCase()).includes(key),
    ),
  );

  return (
    <Table>
      <Headers />
      <Body rows={rows} metrics={metrics} />
    </Table>
  );
};
