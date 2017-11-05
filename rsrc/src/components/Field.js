import React, { Component } from 'react';
import ReactHTMLParser from 'react-html-parser';
import shortid from 'shortid';

import fieldStyle from './Field.module.styl';

class Field extends Component {
  constructor() {
    super();

    this.state = {
      id: shortid.generate(),
    };

  }

  render() {
    const TagName = this.props.tagName;

    if (!TagName) {
      console.error('Something is wrong.', this.props);
      return false;
    }

    return (
      <div className={fieldStyle.wrapper} data-wplfbkey={this.props.wplfbKey} data-id={this.props.id}>
        <style>{`.wplfb-child-container { background: #ccc }`}</style>
        <header className={` ${fieldStyle.header}`}>
          <span className={fieldStyle.header__name}>{this.name}</span>
          <span style={{ textAlign: 'center' }}>{this.props.id}</span>

          <div className={fieldStyle.header__tools}>
            <button className="remove" onClick={() => null}>
              &times;
            </button>
          </div>
        </header>
        <div className={`${fieldStyle.fieldWrapper} fieldWrapper`}>
          {TagName !== 'input'
          ? <TagName {...this.props.attributes}>
            {ReactHTMLParser(this.props.field.childrenHTML)}
            {this.props.children}
            </TagName>
            : <TagName {...this.props.attributes} />
          }
        </div>
      </div>
    );
  }
}

export default Field;
