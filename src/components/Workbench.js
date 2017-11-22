import React from 'react'
import PropTypes from 'prop-types'
import Field from './Field'

const Workbench = ({ fields, onFieldClick }) => (
  <ul>
    {/*fields.map((field, index) => (
      <Field key={index} {...field} onClick={() => onFieldClick(index)} />
    ))*/}
  </ul>
)

Workbench.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onFieldClick: PropTypes.func.isRequired
}

Workbench.defaultProps = {
  fields: [],
}

export default Workbench
