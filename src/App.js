import React from 'react';
import { LocationContainer } from './location/';
import styled, { createGlobalStyle } from 'styled-components';
import { NavLink, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import { ImportMetrics, ImportNewCase } from './import/';
import { H1, H3 } from './common/Headers';
import Cases from './case/Cases';
import Docs from './docs/Docs';
import { ALMOST_BLACK, SELECTED_COLOR } from './common/variables';
import FieldRole from './field/FieldRole';
import { isCreator, useFieldValue } from './field/FieldContext';

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0 auto 25px;
    max-width: 1200px;
    font-family: Equinor-Regular, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    max-width: 1200px;
  }
`;

const AppHeader = styled.header`
  display: flex;
  flex-direction: column;
  color: ${ALMOST_BLACK};
  min-height: 80px;
  margin-bottom: 20px;
  padding-top: 10px;
`;

const AppTitle = styled(H1)`
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 24px;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
`;

const HeaderLink = styled(({ right, ...props }) => <NavLink {...props} />)`
  text-decoration: none;
  color: inherit;
  ${props => (props.right ? 'margin-left: 25px' : 'margin-right: 25px')};
  outline: none;
  padding-bottom: 5px;
`;

const HeaderLinks = styled.div`
  margin-left: auto;

  .active {
    border-bottom: 2px solid ${SELECTED_COLOR};
  }
`;

const UserInfo = styled.div`
  text-align: right;
  color: inherit;
  font-size: 14px;
  font-weight: 500;
  font-family: Equinor-Medium;
`;

const InnerHeader = styled.div`
  display: flex;
  align-items: flex-end;
`;

const NoMatch = ({ location }) => (
  <div>
    <H3>
      No match for <code>{location.pathname}</code>
    </H3>
  </div>
);

function App({ user }) {
  const [{ currentRole }] = useFieldValue();
  return (
    <React.Fragment>
      <GlobalStyle />
      <AppHeader>
        <UserInfo>{user.name}</UserInfo>
        <UserInfo>
          <FieldRole />
        </UserInfo>
        <InnerHeader>
          <AppTitle>
            <HeaderLink to="/">Volumetric</HeaderLink>
          </AppTitle>
          <HeaderLinks>
            <HeaderLink right exact to="/">
              Home
            </HeaderLink>
            {isCreator(currentRole) && (
              <HeaderLink right to="/cases">
                Manage cases
              </HeaderLink>
            )}
            <HeaderLink right to="/docs">
              Docs
            </HeaderLink>
          </HeaderLinks>
        </InnerHeader>
      </AppHeader>
      <Switch>
        <Route exact path="/" component={LocationContainer} />
        <Route path="/docs" component={Docs} />
        {isCreator(currentRole) && (
          <Route
            exact
            path="/cases/import"
            render={routerProps => <ImportMetrics {...routerProps} />}
          />
        )}
        {isCreator(currentRole) && (
          <Route
            exact
            path="/cases/import/new"
            render={routerProps => <ImportNewCase {...routerProps} />}
          />
        )}
        {isCreator(currentRole) && (
          <Route
            exact
            path="/cases"
            render={routerProps => <Cases {...routerProps} />}
          />
        )}
        <Route component={NoMatch} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
