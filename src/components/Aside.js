import React, { Component } from 'react';
import ErrorBoundary from './ErrorBoundary';

export default class Aside extends Component {
  render() {
    return (
      <ErrorBoundary>
        <aside {...this.props}>

        </aside>
      </ErrorBoundary>
    );
  }
}
