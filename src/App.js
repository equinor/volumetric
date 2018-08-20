import React from 'react';
import { LocationContainer } from './location/';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Switch } from 'react-router';
import { Dictionary } from './dictionary/';
import { ImportMetrics } from './import/';

const AppContainer = styled.div`
  margin-left: 50px;
  margin-right: 50px;
  margin-bottom: 50px;
`;

const AppHeader = styled.header`
  display: flex;
  flex-direction: row;
  padding: 0 20px;
  background-color: #222;
  color: white;
  min-height: 80px;
`;

const AppTitle = styled.h1`
  display: flex;
  align-items: center;
  font-size: 1.5em;
`;

const HeaderLink = styled(Link)`
  text-decoration: none;
  color: white;
  margin-right: 10px;

  :hover {
    text-decoration: underline;
  }
`;

const HeaderLinks = styled.div`
  align-self: flex-end;
  margin-left: auto;
  margin-bottom: 12px;
`;

const App = () => (
  <Router>
    <div>
      <AppHeader>
        <AppTitle>
          <HeaderLink to="/">Volumetric</HeaderLink>
        </AppTitle>
        <HeaderLinks>
          <HeaderLink to="dictionary">Dictionary</HeaderLink>
          <HeaderLink to="import">Import</HeaderLink>
        </HeaderLinks>
      </AppHeader>
      <AppContainer>
        <Switch>
          <Route exact path="/" component={LocationContainer} />
          <Route path="/dictionary" component={Dictionary} />
          <Route path="/import" component={ImportMetrics} />
        </Switch>
      </AppContainer>
    </div>
  </Router>
);

export default App;
