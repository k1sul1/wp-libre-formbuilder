import React, { Component } from 'react';

import fieldStyle from './Field.module.styl';

class Field extends Component {
  constructor() {
    super();

    this.state = {
    };

  }

  componentWillMount() {
  }

  render() {
    const options = {
      group: {
        name: 'fields',
        put: true
      }
    };
    const children = this.takesChildren
      ? (
        false
        /* <draggable
          className={fieldStyle.__children"
          options={options}
          { ... { on: { move: this.moveHandler, end: this.endHandler } } }
        >
          {this.$slots.default}
        </draggable> */
      )
      : false;

    // proposed: https://github.com/vuejs/Discussion/issues/292
    // const attributes = JSON.parse(JtakesChildrenthis.attributes));

    // console.log(this.props.attributes);
    // Less hacky.
    /* const attributes = Object.keys(this.props.attributes).reduce((attrs, key) => {
      const value = this.attributes[key];
      return { ...attrs, [key]: value };
    }, {}); */

    // console.log(this.props);
    const TagName = this.props.tagName;

    const element = (
      <div className={fieldStyle.wrapper}>
        <header className={fieldStyle.header}>
          <span className={fieldStyle.header__name}>{this.name}</span>
          <div className={fieldStyle.header__tools}>
            <button className="remove" onClick={() => null}>
              &times;
            </button>
          </div>
        </header>
        <div className={fieldStyle.fieldWrapper}>
          <TagName
            {...this.props.attributes}
          >
            {this.props.children}
          </TagName>
        </div>
      </div>
    );

    // element.fieldData = { name: this.name, data: this.fieldData };
    // console.log(element);

    return element;
  }

}

export default Field;
