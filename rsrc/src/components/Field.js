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
    const TagName = this.props.field.tagName;

    if (!TagName) {
      console.error('Something is wrong.', this.props);
      return false;
    }

    return (
      <div className={fieldStyle.wrapper} data-id={this.props.field.id}>
        <style>{`.wplfb-child-container { background: #ccc }`}</style>
        <header className={` ${fieldStyle.header}`}>
          <span className={fieldStyle.header__name}>{this.name}</span>
          <span style={{ textAlign: 'center' }}>{this.props.field.id}</span>

          <div className={fieldStyle.header__tools}>
            <button className="remove" onClick={() => null}>
              &times;
            </button>
          </div>
        </header>
        <div className={`${fieldStyle.fieldWrapper} fieldWrapper`}>
          {TagName !== 'input'
          ? <TagName {...this.props.attributes}>
              <div className="wplfb-child-container">
                {ReactHTMLParser(this.props.field.childrenHTML)}
                {this.props.children}
              </div>
            </TagName>
            : <TagName {...this.props.field.attributes} />
          }
        </div>
      </div>
    );
  }
}

export default Field;
