import { LabelText, MinimalLabel, TextInput } from '../common/Input';
import DateRangePicker from '../common/DateRangePicker';
import FileUpload from '../common/FileUpload';
import { CancelLink, ImportButton } from './ImportActions';
import React from 'react';
import styled from 'styled-components';
import Select from '../../common/Select';
import { LIST_SEPARATOR_COLOR } from '../../common/variables';
import ToggleButtonGroup from '../../common/ToggleButtonGroup';
import { getVisibility } from '../../common/visibility';
import { capitalize } from '../../utils/text';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledSelect = styled(Select)`
  margin-top: 1px;
`;

export const ErrorText = styled.div`
  color: red;
`;

const Footer = styled.div`
  margin-top: 30px;
  border-top: 1px solid ${LIST_SEPARATOR_COLOR};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
`;

const VisibilityButtonGroup = ({
  isShared,
  isOfficial,
  setVisibility,
  user,
}) => {
  let visibilities = ['Private', 'Shared'];
  if (user.isFieldAdmin) {
    visibilities.push('Official');
  }

  const currentSelected = getVisibility(isOfficial, isShared);

  return (
    <MinimalLabel>
      <LabelText>Visibility</LabelText>
      <ToggleButtonGroup
        buttons={visibilities}
        currentSelected={currentSelected}
        onChange={setVisibility}
        buttonStyle={{ padding: '5px 20px' }}
      />
    </MinimalLabel>
  );
};

function handleFileChange(file, handleFormChange) {
  handleFormChange('filename', file.filename);
  handleFormChange('filehash', file.hash);
}

export default ({
  formState,
  handleFormChange,
  importCase,
  mutationData,
  user,
  caseTypes,
  hasChanged,
  resetHasChanged,
  setVisibility,
}) => {
  return (
    <form
      onSubmit={() => {
        resetHasChanged();
        importCase({ variables: formState });
      }}
    >
      <InputWrapper>
        <MinimalLabel>
          <LabelText>File</LabelText>
          {mutationData &&
            !hasChanged.filename &&
            mutationData.importCase.validationError &&
            !mutationData.importCase.validationError.file.valid && (
              <ErrorText>
                {mutationData.importCase.validationError.file.message}
              </ErrorText>
            )}
          <FileUpload
            style={{ width: '100%' }}
            filename={formState.filename}
            onChange={file => handleFileChange(file, handleFormChange)}
            isLoading={formState.isLoading}
            handleFormChange={handleFormChange}
          />
        </MinimalLabel>
        <TextInput
          label="Name"
          onChange={e => handleFormChange('case', capitalize(e.target.value))}
          placeholder="Enter case name..."
          value={formState.case}
        />
        <TextInput
          label="Version"
          onChange={e => handleFormChange('caseVersion', e.target.value)}
          placeholder="Enter case version..."
          value={formState.caseVersion}
          invalid={
            mutationData &&
            !hasChanged.caseVersion &&
            mutationData.importCase.validationError &&
            !mutationData.importCase.validationError.version.valid
          }
          errorMessage={
            mutationData &&
            !hasChanged.caseVersion &&
            mutationData.importCase.validationError &&
            mutationData.importCase.validationError.version.message
          }
        />
        <TextInput
          label="Description"
          onChange={e => handleFormChange('description', e.target.value)}
          placeholder="Enter case description..."
          value={formState.description}
        />
        <MinimalLabel style={{ maxWidth: '200px' }}>
          <LabelText>Type</LabelText>
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
        </MinimalLabel>
        <div>
          <VisibilityButtonGroup
            user={user}
            isShared={formState.isShared}
            isOfficial={formState.isOfficial}
            setVisibility={setVisibility}
          />
        </div>
        {formState.isOfficial && (
          <DateRangePicker {...formState} onChange={handleFormChange} />
        )}
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
        />
      </Footer>
    </form>
  );
};
