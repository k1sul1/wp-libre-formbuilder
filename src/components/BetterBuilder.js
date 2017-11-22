import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PropTypes from 'prop-types'
import { kea } from 'kea'

import Aside from './Aside';
import { getFields } from '../lib/wp';
import errorHandler from '../lib/errorHandler';
import './Builder.styl'

@DragDropContext(HTML5Backend)
@kea({
  actions: () => ({
    increment: (amount) => ({ amount }),
    decrement: (amount) => ({ amount }),
    addField: (field) => ({ ...field }),
  }),

  reducers: ({ actions }) => ({
    counter: [0, PropTypes.number, {
      [actions.increment]: (state, payload) => state + payload.amount,
      [actions.decrement]: (state, payload) => state - payload.amount,
    }],
    fields: [{}, PropTypes.object, {
      [actions.addField]: (state, payload) => {
        return {
          ...state,
          ...payload,
        }
      },
    }]
  }),

  selectors: ({ selectors }) => ({
    doubleCounter: [
      () => [selectors.counter],
      (counter) => counter * 2,
      PropTypes.number
    ]
  })
})
export default class BetterBuilder extends Component {
  classes = {
    wrapper: 'builder__wrapper',
    header: 'builder__header',
    workbench: 'builder__workbench',
    sidebar: 'builder__sidebar',
  }

  async componentDidMount() {
    const fields = await getFields().catch(errorHandler.fatal);

    Object.entries(fields).forEach(([key, data]) => {
      this.actions.increment(1);
      this.actions.addField({
        [key]: data,
      });
    });
  }


  render() {
    const { counter, fields } = this.props
      // const { increment, decrement } = this.actions

      return (
      <div className={this.classes.wrapper}>
        <header className={this.classes.header}>
          <select name="form"
            onChange={(e) => this.changeForm(e)}
            ref={(el) => { this.formselect = el }}
          >
            <option value="0">New</option>
          </select>
        <button onClick={() => this.saveForm()}>
          Save {counter}
        </button>

      </header>
      <div
        className={this.classes.workbench}
        ref={(el) => { this.workbench = el }}>
      </div>

        <Aside className={this.classes.sidebar} fields={fields} />
      </div>
    );
  }
}
