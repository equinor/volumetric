import React from 'react';
import styled from 'styled-components';
import {RadioButtonStyled} from './RadioButton';
import {DEFAULT_COLOR, SELECTED_COLOR, HOVER_COLOR} from './variables';


const ToggleButtonStyled = styled(RadioButtonStyled).attrs({
    hoverColor: HOVER_COLOR,
    selectedColor: SELECTED_COLOR,
    defaultColor: DEFAULT_COLOR,
})`
  padding: 15px 45px;
  margin: 2px;
  min-width: 40px;
`;

export default props => {
    const {onChange, value, selected} = props;

    const handleChange = event => {
        onChange(event.target.value);
    };

    return (
        <ToggleButtonStyled key={value} selected={selected}>
            <input
                type="radio"
                onChange={handleChange}
                value={value}
                checked={selected}
            />
            {props.children}
        </ToggleButtonStyled>
    );
};
