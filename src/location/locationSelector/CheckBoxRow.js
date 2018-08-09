import React from 'react';
import styled from 'styled-components';
import { ALMOST_BLACK, LIGHT_BLUE } from '../../common/variables';
import { LocationListStyled } from './common';

const CheckboxLabel = styled.label`
  padding: 15px;
  border-bottom: 1px solid ${ALMOST_BLACK};
  display: block;
  cursor: pointer;

  ${props =>
    props.checked &&
    `
    background-color: ${LIGHT_BLUE};
    color: white;  
  `} input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
`;

class CheckBox extends React.Component {
  render() {
    const { handleBoxChange, category, datarow, checked } = this.props;
    let checkedState = checked.includes(datarow);
    return (
      <CheckboxLabel checked={checkedState}>
        <input
          onChange={event => handleBoxChange(category, event)}
          type="checkbox"
          value={datarow === null ? '' : datarow}
          checked={checkedState}
        />
        {datarow}
      </CheckboxLabel>
    );
  }
}

class CheckBoxRow extends React.Component {
  render() {
    const { data, allChecked, handleBoxChange, category, checked } = this.props;
    let tempAllChecked = allChecked;

    // This selects the first box if none are selected(eg. on page load)
    if (checked === '') {
      let event = {
        target: {
          value: 'all',
          checked: true,
        },
      };
      handleBoxChange(category, event, data);
      tempAllChecked = true;
    }
    if (checked.length === data.length) {
      tempAllChecked = true;
    }

    const rows = data.map(datarow => (
      <CheckBox
        datarow={datarow}
        handleBoxChange={handleBoxChange}
        category={category}
        checked={checked}
        key={datarow}
      />
    ));

    return (
      <LocationListStyled>
        <CheckboxLabel checked={tempAllChecked}>
          <input
            onChange={event => handleBoxChange(category, event, data)}
            type="checkbox"
            value="all"
            checked={tempAllChecked}
          />
          All
        </CheckboxLabel>
        {rows}
      </LocationListStyled>
    );
  }
}

export default CheckBoxRow;
