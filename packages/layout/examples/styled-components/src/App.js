import { add, calc, rem } from '@carbon/layout';
import React, { Component } from 'react';
import styled from 'styled-components';
import logo from './logo.svg';
import './App.css';

const Header = styled.header({
  fontSize: rem(3),
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer">
            Learn React
          </a>
        </Header>
      </div>
    );
  }
}

export default App;
