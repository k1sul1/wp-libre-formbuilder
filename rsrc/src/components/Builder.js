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
      selected_form: undefined,
      tree: {},
    };

    this.REST_URL = window.location.port !== 80 || window.location.port !== 443
      ? window.REST_URL
      : ''; // Not required.
  }

  changeForm(e) {
    const select = e.target;
    const form_id = parseInt(select.value, 10);

    this.setState((prev) => ({
      selected_form: form_id
    }));

    this.loadForm(form_id);
  }

  loadForm(form_id = undefined) {
    if (!form_id) return false;
    fetch(`${this.REST_URL}/wp-json/wplfb/forms?form_id=${form_id}`)
      .then(r => r.json())
      .then(r => {
        //
      })
      .catch(err => {
        throw err;
      });
  }

  componentWillMount() {
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
                childrenHTML: value.dom.children_html,
                wplfbKey: value.wplfbKey,
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
    const workbench = this.workbench;
    const sidebar = this.sidebar;

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

    let startedDragFromSidebar = false;

    dragulas.sidebar.on('drag', () => {
      startedDragFromSidebar = true;
    });

    dragulas.workbench.on('drag', () => {
      // console.log('drag');
    });

    dragulas.workbench.on('drop', () => {
      // console.log('drop');
    });

    dragulas.sidebar.on('drop', () => {
      if (startedDragFromSidebar) {
        console.log('Dropped field from sidebar');
        startedDragFromSidebar = false;
      }
    });

    this.setState(prev => ({dragulas}));
  }

  enableDragInChild() {
    console.log(this.state).bind(this);
  }

  render() {
    return (
      <div className={builderStyle.wrapper}>
        <header className={builderStyle.header}>
          <select name="form"
            onChange={(e) => this.changeForm(e)}
            ref={(el) => { this.formselect = el }}
          >
            {this.state.available_forms.map((form, i) => (
            <option value={form.form.ID} key={i}>
              {form.form.post_name}
            </option>
            ))}
          <option value="0">New</option>
        </select>
      </header>
      <div
        className={builderStyle.workbench}
        ref={(el) => { this.workbench = el }}
      ></div>

      <aside
        className={builderStyle.sidebar}
        ref={(el) => { this.sidebar = el }}
      >
        {this.state.available_fields.map((field) => {
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
            key={field.wplfbKey}
            wplfbKey={field.wplfbKey}
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
