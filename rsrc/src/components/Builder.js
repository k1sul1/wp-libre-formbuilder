import React, { Component } from 'react';
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
            available_fields: [...prev, {
                tagName: value.dom.element,
                attributes: value.dom.attributes,
                takesChildren: value.takesChildren,
              },
            ]
          }));

          // console.log(key, value);
          /* this.$set(this.fields, value.name, {
            attributes: value.dom.attributes,
            element: value.dom.element,
            takesChildren: value.takesChildren,
          }); */
        });
      })
      .catch(err => {
        throw err;
      });
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
      <div className={builderStyle.workbench}>
        Push into me
      </div>

      <aside className={builderStyle.sidebar}>
        {this.state.available_fields.map((field, key) => {
          // console.log(field);
          return <Field
            tagName={field.tagName}
            attributes={field.attributes}
            takesChildren={field.takesChildren}
            key={key}
          />
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
