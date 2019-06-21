import React from 'react';
import styled from 'styled-components';
import { getVisibility } from '../common/visibility';
import { ALMOST_BLACK, UNIMPORTANT_TEXT } from '../common/variables';
import { CheckboxWithLabel } from '../common/Input';
import { Link } from 'react-router-dom';

const CaseItemStyled = styled.div`
  border-bottom: 1px dashed ${ALMOST_BLACK};
  padding: 15px;
`;

const Visibility = styled.div`
  font-family: Equinor-Medium, serif;
  margin-left: auto;
`;

const CaseName = styled.div`
  font-family: Equinor-Medium, serif;
  min-width: 100px;
  color: ${ALMOST_BLACK};
`;

const CaseVersion = styled.div`
  font-family: Equinor-Regular, serif;
  color: ${UNIMPORTANT_TEXT};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const CheckboxStyled = styled.div`
  margin-left: auto;
  padding: 5px;
`;

const FlexLink = styled(Link)`
  display: inline-flex;
  flex-direction: row;

  color: ${ALMOST_BLACK};
  text-decoration: none;
`;

export function CaseItem({ _case, toggleCompareCase, checked }) {
  const { name, caseVersion, isOfficial, isShared } = _case;
  return (
    <CaseItemStyled>
      <Row>
        <FlexLink to={`case/${_case.id}`}>
          <CaseName>{name}</CaseName>
          <CaseVersion>{caseVersion}</CaseVersion>
        </FlexLink>
        <Visibility>{getVisibility(isOfficial, isShared)}</Visibility>
      </Row>
      <Row>
        <CheckboxStyled>
          <CheckboxWithLabel
            label="Compare"
            labelLeft={true}
            onChange={toggleCompareCase}
            value={'Compare'}
            checked={checked}
          />
        </CheckboxStyled>
      </Row>
    </CaseItemStyled>
  );
}
