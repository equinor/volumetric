import React, { Component } from 'react';
import LocationContainer from './location/LocationContainer';
import styled from 'styled-components';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import Dictionary from './dictionary/Dictionary';

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

const HeaderLink = styled.a`
  text-decoration: none;
  color: white;
`;

const HeaderLinks = styled.div`
  align-self: flex-end;
  margin-left: auto;
  margin-bottom: 12px;
`;

class App extends Component {
  render() {
    return (
      <div>
        <AppHeader>
          <AppTitle>
            <HeaderLink href="/">Volumetric</HeaderLink>
          </AppTitle>
          <HeaderLinks>
            <HeaderLink href="dictionary">Dictionary</HeaderLink>
          </HeaderLinks>
        </AppHeader>
        <AppContainer>
          <Router>
            <Switch>
              <Route exact path="/" component={LocationContainer} />
              <Route path="/dictionary" component={Dictionary} />
            </Switch>
          </Router>
        </AppContainer>
      </div>
    );
  }
}

export default App;
