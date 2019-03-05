import React from 'react';
import { LocationContainer } from './location/';
import styled from 'styled-components';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import { Dictionary } from './dictionary/';
import { Contact } from './contact/';
import { ApiDoc } from './ApiDoc/';
import { ImportMetrics } from './import/';
import { AuthConsumer } from './auth/AuthContext';
import ImportNewCaseContainer from './import/ImportNewCaseContainer';
import { H3 } from './common/Headers';

const AppContainer = styled.div`
  margin: 0 50px 25px;
`;

const AppHeader = styled.header`
  display: flex;
  flex-direction: row;
  padding: 0 20px;
  background-color: #222;
  color: white;
  min-height: 80px;
  justify-content: space-between;
`;

const AppTitle = styled.h1`
  display: flex;
  align-items: center;
  font-size: 1.5em;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
`;

const HeaderLink = styled(Link)`
  text-decoration: none;
  color: white;
  margin-right: 25px;

  :hover {
    text-decoration: underline;
  }
`;

const HeaderLinks = styled.div`
  align-self: flex-end;
  margin-left: auto;
  margin-bottom: 12px;
`;

const UserInfo = styled.h5`
  text-align: right;
  text-decoration: none;
  color: white;
  margin-right: 10px;
`;

const NoMatch = ({ location }) => (
  <div>
    <H3>
      No match for <code>{location.pathname}</code>
    </H3>
  </div>
);

const App = () => (
  <AuthConsumer>
    {({ user }) => (
      <Router>
        <React.Fragment>
          <AppHeader>
            <AppTitle>
              <HeaderLink to="/">Volumetric</HeaderLink>
            </AppTitle>
            <div>
              <UserInfo>{user.name}</UserInfo>
              <HeaderLinks>
                {user.isCreator && <HeaderLink to="/import">Import</HeaderLink>}
                <HeaderLink to="/contact">Contact</HeaderLink>
                <HeaderLink to="/api-doc">API</HeaderLink>
                <HeaderLink to="/dictionary">Dictionary</HeaderLink>
              </HeaderLinks>
            </div>
          </AppHeader>
          <AppContainer>
            <Switch>
              <Route exact path="/" component={LocationContainer} />
              <Route exact path="/dictionary" component={Dictionary} />
              <Route exact path="/contact" component={Contact} />
              <Route
                exact
                path="/api-doc"
                render={() => <ApiDoc user={user} />}
              />
              {user.isCreator && (
                <Route
                  exact
                  path="/import"
                  render={routerProps => <ImportMetrics {...routerProps} />}
                />
              )}
              {user.isCreator && (
                <Route
                  exact
                  path="/import/new"
                  render={routerProps => (
                    <ImportNewCaseContainer {...routerProps} />
                  )}
                />
              )}
              <Route component={NoMatch} />
            </Switch>
          </AppContainer>
        </React.Fragment>
      </Router>
    )}
  </AuthConsumer>
);

export default App;
