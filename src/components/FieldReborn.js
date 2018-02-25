import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd'
import { connect } from 'kea'
import shortid from 'shortid'

import builderLogic from './builder-logic';
import ItemTypes from './ItemTypes';
import './Field.styl';

const classes = {
  frame: 'field_frame',
  header: 'field__header',
  headerName: 'field__header--name',
  headerTools: 'field__header--tools',
  wrapper: 'field__wrapper', // the actual field lies here
}

const boxSource = {
  beginDrag(props) {
    return {
      key: props._key,
      unique: props.unique || shortid.generate(),
      attributes: props.attributes,
    }
  },

  endDrag(props, monitor) {
    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()

    console.log(dropResult);

    if (dropResult) {
      // console.log('props', props);
      // console.log('item', item);
      // console.log('dropResult', dropResult);
      props.actions.onDrop({
        item,
        dropResult,
      });
      // props.onDrop(item);
      // alert(`You dropped ${item.title} into ${dropResult.name}!`) // eslint-disable-line no-alert
    }
  },
}

@connect({
  actions: [
    builderLogic, [
      'onDrop',
    ]
  ],
  props: [
    builderLogic, [
      'tree',
    ],
  ]
})
@DragSource(ItemTypes.FIELD, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Field extends Component {
  static propTypes = {
    TagName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    attributes: PropTypes.object.isRequired,
    unique: PropTypes.string,
    remove: PropTypes.func,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  }

  handleEvent(e) {
    // console.log(e);
    if (e.target.tagName === 'INPUT') {
      // do something?
      e.target.value = e.target.value;
    }
  }

  render() {
    const { TagName, title, attributes, remove, parent } = this.props
    const { isDragging, connectDragSource } = this.props
    const opacity = isDragging ? 0.4 : 1

    // return connectDragSource(<div style={{ ...style, opacity }}>{name}</div>)

    return connectDragSource(
      <div
        className={classes.frame}
        style={{opacity}}
        data-unique={this.props.unique || false}
        ref={(x) => parent[this.props.unique || this.props.key] = x}
      >
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
        <TagName {...attributes} onChange={this.handleEvent}/>
      </div>
    </div>
    )
  }
}
