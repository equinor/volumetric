import { H4 } from '../../common/Headers';
import { Label, TextInput } from '../common/Input';
import { CheckboxWithLabel } from '../../common/Input';
import DateRangePicker from '../common/DateRangePicker';
import FileUpload from '../common/FileUpload';
import { ImportButton, CancelLink } from './ImportActions';
import React from 'react';
import styled from 'styled-components';
import Select from '../../common/Select';
import { LIST_SEPARATOR_COLOR } from '../../common/variables';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledSelect = styled(Select)`
  margin-top: 1px;
`;

const ErrorText = styled.div`
  color: red;
`;

const Footer = styled.div`
  border-top: 1px solid ${LIST_SEPARATOR_COLOR};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
`;

export default ({
  formState,
  handleFormChange,
  importCase,
  mutationData,
  user,
  fields,
  caseTypes,
}) => {
  return (
    <React.Fragment>
      <InputWrapper>
        <TextInput
          label="Name"
          onChange={e => handleFormChange('case', e.target.value)}
          placeholder="Enter case name..."
          value={formState.case}
        />
        <TextInput
          label="Version"
          onChange={e => handleFormChange('caseVersion', e.target.value)}
          placeholder="Enter case version..."
          value={formState.caseVersion}
        />
        <Label>
          Type
          <StyledSelect
            onChange={selectedOption =>
              handleFormChange('caseType', selectedOption.value)
            }
            options={caseTypes.map(caseType => ({
              value: caseType,
              label: caseType,
            }))}
            value={{
              value: formState.caseType,
              label: formState.caseType,
            }}
            placeholder="Select case type..."
          />
        </Label>
        <TextInput
          label="Description"
          onChange={e => handleFormChange('description', e.target.value)}
          placeholder="Enter case description..."
          value={formState.description}
        />
        <div>
          <CheckboxWithLabel
            value="isOfficial"
            onChange={e => handleFormChange('isOfficial', e.target.checked)}
            checked={formState.isOfficial}
            label="Official?"
            block={false}
            disabled={!user.isFieldAdmin}
            title={
              !user.isFieldAdmin
                ? 'You need to be admin to import official cases.'
                : 'Is this an official case?'
            }
            labelLeft
          />
        </div>
        {formState.isOfficial && (
          <DateRangePicker {...formState} onChange={handleFormChange} />
        )}
      </InputWrapper>
      <H4>File</H4>
      {mutationData && mutationData.importCase.validationError && (
        <ErrorText>{mutationData.importCase.validationError.message}</ErrorText>
      )}
      <InputWrapper>
        <FileUpload
          style={{ width: '100%' }}
          filename={formState.filename}
          onChange={filename => handleFormChange('filename', filename)}
          isLoading={formState.isLoading}
          handleFormChange={handleFormChange}
        />
      </InputWrapper>
      <Footer>
        <CancelLink to="/cases/import">Cancel</CancelLink>
        <ImportButton
          disabled={
            !(
              formState.field &&
              formState.filename &&
              formState.case &&
              formState.caseVersion &&
              formState.caseType
            )
          }
          importCase={() => importCase({ variables: formState })}
        />
      </Footer>
    </React.Fragment>
  );
};
