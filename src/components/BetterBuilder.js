import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import App from './App';
import Aside from './Aside';
import { getFields } from '../lib/wp';
import errorHandler from '../lib/errorHandler';
import './Builder.styl'

@DragDropContext(HTML5Backend)
export default class BetterBuilder extends Component {
  classes = {
    wrapper: 'builder__wrapper',
    header: 'builder__header',
    workbench: 'builder__workbench',
    sidebar: 'builder__sidebar',
  }

  async componentDidMount() {
    const fields = await getFields().catch(errorHandler.fatal);

    console.log(fields);
  }

  render() {
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
          Save
        </button>

      </header>
      <div
        className={this.classes.workbench}
        ref={(el) => { this.workbench = el }}>
      </div>

        <Aside className={this.classes.sidebar} />
        <App />
      </div>
    );
  }
}
