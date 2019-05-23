import React from 'react';
import styled from 'styled-components';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import { Dictionary } from './dictionary';
import { Contact } from './contact';
import { ApiDoc } from './ApiDoc';
import { useUserSettings } from '../auth/AuthContext';
import { ALMOST_BLACK, SELECTED_COLOR } from '../common/variables';

const DocsStyled = styled.div`
  display: flex;
`;

const UL = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const LI = styled.li`
  .active {
    color: ${SELECTED_COLOR};
  }
  padding: 0;
  margin: 0;
`;

const DocLink = styled(NavLink)`
  display: block;
  padding: 10px 50px 10px 0;
  text-decoration: none;
  color: ${ALMOST_BLACK};
  outline: none;
`;

function Docs() {
  const { user } = useUserSettings();
  return (
    <DocsStyled>
      <div>
        <UL>
          <LI>
            <DocLink to="/docs/api">Api</DocLink>
          </LI>
          <LI>
            <DocLink to="/docs/dictionary">Dictionary</DocLink>
          </LI>
          <LI>
            <DocLink to="/docs/contact">Contact</DocLink>
          </LI>
        </UL>
      </div>
      <Switch>
        <Redirect exact from="/docs" to="/docs/api" />
        <Route exact path="/docs/dictionary" component={Dictionary} />
        <Route exact path="/docs/contact" component={Contact} />
        <Route exact path="/docs/api" render={() => <ApiDoc user={user} />} />
      </Switch>
    </DocsStyled>
  );
}

export default Docs;
