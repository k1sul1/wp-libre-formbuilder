const fields = (state = [], action) => {
  switch (action.type) {
    case 'ADD_FIELD':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ]
    case 'TOGGLE_FIELD':
      return state.map(field =>
        (field.id === action.id)
          ? {...field, completed: !field.completed}
          : field
      )
    default:
      return state
  }
}

export default fields
