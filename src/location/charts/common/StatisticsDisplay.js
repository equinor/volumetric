import React from 'react';
import styled from 'styled-components';
import { FormatedText } from '../../../common/FormatedText';

const StatisticsDisplayStyled = styled.div`
  display: flex;
  margin: 10px 12px 10px 87px;
  justify-content: space-between;
`;

export default ({ selectedMetric, p10, p50, p90, means }) => {
  return (
    <StatisticsDisplayStyled>
      <FormatedText value={p10[selectedMetric]} label={'p10'} />
      <FormatedText value={p50[selectedMetric]} label={'p50'} />
      <FormatedText value={p90[selectedMetric]} label={'p90'} />
      <FormatedText value={means[selectedMetric]} label={'mean'} />
    </StatisticsDisplayStyled>
  );
};
