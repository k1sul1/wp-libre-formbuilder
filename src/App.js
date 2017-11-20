import React, { Component } from 'react';
import BetterBuilder from './components/BetterBuilder';
// import Builder from './components/Builder';

import 'normalize.css'
import './App.styl';

class App extends Component {
  render() {
    return (
      <BetterBuilder />
    );

    // return <Builder />;
  }
}

export default App;
