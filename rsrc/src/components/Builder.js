import React, { Component } from 'react';
import Dragula from 'react-dragula';

import Field from './Field';

import builderStyle from './Builder.module.styl';
import fieldStyle from './Field.module.styl';

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

  saveForm() {
    if (this.state.selected_form) {
      fetch(`${this.REST_URL}/wp-json/wplfb/forms/form?form_id=${this.state.selected_form}`, {
        method: 'POST',
        body: JSON.stringify({
          fields: this.state.tree,
          form_id: this.state.selected_form,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          console.log(r);
        })
        .catch((err) => {
          throw err;
        })
    } else {
      // notify
    }
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
    fetch(`${this.REST_URL}/wp-json/wplfb/forms/form?form_id=${form_id}`)
      .then(r => r.json())
      .then(r => {
        console.log('yep');
        console.log(r);;
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
      isContainer(el) {
        if (el === workbench) {
          return true;
        } else if (el.classList.contains('wplfb-child-container')) {
          return true;
        }

        return false;
      },

      accepts(el, target, source, sibling) {
        if (target === source) {
          return false;
        }

        if (target.closest(`#${el.id}`)) {
          return false;
        }

        if (source === workbench) {
          if (target.classList.contains('wplfb-child-container')) {
            return true;
          }

          return false;
        } else if (!el.classList.contains(fieldStyle.wrapper)) {
          return false;
        }

        return true;
      },

      invalid(el, handle) {
        if (!handle.classList.contains(fieldStyle.header)) {
          return true;
        }

        return false;
      },
    };

    const workbenchOptions = Object.assign({}, sharedOptions, {
      copy: false,
    });

    const sidebarOptions = Object.assign({}, sharedOptions, {
      copy: true,
    });

    const dragulas = {
      workbench: Dragula([workbench], workbenchOptions),
      sidebar: Dragula([sidebar], sidebarOptions),
    };


    Object.keys(dragulas).forEach((d) => {
      dragulas[d].on('drop', (el, target, source, sibling) => {
        if (!target) {
          return false;
        }
        // console.log('Dropped field from sidebar');
        if (target !== this.workbench) {
          console.log('target not workbench');
          if (target.closest(`.${builderStyle.workbench}`)) {
            console.log('target is child of workbench');
          } else {
            return false;
          }
        }

        const childContainer = el.querySelector('.wplfb-child-container');
        const id = el.id;
        const isRoot = target === this.workbench;
        const children = childContainer ? childContainer.children : [];

        if (sibling) {
          // put into correct place
        } else {
          // still do so
        }

        const oldEl = source.querySelector(`#${id}`);

        this.setState((prev) => {
          let tree = prev.tree;
          let parent;
          const exists = Boolean(tree[id]);
          const field = exists ? tree[id] : this.state.available_fields
            .find((field) => field.wplfbKey === el.getAttribute('data-wplfbkey'));

          if (oldEl) {
            delete tree[oldEl.id];
            Object.keys(tree).forEach((key) => {
              let childIndex = tree[key].children.indexOf(oldEl.id)
              if (childIndex > -1) {
                console.log('found id from children', key);
                tree[key].children.splice(childIndex, 1);
              }
            });
            oldEl.remove();
          }

          if (!isRoot && el.parentNode) {
            console.log('not root', target);
            const parentEl = el.parentNode.closest(`.${fieldStyle.wrapper}`);
            parent = parentEl.id || false;

            console.log(parent, tree[parent], tree);

            if (tree[parent]) {
              tree[parent].children.push(id);
            }
          }

          const node = {
            id: id,
            isRoot,
            options: {},
            parent,
            children: Array.from(children).filter((child) => child.id ? true : false),
            field,
          };

          console.log(node);
          return {
            tree: {
              [id]: node,
              ...tree,
            },
          };
        });
      });
    });

    this.setState(prev => ({dragulas}));
  }

  buildTree() {
    const tree = {};

    return tree;
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
        <button onClick={() => this.saveForm()}>
          Save
        </button>

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
