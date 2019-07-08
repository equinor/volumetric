import React from 'react';
import styled from 'styled-components';
import { getVisibility } from '../common/visibility';
import {
  ALMOST_BLACK,
  PRIMARY_COLOR,
  UNIMPORTANT_TEXT,
  WARNING_COLOR,
} from '../common/variables';
import { Checkbox } from '../common/Input';
import { Link } from 'react-router-dom';
import { useUserSettings } from '../auth/AuthContext';

const CaseItemStyled = styled.div`
  border-bottom: 1px solid ${ALMOST_BLACK};
  display: flex;
  flex-direction: row;
  margin: 15px 15px 30px 0;
`;

const Visibility = styled.div`
  font-family: Equinor-Medium, serif;
  margin-left: auto;
`;

const CaseName = styled.div`
  color: ${PRIMARY_COLOR};
  font-size: 18px;
`;

const CaseVersion = styled.div`
  font-family: Equinor-Regular, serif;
  color: ${UNIMPORTANT_TEXT};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 5px 0;
`;

const CheckboxStyled = styled.label`
  margin-left: auto;
  padding: 5px 0 5px 5px;
  cursor: pointer;
`;

const FlexLink = styled(Link)`
  font-family: Equinor-Medium, serif;
  display: inline-flex;
  flex-direction: row;

  color: ${PRIMARY_COLOR};
  text-decoration: none;
  min-width: 150px;
  :hover {
    text-decoration: underline;
  }
`;

const ImportedInfo = styled.div`
  font-size: 14px;
  color: ${UNIMPORTANT_TEXT};
  display: flex;
  align-items: center;
`;

const CaseActions = styled.div`
  font-family: Equinor-Medium, serif;
  display: flex;
  flex-direction: row;
  margin-left: auto;
  font-size: 16px;
`;

const CaseAction = styled.button`
  color: ${props => props.color || PRIMARY_COLOR};
  text-decoration: underline;
  border: none;
  cursor: pointer;
  background: none;
  padding: 0 0 0 10px !important;
  font: inherit;
`;

const dateOptions = { day: 'numeric', year: 'numeric', month: 'long' };

export function CaseItem({
  _case,
  toggleCompareCase,
  checked,
  deleteCase,
  match,
}) {
  const { name, caseVersion, isOfficial, isShared } = _case;
  const { user } = useUserSettings();
  const caseLink = `${match.url}/${_case.id}`;
  return (
    <CaseItemStyled>
      <div style={{ flexGrow: 1 }}>
        <Row>
          <FlexLink to={caseLink}>
            <CaseName>{name}</CaseName>
          </FlexLink>
          <CaseVersion>{caseVersion}</CaseVersion>
        </Row>
        <Row>
          <Visibility>{getVisibility(isOfficial, isShared)}</Visibility>
        </Row>
        <Row>
          <ImportedInfo>
            Imported on{' '}
            {new Date(_case.createdDate).toLocaleDateString(
              'en-US',
              dateOptions,
            )}
          </ImportedInfo>
          <CaseActions>
            <CaseAction as={Link} to={caseLink}>
              View
            </CaseAction>
            {user.isCreator && (
              <CaseAction
                color={WARNING_COLOR}
                onClick={() => {
                  if (
                    window.confirm('Are you sure you want to delete this case?')
                  ) {
                    deleteCase(_case.id);
                  }
                }}
              >
                Delete
              </CaseAction>
            )}
          </CaseActions>
        </Row>
      </div>
      <CheckboxStyled>
        <Checkbox
          labelLeft={true}
          checked={checked}
          onChange={toggleCompareCase}
        />
      </CheckboxStyled>
    </CaseItemStyled>
  );
}
