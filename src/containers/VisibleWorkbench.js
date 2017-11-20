import { connect } from 'react-redux'
import { toggleField } from '../actions'
import Workbench from '../components/Workbench'

const getVisibleFields = (fields, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return fields
    case 'SHOW_COMPLETED':
      return fields.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return fields.filter(t => !t.completed)
  }
}

const mapStateToProps = state => {
  return {
    fields: getVisibleFields(state.fields, state.visibilityFilter)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFieldClick: id => {
      dispatch(toggleField(id))
    }
  }
}

const VisibleWorkbench = connect(
  mapStateToProps,
  mapDispatchToProps
)(Workbench)

export default VisibleWorkbench
