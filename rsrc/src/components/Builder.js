import React, { Component } from 'react';
import Dragula from 'react-dragula';
import shortid from 'shortid';
import { el } from 'redom';

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

  generateHTML() {
    const tree = this.state.tree;
    const ids = Object.keys(tree);

    const nodes = ids.map((id) => {
      const field = tree[id];
      console.log(field, id, this.state.tree);
      const element = el(field.fdata.tagName, {
        ...field.fdata.attributes,
        'data-wplfb-id': id,
      });

      if (field.fdata.childrenHTML) {
        element.innerHTML = field.fdata.childrenHTML; // Sorry.
      }

      return element;
    });
    const root = el('.wplfb-wrapper');

    nodes.forEach((node) => {
      const id = node.getAttribute('data-wplfb-id');
      const field = tree[id];

      if (!field.parent) {
        root.appendChild(node);
      } else {
        const parent = nodes.find((n) => n.getAttribute('data-wplfb-id') === field.parent);

        if (parent) {
          parent.appendChild(node);
        } else {
          console.log('Figure out why node has no parent even though it should have.');
        }
      }
    });

    return root.innerHTML;
  }

  saveForm() {
    const body = JSON.stringify({
      fields: this.state.tree,
      html: this.generateHTML(),
      form_id: this.state.selected_form,
    });

    fetch(`${this.REST_URL}/wp-json/wplfb/forms/form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
      })
      .catch((err) => {
        throw err;
      })
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
        this.setState({
          tree: r.fields,
        });
      })
      .catch(err => {
        throw err;
      });
  }

  componentWillMount() {
    fetch(`${this.REST_URL}/wp-json/wplfb/forms/forms`)
      .then(r => r.json())
      .then(available_forms => {
        this.setState({
          available_forms,
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
              id: shortid.generate(),
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
    const drake = Dragula([workbench, sidebar], {
      isContainer(el) {
        if (el.classList.contains('wplfb-child-container')) {
          return true;
        }

        return false;
      },
      copy(el, source) {
        if (source === sidebar) {
          return true;
        }

        return false;
      },
      accepts(el, target, source, sibling) {
        if (source === sidebar && target.closest(`.${builderStyle.sidebar}`)) {
          return false;
        }

        if (target.classList.contains('wplfb-child-container')) {
          return true;
        }  else if (target === workbench) {
          return true;
        }

        return false;
      },

      moves(el, source, handle, sibling) {
        if (handle.classList.contains(fieldStyle.header)) {
          return true;
        }

        return false;
      },
    });

    drake.on('drop', (el, target, source, sibling) => {
      if (!target) {
        return false;
      }

      if (target !== this.workbench) {
        if (target.closest(`.${builderStyle.workbench}`)) {
        } else {
          return false;
        }
      }

      if (!el.classList.contains(fieldStyle.wrapper)) {
        el = el.children[0]; // Hack, remove.
      }

      const childContainer = el.querySelector('.wplfb-child-container');
      const id = el.getAttribute('data-id');
      let isRoot = target === this.workbench;
      const children = childContainer ? childContainer.children : [];

      if (sibling) {
        // put into correct place
      } else {
        // still do so
      }

      this.setState((prev) => {
        let tree = Object.assign({}, prev.tree);
        let parent = false;
        const exists = Boolean(tree[id]);
        const field = exists ? tree[id] : this.state.available_fields
          .find((field) => field.id === el.getAttribute('data-id'));

        if (exists) {
          console.log('existing field', field);
          parent = field.parent;

          if (parent) {
            // check if there's a parent (in state)
            // first check if the parent is what state says it is

            let parentEl = el.closest(`[data-id="${parent}"]`);

            if (!parentEl) {
              // According to state, the field has a parent, but the parent
              // isn't what the state thinks it is

              // do we have a parent, or are we at root?
              parentEl = el.parentNode.closest(`.${fieldStyle.wrapper}`);
              if (parentEl) {
                console.log('parent', parentEl);

                tree[parent].children.splice(
                  tree[parent].children.indexOf(id),
                  1
                );
                parent = parentEl.getAttribute('data-id');
                tree[parent].children.push(id);

                isRoot = false;
              } else {
                console.log('root');
                tree[parent].children.splice(
                  tree[parent].children.indexOf(id),
                  1
                );
                parent = false;
                isRoot = true;
              }
            } else if (parentEl) {
              const oldParent = parent;
              parent = parentEl.getAttribute('data-id');
              console.log(parent === oldParent);

              tree[parent].children.push(id);
            } else {
              console.log('this should not happen');
            }
          } else {
            // no parent, should there be?
            let parentEl = el.parentNode.closest(`.${fieldStyle.wrapper}`);
            if (parentEl) {
              // parent found!
              parent = parentEl.getAttribute('data-id');
              isRoot = false;

              console.log('found a parent', parent);
              if (tree[parent]) {
                tree[parent].children.push(id);
              }
            } else {
              // no parent found in dom, in root?
              console.log('this should not happen either');
            }
          }
        } else {
          let parentEl = el.parentNode.closest(`.${fieldStyle.wrapper}`);
          if (!parentEl) {
            isRoot = true;
          } else {
            isRoot = false;
            parent = parentEl.getAttribute('data-id');

            if (tree[parent]) {
              // Might've to deal with ordering later in life
              tree[parent].children.push(id);
            }
          }
        }

        const node = {
          id: id,
          isRoot,
          options: {},
          parent,
          children: Array.from(children).filter((child) => child.getAttribute('data-id') ? true : false),
          field, // remove
          fdata: field,
        };

        return {
          tree: {
            ...tree,
            [id]: node,
          },
        };
      }, () => {
        // Generate new IDs, for all because it's easier
        el.remove();
        const fields = this.state.available_fields;
        this.setState({
          available_fields: fields.map((field) => {
            return {
              ...field,
              id: shortid.generate(),
            };
          }),
        });
      });
    });

  }


  buildField (field, children) {
    if (!field) {
      return false;
    }

    return (
      <Field field={field} key={field.id}>
      <div> {/* Useless div, only wraps wplf-child-container */}
      {
        children.map((id) => {
          const value = this.state.tree[id];

          return this.buildField(value.field, value.children);
        })
      }
      </div>
      </Field>
    )
  };

  render() {
    const restoreState = () => {
      if (this.state.selected_form) {
        return Object.keys(this.state.tree).map((id) => {
          const value = this.state.tree[id];
          const field = value.field;

          if (value.parent) {
            return;
          }

          return this.buildField(field, value.children);
        })
      }

      return;
    };
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
        ref={(el) => { this.workbench = el }}>
        {restoreState()}
      </div>

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

        return this.buildField(field, []);
      })}
    </aside>
  </div>
    );
  }

}

export default Builder;
