import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { Label } from './Input';

const DatePickerStyled = styled(DatePicker)`
  min-height: 34px;
  font-family: Equinor-Regular, sans-serif;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid hsl(0, 0%, 80%);
`;

const DateRangePickerStyled = styled.div`
  display: flex;
`;

export default ({ officialFromDate, officialToDate, onChange }) => {
  return (
    <DateRangePickerStyled>
      <Label>
        From
        <DatePickerStyled
          selected={officialFromDate}
          onChange={date => onChange('officialFromDate', date)}
          maxDate={officialToDate ? officialToDate : undefined}
        />
      </Label>
      <Label>
        To
        <DatePickerStyled
          minDate={officialFromDate ? officialFromDate : undefined}
          selected={officialToDate}
          onChange={date => onChange('officialToDate', date)}
        />
      </Label>
    </DateRangePickerStyled>
  );
};
