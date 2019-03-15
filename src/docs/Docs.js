import React, { useContext } from 'react';
import styled from 'styled-components';
import { NavLink, Redirect, Switch } from 'react-router-dom';
import { Dictionary } from './dictionary';
import { Contact } from './contact';
import { ApiDoc } from './ApiDoc';
import { Route } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { ALMOST_BLACK, SELECTED_COLOR } from '../common/variables';

const DocsStyled = styled.div`
  display: flex;
`;

const UL = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

const LI = styled.li`
  margin: 20px;

  .active {
    color: ${SELECTED_COLOR};
  }
`;

const SideBar = styled.div`
  margin-right: 50px;
`;

const DocLink = styled(NavLink)`
  text-decoration: none;
  color: ${ALMOST_BLACK};
  outline: none;
`;

function Docs() {
  const { user } = useContext(AuthContext);
  return (
    <DocsStyled>
      <SideBar>
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
      </SideBar>
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
