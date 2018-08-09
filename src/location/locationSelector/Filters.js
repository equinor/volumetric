import React from 'react';
import { Query } from 'react-apollo';
import { GET_FIELDS, GET_MODELS } from '../ModelQueries';
import styled from 'styled-components';
import RadioRow from './RadioRow';
import CheckBoxRow from './CheckBoxRow';
import { ColumnStyled } from './common/Styled';

const TableDescriber = styled.h4`
  margin-bottom: 10px;
`;

const DatasetSelectorItemStyled = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const DatasetSelectorItem = ({ name, ...props }) => {
  return (
    <DatasetSelectorItemStyled>
      <TableDescriber>{name}</TableDescriber>
      <RadioRow {...props} />
    </DatasetSelectorItemStyled>
  );
};

export class Fields extends React.Component {
  render() {
    return (
      <Query query={GET_FIELDS}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          const { fields, handleBoxChange } = this.props;

          return (
            <DatasetSelectorItem
              name="Fields"
              selectedOption={fields}
              data={data.field}
              handleBoxChange={handleBoxChange}
              category="fields"
            />
          );
        }}
      </Query>
    );
  }
}

export class Models extends React.Component {
  render() {
    const { fieldName, model, handleBoxChange } = this.props;

    if (fieldName === '') {
      return (
        <React.Fragment>
          <TableDescriber>Models</TableDescriber>
          No field given
        </React.Fragment>
      );
    }

    return (
      <Query
        query={GET_MODELS}
        variables={{
          fieldName: fieldName,
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          return (
            <DatasetSelectorItem
              name="Models"
              selectedOption={model}
              data={data.models}
              handleBoxChange={handleBoxChange}
              category="models"
            />
          );
        }}
      </Query>
    );
  }
}

export class Faultblocks extends React.Component {
  render() {
    const { data, allChecked, handleBoxChange, checked } = this.props;
    return (
      <ColumnStyled>
        <TableDescriber>Faultblocks</TableDescriber>
        <CheckBoxRow
          data={data.model.faultblocks}
          allChecked={allChecked}
          handleBoxChange={handleBoxChange}
          category="faultblocks"
          checked={checked}
        />
      </ColumnStyled>
    );
  }
}

export class Zones extends React.Component {
  render() {
    const { data, allChecked, handleBoxChange, checked } = this.props;
    return (
      <ColumnStyled>
        <TableDescriber>Zones</TableDescriber>
        <CheckBoxRow
          data={data.model.zones}
          allChecked={allChecked}
          handleBoxChange={handleBoxChange}
          category="zones"
          checked={checked}
        />
      </ColumnStyled>
    );
  }
}

export class Facies extends React.Component {
  render() {
    const { data, allChecked, handleBoxChange, checked } = this.props;
    return (
      <ColumnStyled right>
        <TableDescriber>Facies</TableDescriber>
        <CheckBoxRow
          data={data.model.facies}
          allChecked={allChecked}
          handleBoxChange={handleBoxChange}
          category="facies"
          checked={checked}
        />
      </ColumnStyled>
    );
  }
}
