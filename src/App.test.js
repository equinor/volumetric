import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { MockAuthConsumer, MockAuthProvider } from './auth/MockAuthContext';
import { LocationContainer } from './location/';
import styled from 'styled-components';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import { Dictionary } from './dictionary/';
import { Contact } from './contact/';
import { ApiDoc } from './ApiDoc/';
import { ImportMetrics } from './import/';
import ImportStatus from './import/ImportStatus';

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

it('renders without crashing', () => {
  ReactDOM.render(
    <MockedProvider addTypename={true}>
      <MockAuthProvider>
        <MockAuthConsumer>
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
                      {user.isCreator && (
                        <HeaderLink to="import">Import</HeaderLink>
                      )}
                      <HeaderLink to="contact">Contact</HeaderLink>
                      <HeaderLink to="api-doc">API</HeaderLink>
                      <HeaderLink to="dictionary">Dictionary</HeaderLink>
                    </HeaderLinks>
                  </div>
                </AppHeader>
                <AppContainer>
                  <Switch>
                    <Route exact path="/" component={LocationContainer} />
                    <Route path="/dictionary" component={Dictionary} />
                    <Route path="/contact" component={Contact} />
                    <Route
                      path="/api-doc"
                      render={() => <ApiDoc user={user} />}
                    />
                    {user.isCreator && (
                      <Route
                        path="/import"
                        render={routerProps => (
                          <ImportMetrics {...routerProps} />
                        )}
                      />
                    )}
                  </Switch>
                </AppContainer>
                <ImportStatus user={user.shortName} />
              </React.Fragment>
            </Router>
          )}
        </MockAuthConsumer>
      </MockAuthProvider>
    </MockedProvider>,
    document.createElement('div'),
  );
});
