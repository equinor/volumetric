import React from 'react';
import styled from 'styled-components';
import {METRICS} from '../common/variables';

const HEADERS = ['Realization', ...METRICS];

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  height: 400px;
  min-width: 600px;
`;

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
        <tr>{HEADERS.map(name => <TH key={name}>{name}</TH>)}</tr>
        </thead>
    );
};

const handleNull = item => (item === null ? '-' : item);

const Body = ({metrics}) => {
    return (
        <tbody>
        {metrics.map((row, rowIndex) => {
            return (
                <tr key={`table-row-${rowIndex}`}>
                    {HEADERS.map((header, index) => (
                        <TD key={`${header}-${index}`}>
                            {handleNull(metrics[rowIndex][header.toLowerCase()])}
                        </TD>
                    ))}
                </tr>
            );
        })}
        </tbody>
    );
};

export default ({metrics}) => {
    return (
        <Table>
            <Headers/>
            <Body metrics={metrics}/>
        </Table>
    );
};
