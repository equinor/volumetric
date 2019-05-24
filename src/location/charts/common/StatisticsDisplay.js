import React from 'react';
import styled from 'styled-components';
import { FormattedText } from '../../../common/FormattedText';

const StatisticsDisplayStyled = styled.div`
  display: flex;
  margin: 10px 12px 10px 87px;
  justify-content: space-between;
`;

export default ({ selectedMetric, p10, p50, p90, means }) => {
  return (
    <StatisticsDisplayStyled>
      <FormattedText value={p10[selectedMetric]} label={'p10'} />
      <FormattedText value={p50[selectedMetric]} label={'p50'} />
      <FormattedText value={p90[selectedMetric]} label={'p90'} />
      <FormattedText value={means[selectedMetric]} label={'mean'} />
    </StatisticsDisplayStyled>
  );
};
