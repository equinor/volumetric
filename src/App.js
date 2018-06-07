import React, { Component } from 'react';
import './App.css';
import PlotContainer from './plot/PlotContainer';
import styled from 'styled-components';

const AppContainer = styled.div`
  margin-left: 50px;
  margin-right: 50px;
`;

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Volumetric</h1>
        </header>
        <AppContainer>
          <p className="App-intro">Vælkommin t volumetric.</p>
          <PlotContainer />
        </AppContainer>
      </div>
    );
  }
}

export default App;
