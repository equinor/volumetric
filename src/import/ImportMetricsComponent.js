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
    super();
    this.state = {
      filename: null,
      field: null,
      model: null,
      modelVersion: null,
      modelType: props.data.modelTypes[0],
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
      data: { fields, modelTypes },
    } = this.props;
    return (
      <AuthConsumer>
        {({ user }) => (
          <ImportWrapper>
            <H2>Import metrics</H2>
            <ImportMutation {...this.props}>
              {importModel => (
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
                  <H4>Model</H4>
                  <InputWrapper>
                    <TextInput
                      label="Name"
                      onChange={e => this.handleChange('model', e.target.value)}
                      placeholder="Enter model name..."
                    />
                    <TextInput
                      label="Version"
                      onChange={e =>
                        this.handleChange('modelVersion', e.target.value)
                      }
                      placeholder="Enter model version..."
                    />
                    <Label>
                      Type
                      <StyledSelect
                        onChange={selectedOption =>
                          this.handleChange('modelType', selectedOption.value)
                        }
                        options={modelTypes.map(modelType => ({
                          value: modelType,
                          label: modelType,
                        }))}
                        value={{
                          value: this.state.modelType,
                          label: this.state.modelType,
                        }}
                        placeholder="Select model type..."
                      />
                    </Label>
                    <TextInput
                      label="Description"
                      onChange={e =>
                        this.handleChange('description', e.target.value)
                      }
                      placeholder="Enter model description..."
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
                            ? 'You need to be admin to import official models.'
                            : 'Is this an official model?'
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
                          this.state.model &&
                          this.state.modelVersion &&
                          this.state.modelType
                        )
                      }
                      importModel={() => importModel({ variables: this.state })}
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
