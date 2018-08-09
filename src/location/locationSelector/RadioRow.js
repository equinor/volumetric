import React from 'react';
import { LocationListStyled } from './common';
import styled from 'styled-components';
import { ALMOST_BLACK } from '../../common/variables';

const RadioRowStyled = styled.label`
  padding: 15px;
  display: block;
  border-bottom: 1px solid ${ALMOST_BLACK};
  cursor: pointer;
`;

class RadioRow extends React.Component {
  render() {
    const { data, category, selectedOption, handleBoxChange } = this.props;

    // This selects the first box if none are selected(eg. on page load)
    if (selectedOption === '') {
      let event = {
        target: {
          value: data[0].name,
        },
      };
      handleBoxChange(category, event);
    }

    const rows = data.map(item => (
      <RadioRowStyled key={item.name}>
        <input
          onChange={event => handleBoxChange(category, event)}
          type="radio"
          value={item.name}
          checked={selectedOption === item.name}
        />
        {item.name}
      </RadioRowStyled>
    ));
    return <LocationListStyled>{rows}</LocationListStyled>;
  }
}

export default RadioRow;
