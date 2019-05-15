import React from 'react';
import CaseSelector from './CaseSelector';
import CaseContainer from './CaseContainer';
import CaseInfo from './CaseInfo';

class LocationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleCaseSelectorChange = this.handleCaseSelectorChange.bind(this);
    const field = this.props.fields.fields[0];

    if (field.cases.length !== 0) {
      this.state = {
        field: {
          label: field.name,
          value: field.name,
        },
        currentCase: {
          label: `${field.cases[0].name} (${field.cases[0].caseVersion})`,
          value: field.cases[0].id,
          caseType: field.cases[0].caseType,
          description: field.cases[0].description,
          id: field.cases[0].id,
          isOfficial: field.cases[0].isOfficial,
        },
      };
    }
  }

  handleCaseSelectorChange(key, value) {
    const { fields } = this.props;
    const stateChanges = {
      [key]: value,
    };
    if (key === 'field') {
      const firstCase = fields.fields.find(field => field.name === value.value)
        .cases[0];
      stateChanges['currentCase'] = {
        label: `${firstCase.name} (${firstCase.caseVersion})`,
        value: firstCase.id,
        caseType: firstCase.caseType,
        description: firstCase.description,
        id: firstCase.id,
        isOfficial: firstCase.isOfficial,
      };
    } else {
      const currentCase = fields.fields
        .find(field => field.name === this.state.field.value)
        .cases.find(otherCase => otherCase.id === value.value);
      stateChanges['currentCase'] = {
        label: `${currentCase.name} (${currentCase.caseVersion})`,
        value: currentCase.id,
        caseType: currentCase.caseType,
        description: currentCase.description,
        id: currentCase.id,
        isOfficial: currentCase.isOfficial,
      };
    }
    this.setState(stateChanges);
  }

  render() {
    const { fields } = this.props;
    return fields.fields[0].cases.length === 0 ? (
      <div>
        <p>There is no cases in this field yet</p>
      </div>
    ) : (
      <div>
        <CaseSelector
          field={this.state.field}
          handleChange={this.handleCaseSelectorChange}
          fields={fields}
          currentCase={this.state.currentCase}
        />
        <CaseInfo currentCase={this.state.currentCase} />
        <CaseContainer caseId={this.state.currentCase.value} />
      </div>
    );
  }
}

export default LocationComponent;
