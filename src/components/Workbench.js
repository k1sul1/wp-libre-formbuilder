import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import Field from './FieldReborn'

const boxTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem()
    console.log(component, item.unique, component[item.unique]);
    window.component = component;

    return {
      key: 'workbench',
    }
  },
}

@DropTarget(ItemTypes.FIELD, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export default class Workbench extends Component {
  static propTypes = {
    // fields: PropTypes.arrayOf(
      // PropTypes.shape({
        // id: PropTypes.number.isRequired,
        // completed: PropTypes.bool.isRequired,
        // text: PropTypes.string.isRequired
      // }).isRequired
    // ).isRequired,
    // onFieldClick: PropTypes.func.isRequired,
    tree: PropTypes.array.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    tree: [],
  }

  render() {
    const { tree } = this.props;
    const { canDrop, isOver, connectDropTarget } = this.props
    const isActive = canDrop && isOver

    if (tree.length) {
      console.log(tree);
    }

    let backgroundColor = null
    if (isActive) {
      backgroundColor = 'darkgreen'
    } else if (canDrop) {
      backgroundColor = 'darkkhaki'
    }

    return connectDropTarget(
      <div style={{backgroundColor}} className={this.props.className}>
        {tree.map((field, index) => {
          const { key, attributes, parent, unique } = field;
          if (parent === 'workbench') {
            return (
              <Field
                TagName={`input`}
                title={key}
                attributes={attributes}
                remove={() => false}
                unique={unique}
                key={key}
                _key={key}
                parent={this}
              />
            );
          }

          return null;
        }).filter(Boolean)}
      </div>,
    )

    /*return (
      <div {...this.props}>
        {fields.map((field, index) => (
          <Field key={index} {...field} onClick={() => onFieldClick(index)} />
        ))}
      </div>
    );*/
  }
}
