import React, { Component } from 'react';
import PlotContainer from './plot/PlotContainer';
import styled from 'styled-components';

const AppContainer = styled.div`
  margin-left: 50px;
  margin-right: 50px;
`;


const AppHeader = styled.header`
  background-color: #222;
  height: 60px;
  padding: 5px;
  color: white;
  display: flex;
  justify-content: space-between;
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

          <PlotContainer/>
        </AppContainer>
      </div>
    );
  }
}

export default App;
