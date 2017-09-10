import React, { Component } from 'react';
import ReactHTMLParser from 'react-html-parser';

import fieldStyle from './Field.module.styl';

class Field extends Component {
  constructor() {
    super();

    this.state = {
    };

  }

  render() {
    const TagName = this.props.tagName;
    return (
      <div className={fieldStyle.wrapper} data-wplfbkey={this.props.wplfbKey}>
        <header className={` ${fieldStyle.header}`}>
          <span className={fieldStyle.header__name}>{this.name}</span>
          <div className={fieldStyle.header__tools}>
            <button className="remove" onClick={() => null}>
              &times;
            </button>
          </div>
        </header>
        <div className={fieldStyle.fieldWrapper}>
          {this.props.takesChildren
          ? <TagName {...this.props.attributes}>{ReactHTMLParser(this.props.children)}</TagName>
          : <TagName {...this.props.attributes} />
          }
        </div>
      </div>
    );
  }
}

export default Field;
