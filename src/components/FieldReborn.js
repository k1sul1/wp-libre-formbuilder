import React from 'react';
import PropTypes from 'prop-types';

import './Field.styl';

const classes = {
  frame: 'field_frame',
  header: 'field__header',
  headerName: 'field__header--name',
  headerTools: 'field__header--tools',
  wrapper: 'field__wrapper', // the actual field lies here
}

const Field = ({ TagName, title, attributes, remove }) => (
  <div className={classes.frame}>
    <header className={classes.header}>
      <span className={classes.headerName}>{title}</span>

      <div className={classes.headerTools}>
        {remove ? (
          <button className="remove" onClick={() => remove()}>
            &times;
          </button>
        ) : ''}
      </div>
    </header>
    <div className={classes.wrapper}>
      <TagName {...attributes} />
    </div>
  </div>
)

Field.propTypes = {
  TagName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired,
  remove: PropTypes.func,
  // onClick: PropTypes.func.isRequired,
  // completed: PropTypes.bool.isRequired,
  // text: PropTypes.string.isRequired
}

export default Field
