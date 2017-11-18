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
    console.log(this.props);
    // const TagName = this.props.fdata.tagName || this.props.fdata.fdata.tagName; // Flatten it...
    const TagName = this.props.fdata.tagName;

    if (!TagName) {
      console.error('Something is wrong.', this.props);
      return false;
    }

    return (
      <div className={fieldStyle.wrapper} data-id={this.props.fdata.id}>
        <style>{`.wplfb-child-container { background: #ccc }`}</style>
        <header className={` ${fieldStyle.header}`}>
          <span className={fieldStyle.header__name}>{this.name}</span>
          <span style={{ textAlign: 'center' }}>{this.props.fdata.id}</span>

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
                {ReactHTMLParser(this.props.fdata.childrenHTML)}
                {this.props.children}
              </div>
            </TagName>
            : <TagName {...this.props.fdata.attributes} />
          }
        </div>
      </div>
    );
  }
}

export default Field;
