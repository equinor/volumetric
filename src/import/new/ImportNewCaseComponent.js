import React from 'react';
import styled from 'styled-components';
import ImportMutation from './ImportMutation';
import { H3 } from '../../common/Headers';
import ImportForm from './ImportForm';

const ImportWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 15vw;
`;

class ImportNewCaseComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formState: {
        filename: null,
        field: this.props.currentField,
        case: '',
        caseVersion: '',
        caseType: props.data.caseTypes[0],
        description: '',
        isOfficial: false,
        officialFromDate: new Date(),
        officialToDate: new Date(),
        isLoading: false,
      },
      fileHasChanged: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.setFileHasChanged = this.setFileHasChanged.bind(this);
  }

  handleChange(key, selectedOption) {
    this.setState(state => ({
      formState: {
        ...state.formState,
        [key]: selectedOption,
      },
      fileHasChanged: key === 'filename',
    }));
  }

  setFileHasChanged(fileHasChanged) {
    this.setState({ fileHasChanged });
  }

  render() {
    const {
      data: { caseTypes },
      user,
    } = this.props;
    return (
      <ImportWrapper>
        <H3>Import metrics</H3>
        <p>
          Files that are going to be imported must conform to the FMU-standard.
          This standard can be found here;{' '}
          <a href="https://wiki.equinor.com/wiki/index.php/FMU_standards#Volumetric_files">
            wiki.equinor.com/wiki/index.php/FMU_standards#Volumetric_files.
          </a>
        </p>
        <p>
          The only required headers in the CSV-file are "REGION" and "ZONE". Any
          of the metric headers may be omitted. Case metadata will be added
          through the web form.
        </p>
        <ImportMutation {...this.props}>
          {(importCase, data) => {
            return (
              <ImportForm
                formState={this.state.formState}
                fileHasChanged={this.state.fileHasChanged}
                setFileHasChanged={this.setFileHasChanged}
                importCase={importCase}
                mutationData={data}
                handleFormChange={this.handleChange}
                user={user}
                caseTypes={caseTypes}
              />
            );
          }}
        </ImportMutation>
      </ImportWrapper>
    );
  }
}

export default ImportNewCaseComponent;
