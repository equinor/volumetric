import React, {Component} from 'react';
import {LocationSelector} from './plot/locationSelector';
import styled from 'styled-components';
import VisContainer from './plot/VisContainer';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';

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
                    <Router>
                        <div>
                            <Redirect from="/" to="/location"/>
                            <Route path="/location" component={LocationSelector}/>
                            <Route path="/location/:locationId" component={VisContainer}/>
                        </div>
                    </Router>
                </AppContainer>
            </div>
        );
    }
}

export default App;
