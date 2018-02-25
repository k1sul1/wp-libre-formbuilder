import React, { Component } from 'react';
import ErrorBoundary from './ErrorBoundary';

import Field from './FieldReborn';

export default class Aside extends Component {
  render() {
    const { fields } = this.props;
    return (
      <ErrorBoundary>
        <aside {...this.props}>
        {Object.entries(fields).map(([key, data]) => {
          return (
            <Field
              TagName={`input`}
              title={key}
              attributes={data.attributes}
              remove={() => false}
              key={key}
              _key={key}
              parent={this}
            />
          );
        })}
        </aside>
      </ErrorBoundary>
    );
  }
}
