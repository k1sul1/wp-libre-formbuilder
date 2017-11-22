import React, { Component } from 'react';
import ErrorBoundary from './ErrorBoundary';

import Field from './FieldReborn';

export default class Aside extends Component {
  render() {
    const { fields } = this.props;
    console.log(this.props);
    return (
      <ErrorBoundary>
        <aside {...this.props}>
        {Object.entries(fields).map(([key, data]) => {
          return (
            <Field
              title={key}
              TagName={`input`}
              attributes={data.attributes}
              remove={() => false}
              key={key}
            />
          );
        })}
        </aside>
      </ErrorBoundary>
    );
  }
}
