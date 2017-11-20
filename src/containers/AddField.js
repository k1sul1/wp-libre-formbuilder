import React from 'react'
import { connect } from 'react-redux'
import { addField } from '../actions'

let AddField = ({ dispatch }) => {
  let input

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          dispatch(addField(input.value))
          input.value = ''
        }}
      >
        <input
          ref={node => {
            input = node
          }}
        />
        <button type="submit">
          Add Field
        </button>
      </form>
    </div>
  )
}
AddField = connect()(AddField)

export default AddField
