let nextFieldId = 0
export const addField = text => {
  return {
    type: 'ADD_FIELD',
    id: nextFieldId++,
    text
  }
}

export const setVisibilityFilter = filter => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}

export const toggleField = id => {
  return {
    type: 'TOGGLE_FIELD',
    id
  }
}
