import { combineReducers } from 'redux'
import fields from './fields'
import visibilityFilter from './visibilityFilter'

const todoApp = combineReducers({
  fields,
  visibilityFilter
})

export default todoApp
