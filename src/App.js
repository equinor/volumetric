import React, { Component } from "react";
import "./App.css";
import Hello from './Hello';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Volumetric</h1>
        </header>
        <p className="App-intro">Vælkommin t volumetric.</p>
        <Hello />
      </div>
    );
  }
}

export default App;
