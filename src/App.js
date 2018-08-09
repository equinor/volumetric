import React, { Component } from 'react';
import LocationContainer from './location/LocationContainer';
import styled from 'styled-components';

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

class App extends Component {
  render() {
    return (
      <div>
        <AppHeader>
          <AppTitle>Volumetric</AppTitle>
        </AppHeader>
        <AppContainer>
        <LocationContainer/>
        </AppContainer>
      </div>
    );
  }
}

export default App;
