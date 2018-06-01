import React from 'react';

const HEADERS = ['Realization', 'grv', 'nrv', 'npv', 'hcpv', 'stoiip'];

const Headers = () => {
  return (
    <thead>
      <tr>{HEADERS.map(name => <th key={name}>{name}</th>)}</tr>
    </thead>
  );
};

const handleNull = item => (item === null ? '-' : item);

const Body = ({ metrics, rows }) => {
  return (
    <tbody>
      {rows.map((row, rowIndex) => {
        return (
          <tr>
            {row.map(key => (
              <td key={key}>{handleNull(metrics[rowIndex][key])}</td>
            ))}
          </tr>
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
    <table>
      <Headers />
      <Body rows={rows} metrics={metrics} />
    </table>
  );
};
