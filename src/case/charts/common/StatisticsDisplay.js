import React from 'react';
import styled from 'styled-components';
import { FormattedText } from '../../../common/FormattedText';
import { getColorPalette } from '../../../utils/colors';
import { ALMOST_BLACK } from '../../../common/variables';

const StatisticsDisplayStyled = styled.div`
  display: flex;
  margin: 10px 12px 10px 0;
  justify-content: space-between;
`;

const CaseName = styled.div`
  padding: 3px 0 3px 6px;
  border-left: 3px solid ${props => props.borderColor || ALMOST_BLACK};
  min-width: 125px;

  ::before {
    content: 'Version: ';
    font-family: Equinor-Medium, serif;
  }
`;

export default ({ cases, volumetrics, selectedMetric }) => {
  const colorPalette = getColorPalette(volumetrics.length);
  return volumetrics.map(({ caseId, p10, p50, p90, means }, index) => (
    <StatisticsDisplayStyled key={caseId}>
      {cases && (
        <CaseName borderColor={colorPalette[index]}>
          {cases.find(_case => _case.id === caseId).caseVersion}
        </CaseName>
      )}
      <FormattedText
        value={p10[selectedMetric]}
        label={'p10'}
        borderColor={colorPalette[index]}
      />
      <FormattedText
        value={p50[selectedMetric]}
        label={'p50'}
        borderColor={colorPalette[index]}
      />
      <FormattedText
        value={p90[selectedMetric]}
        label={'p90'}
        borderColor={colorPalette[index]}
      />
      <FormattedText
        value={means[selectedMetric]}
        label={'mean'}
        borderColor={colorPalette[index]}
      />
    </StatisticsDisplayStyled>
  ));
};
