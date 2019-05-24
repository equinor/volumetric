import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 600px;
`;

const TBody = styled.tbody`
  td {
    padding: 15px;
    border: 1px solid lightgray;
  }
`;

const TH = styled.th`
  padding: 15px;
  text-align: left;
  border: 1px solid lightgray;
`;

const addUnit = (headerText, availableMetrics) => {
  return availableMetrics.includes(headerText) ? (
    <span>
      {headerText} (m<sup>3</sup>)
    </span>
  ) : (
    headerText
  );
};

const Headers = ({ filterMetrics }) => {
  const HEADERS = ['Realization', ...filterMetrics];
  return (
    <thead>
      <tr>
        {HEADERS.map(name => (
          <TH key={name}>{addUnit(name, filterMetrics)}</TH>
        ))}
      </tr>
    </thead>
  );
};

const handleNull = item => (item === null ? '-' : item);

const Body = ({ metrics, filterMetrics }) => {
  const HEADERS = ['Realization', ...filterMetrics];
  return (
    <TBody>
      {metrics.map((row, rowIndex) => {
        return (
          <tr key={`table-row-${rowIndex}`}>
            {HEADERS.map((header, index) => (
              <td key={`${header}-${index}`}>
                {handleNull(metrics[rowIndex][header.toLowerCase()])}
              </td>
            ))}
          </tr>
        );
      })}
    </TBody>
  );
};

export default ({ metrics, filterMetrics }) => {
  return (
    <Table>
      <Headers filterMetrics={filterMetrics} />
      <Body metrics={metrics} filterMetrics={filterMetrics} />
    </Table>
  );
};
