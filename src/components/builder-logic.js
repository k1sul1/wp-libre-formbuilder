import PropTypes from 'prop-types'
import { kea } from 'kea'

export default kea({
  actions: () => ({
    increment: (amount) => ({ amount }),
    decrement: (amount) => ({ amount }),
    addField: (field) => ({ ...field }),
    addForm: (form) => ({ ...form }),
    onDrop: (field) => ({ ...field}),
  }),

  reducers: ({ actions }) => ({
    counter: [0, PropTypes.number, {
      [actions.increment]: (state, payload) => state + payload.amount,
      [actions.decrement]: (state, payload) => state - payload.amount,
    }],
    fields: [{}, PropTypes.object, {
      [actions.addField]: (state, payload) => {
        return {
          ...state,
          ...payload,
        }
      },
    }],
    forms: [{}, PropTypes.object, {
      [actions.addForm]: (state, payload) => {
        return {
          ...state,
          ...payload,
        }
      },
    }],
    tree: [[], PropTypes.array, {
      [actions.onDrop]: (oldState, payload) => {
        const state = [...oldState]
        const item = payload.item
        const dropResult = payload.dropResult
        const positionInState = state.findIndex(i => i.key === item.key)
        const field = {
          ...item,
          parent: dropResult.key,
        }

        if (positionInState !== -1) {
          // Exists
          const removed = state.splice(positionInState, 1)

          if (removed.parent) {
            // remove refs by mutating new state further
          }
        } else {
          // Doesn't exist
        }

        const insertIndex = field.parent === 'workbench'
          ? state.length - 1
          : state.findIndex(i => i.id === field.parent) // add children lookup for accuracy

        state.splice(insertIndex, 0, field)

        return state
      },
    }]
  }),

  selectors: ({ selectors }) => ({
    doubleCounter: [
      () => [selectors.counter],
      (counter) => counter * 2,
      PropTypes.number
    ]
  })
})
