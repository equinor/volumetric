import React, { Component } from 'react';
import LocationContainer from './location/LocationContainer';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

const AppContainer = styled.div`
  margin-left: 50px;
  margin-right: 50px;
  margin-bottom: 50px;
`;

const AppHeader = styled.header`
  display: flex;
  padding: 10px 20px;
  background-color: #222;
  color: white;
`;

const AppTitle = styled.h1`
  font-size: 1.5em;
`;

const NoMatch = ({ location }) => (
  <div>
    <h3>
      No match for <code>{location.pathname}</code>
    </h3>
  </div>
);

class App extends Component {
  render() {
    return (
      <div>
        <AppHeader>
          <AppTitle>Volumetric</AppTitle>
        </AppHeader>
        <AppContainer>
          <Router>
            <Switch>
              <Redirect exact from="/" to="/location" />
              <Route
                path="/location/:locationId?"
                render={props => <LocationContainer {...props} />}
              />
              <Route component={NoMatch} />
            </Switch>
          </Router>
        </AppContainer>
      </div>
    );
  }
}

export default App;
