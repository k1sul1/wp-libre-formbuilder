import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
// import PropTypes from 'prop-types'
import { connect } from 'kea'

import builderLogic from './builder-logic'
import Workbench from './Workbench'
import Aside from './Aside'
import { getFields, getForms } from '../lib/wp'
import errorHandler from '../lib/errorHandler'
import './Builder.styl'

@DragDropContext(HTML5Backend)
@connect({
  actions: [
    builderLogic, [
      'increment',
      'decrement',
      'addField',
      'addForm',
    ]
  ],
  props: [
    builderLogic, [
      'counter',
      'fields',
      'forms',
      'tree',
    ],
  ]
})
export default class BetterBuilder extends Component {
  classes = {
    wrapper: 'builder__wrapper',
    header: 'builder__header',
    workbench: 'builder__workbench',
    sidebar: 'builder__sidebar',
  }

  async componentDidMount() {
    const fields = await getFields().catch(errorHandler.fatal)
    const forms = await getForms().catch(errorHandler.fatal)

    Object.entries(fields).forEach(([key, data]) => {
      this.actions.increment(1)
      this.actions.addField({
        [key]: data,
      })
    })

    forms.forEach(f => {
      const { form, fields } = f
      this.actions.addForm({
        [`${form.post_title} (${form.ID})`]: {
          form,
          fields,
        },
      })
    })
  }


  render() {
    const { counter, fields, tree, forms } = this.props
      // const { increment, decrement } = this.actions
      console.log(forms)

      return (
      <div className={this.classes.wrapper}>
        <header className={this.classes.header}>
          <select name="form"
            onChange={(e) => this.changeForm(e)}
            ref={(el) => { this.formselect = el }}
          >
            {Object.entries(forms).map(([name, data]) => (
              <option value={data.form.ID} key={data.form.ID}>{name}</option>
            ))}
            <option value="0">New</option>
          </select>
          <button onClick={() => this.saveForm()}>
            Save {counter}
          </button>
        </header>

        <Workbench className={this.classes.workbench} tree={tree} />
        <Aside className={this.classes.sidebar} fields={fields} />
      </div>
    )
  }
}
