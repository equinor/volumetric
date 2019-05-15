import React, { useContext } from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { MockAuthConsumer, MockAuthProvider } from './auth/MockAuthContext';
import { LocationContainer } from './location/';
import styled, { createGlobalStyle } from 'styled-components';
import {
  BrowserRouter as Router,
  Link,
  NavLink,
  Route,
} from 'react-router-dom';
import { Switch } from 'react-router';
import { ImportMetrics, ImportNewCase } from './import/';
import { AuthContext } from './auth/AuthContext';
import Cases from './case/Cases';
import Docs from './docs/Docs';
import FieldRole from './field/FieldRole';
import { FieldProvider } from './field/FieldContext';
import { ALMOST_BLACK, SELECTED_COLOR } from './common/variables';
import { H1, H3 } from './common/Headers';

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

it('renders without crashing', () => {
  // const {user} = useContext(AuthContext);
  const initialState = {
    currentField: 'Snorre',
    roles: [{ field: 'Snorre', role: 'fieldadmin' }],
  };
  const reducer = (state, action) => {
    return {
      initialState,
    };
  };

  ReactDOM.render(
    <MockedProvider addTypename={true}>
      <MockAuthProvider>
        <MockAuthConsumer>
          {({ user }) => (
            <Router>
              <FieldProvider initialState={initialState} reducer={reducer}>
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
                        {user.isCreator && (
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
                    {user.isCreator && (
                      <Route
                        exact
                        path="/cases/import"
                        render={routerProps => (
                          <ImportMetrics {...routerProps} />
                        )}
                      />
                    )}
                    {user.isCreator && (
                      <Route
                        exact
                        path="/cases/import/new"
                        render={routerProps => (
                          <ImportNewCase {...routerProps} />
                        )}
                      />
                    )}
                    {user.isCreator && (
                      <Route
                        exact
                        path="/cases"
                        render={routerProps => <Cases {...routerProps} />}
                      />
                    )}
                    <Route component={NoMatch} />
                  </Switch>
                </React.Fragment>
              </FieldProvider>
            </Router>
          )}
        </MockAuthConsumer>
      </MockAuthProvider>
    </MockedProvider>,
    document.createElement('div'),
  );
});
