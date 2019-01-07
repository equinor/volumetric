import React from 'react';
import { CreatableSelect } from './common/CreatableSelect';
import Select from '../common/Select';
import FileUpload from './common/FileUpload';
import ImportButton from './ImportButton';
import { Label, TextInput } from './common/Input';
import styled from 'styled-components';
import ImportMutation from './ImportMutation';
import { H2, H4 } from '../common/Headers';
import { CheckboxWithLabel } from '../common/Input';
import DateRangePicker from './common/DateRangePicker';
import moment from 'moment';
import { AuthConsumer } from '../auth/AuthContext';

const ImportWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledSelect = styled(Select)`
  margin-top: 1px;
`;

class ImportMetricsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filename: null,
      field: null,
      case: null,
      caseVersion: null,
      caseType: props.data.caseTypes[0],
      description: null,
      isOfficial: false,
      officialFromDate: moment(),
      officialToDate: moment(),
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(key, selectedOption) {
    this.setState({
      [key]: selectedOption,
    });
  }

  render() {
    const {
      data: { fields, caseTypes },
    } = this.props;
    return (
      <AuthConsumer>
        {({ user }) => (
          <ImportWrapper>
            <H2>Import metrics</H2>
            <ImportMutation {...this.props}>
              {importCase => (
                <React.Fragment>
                  <H4>Field</H4>
                  <InputWrapper>
                    <CreatableSelect
                      options={fields}
                      selectedOption={this.state.field}
                      onChange={selected =>
                        this.handleChange('field', selected.value)
                      }
                      placeholder="Select or create a field..."
                    />
                  </InputWrapper>
                  <H4>Case</H4>
                  <InputWrapper>
                    <TextInput
                      label="Name"
                      onChange={e => this.handleChange('case', e.target.value)}
                      placeholder="Enter case name..."
                    />
                    <TextInput
                      label="Version"
                      onChange={e =>
                        this.handleChange('caseVersion', e.target.value)
                      }
                      placeholder="Enter case version..."
                    />
                    <Label>
                      Type
                      <StyledSelect
                        onChange={selectedOption =>
                          this.handleChange('caseType', selectedOption.value)
                        }
                        options={caseTypes.map(caseType => ({
                          value: caseType,
                          label: caseType,
                        }))}
                        value={{
                          value: this.state.caseType,
                          label: this.state.caseType,
                        }}
                        placeholder="Select case type..."
                      />
                    </Label>
                    <TextInput
                      label="Description"
                      onChange={e =>
                        this.handleChange('description', e.target.value)
                      }
                      placeholder="Enter case description..."
                    />
                    <div>
                      <CheckboxWithLabel
                        value="isOfficial"
                        onChange={e =>
                          this.handleChange('isOfficial', e.target.checked)
                        }
                        checked={this.state.isOfficial}
                        label="Official?"
                        block={false}
                        disabled={!user.isAdmin}
                        title={
                          !user.isAdmin
                            ? 'You need to be admin to import official cases.'
                            : 'Is this an official case?'
                        }
                        labelLeft
                      />
                    </div>
                    {this.state.isOfficial && (
                      <DateRangePicker
                        {...this.state}
                        onChange={this.handleChange}
                      />
                    )}
                  </InputWrapper>
                  <H4>File</H4>
                  <InputWrapper>
                    <FileUpload
                      style={{ width: '100%' }}
                      filename={this.state.filename}
                      onChange={filename =>
                        this.handleChange('filename', filename)
                      }
                    />
                  </InputWrapper>
                  <InputWrapper>
                    <ImportButton
                      disabled={
                        !(
                          this.state.field &&
                          this.state.filename &&
                          this.state.case &&
                          this.state.caseVersion &&
                          this.state.caseType
                        )
                      }
                      importCase={() => importCase({ variables: this.state })}
                    />
                  </InputWrapper>
                </React.Fragment>
              )}
            </ImportMutation>
          </ImportWrapper>
        )}
      </AuthConsumer>
    );
  }
}

export default ImportMetricsComponent;
