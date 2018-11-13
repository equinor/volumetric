import React from 'react';
import styled from 'styled-components';
import { ALMOST_BLACK } from '../common/variables';
import { H2, H3 } from '../common/Headers';

const DT = styled.dt`
  font-weight: bold;
  display: inline;
  min-width: 100px;
`;

const DD = styled.dd`
  margin-left: 10px;
  margin-right: 25px;
`;

const UL = styled.ul`
  display: flex;
  flex-direction: column;
  color: ${ALMOST_BLACK};
  list-style-type: none;
  margin-top: 10px;
`;

const DL = styled.dl`
  display: flex;
  margin: 10px 0;
`;

const DictionaryHeader = styled(H3)`
  margin-top: 1.5em;
  margin-bottom: 10px;
`;

const DictItem = ({ name, description }) => {
  return (
    <li>
      <DL>
        <DT>{name}</DT>
        <DD>{description}</DD>
      </DL>
    </li>
  );
};

const Dictionary = () => {
  return (
    <div>
      <H2>Dictionary</H2>
      <DictionaryHeader>Definitions</DictionaryHeader>
      <UL>
        <DictItem
          name="Region"
          description="aka Region Index and faultblock. A 3D region/area within a reservoir. Horizontal."
        />
        <DictItem
          name="Zone"
          description="A 3D region/area within a reservoir. Vertical."
        />
        <DictItem name="Case" description="Name of the case." />
        <DictItem
          name="Realization"
          description="Identifier for a certain realization of the case."
        />
        <DictItem
          name="Facies"
          description="Name given to a body of rock with specified characteristics."
        />
      </UL>
      <DictionaryHeader>Metrics</DictionaryHeader>
      <UL>
        <DictItem
          name="BULK"
          description="Bulk Rock Volume aka GRV - Gross Rock Volume."
        />
        <DictItem name="Net" description="aka NRV, Net Rock Volume" />
        <DictItem name="Porv" description="aka NPV, Net Pore Volume" />
        <DictItem name="HCPV" description="Hydrocarbon Pore Volume" />
        <DictItem
          name="STOIIP"
          description="Stock Tank Oil Initially In Place"
        />
      </UL>
    </div>
  );
};

export default Dictionary;
