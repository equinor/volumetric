import React from 'react';
import styled from 'styled-components';

const DictName = styled.div`
  display: inline-block;
  min-width: 100px;
  font-weight: bold;
`;

const DictItemStyled = styled.div`
  padding: 10px;
`;

const DictItem = ({ name, description }) => {
  return (
    <DictItemStyled>
      <DictName>{name}</DictName>
      {description}
    </DictItemStyled>
  );
};

const Dictionary = () => {
  return (
    <div>
      <h2>Dictionary</h2>
      <h3>Definitions</h3>
      <DictItem
        name="Faultblock"
        description="aka Region Index. A 3D region/area within a reservoir. Horizontal."
      />
      <DictItem
        name="Zone"
        description="A 3D region/area within a reservoir. Vertical."
      />
      <DictItem name="Model" description="Name of the model." />
      <DictItem
        name="Realization"
        description="Identifier for a certain realization of the model."
      />
      <DictItem
        name="Facies"
        description="Name given to a body of rock with specified characteristics."
      />
      <h3>Metrics</h3>
      <DictItem
        name="GRV"
        description="Gross Rock Volume. aka BRV - Bulk Rock Volume"
      />
      <DictItem name="NRV" description="Net Rock Volume" />
      <DictItem name="NPV" description="Net Pore Volume" />
      <DictItem name="HCPV" description="Hydrocarbon Pore Volume" />
      <DictItem name="STOIIP" description="Stock Tank Oil Initially In Place" />
    </div>
  );
};

export default Dictionary;
