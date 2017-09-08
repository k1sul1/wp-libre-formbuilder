import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dragula from 'react-dragula';

import Field from './Field';

import builderStyle from './Builder.module.styl';

class Builder extends Component {
  constructor() {
    super();

    this.state = {
      available_forms: [],
      available_fields: [],
    };

    this.REST_URL = window.location.port !== 80 || window.location.port !== 443
      ? window.REST_URL
      : ''; // Not required.
  }

  changeForm(e) {
    console.log(e);
  }

  componentWillMount() {
    console.log(this.REST_URL, this.state);
    fetch(`${this.REST_URL}/wp-json/wplfb/forms/forms`)
      .then(r => r.json())
      .then(r => {
        r.forEach(form => {
          this.setState(prev => ({
            available_forms: [...prev, form]
          }))
        });
      })
      .catch(err => {
        throw err;
      });

    fetch(`${this.REST_URL}/wp-json/wplfb/fields`)
      .then(r => r.json())
      .then(r => {
        Object.keys(r.fields).forEach(key => {
          const value = r.fields[key];

          this.setState(prev => ({
            available_fields: [...prev.available_fields, {
                tagName: value.dom.element,
                attributes: value.dom.attributes,
                takesChildren: value.takesChildren,
                childrenHTML: value.dom.children_html
              },
            ]
          }));
        });
      })
      .catch(err => {
        throw err;
      });
  }

  componentDidMount() {
    const workbench = this.refs.workbench;
    const sidebar = this.refs.sidebar;

    const sharedOptions = {
      // moves(el, container, target) {
        // return target.classList.contains('handle');
      // },
    };

    const workbenchOptions = Object.assign({}, sharedOptions, {

    });

    const sidebarOptions = Object.assign({}, sharedOptions, {
      isContainer(el) {
        if (el === workbench) {
          return true;
        } else if (el.classList.contains('wplfb-child-container')) {
          return true;
        }

        return false;
      },

      accepts(el, target, source, sibling) {
        if (source === workbench) {
          return false;
        }

        return true;
      },

      copy: true
    });

    const dragulas = {
      workbench: Dragula([workbench], workbenchOptions),
      sidebar: Dragula([sidebar], sidebarOptions),
    };

    this.setState(prev => ({dragulas}));
  }

  enableDragInChild() {
    console.log(this.state).bind(this);
  }

  render() {
    return (
      <div className={builderStyle.wrapper}>
        <header className={builderStyle.header}>
          <select name="form" onChange={(e) => this.changeForm(e)}>
            {this.state.available_forms.map((form, i) => (
            <option value={form.form.ID} key={i}>
              {form.form.post_name}
            </option>
            ))}
          <option value="0">New</option>
        </select>
      </header>
      <div className={builderStyle.workbench} ref="workbench"></div>

      <aside className={builderStyle.sidebar} ref="sidebar">
        {this.state.available_fields.map((field, key) => {

          if (field.attributes.class) {
            field.attributes.className = field.attributes.class;
            delete field.attributes.class;
          }

          if (field.attributes.for) {
            field.attributes.htmlFor = field.attributes.for;
            delete field.attributes.for;
          }

          return <Field
            tagName={field.tagName}
            attributes={field.attributes}
            takesChildren={field.takesChildren}
            key={key}
            key2={key}
            dragulas={this.state.dragulas}
          >
            {field.childrenHTML}
          </Field>;
        })}
      </aside>
    </div>
    );
  }

  dragulaDecorator(componentBackingInstance) {
    const options = {};
    Dragula([componentBackingInstance], options);
  }
}

export default Builder;
