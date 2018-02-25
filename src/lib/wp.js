import options from './options'

export async function wp(url, opts) {
  return fetch(options.wpURL + url, {
    credentials: 'same-origin',
    ...opts
  })
}

export async function loadForm(form_id = undefined) {
  if (!form_id) return false

  try {
    const req = await wp(`$/wp-json/wplfb/forms/form?form_id=${form_id}`)
    const data = await req.json()

    return data
  } catch (e) {
    return e
  }
}

export async function getForms() {
  try {
    const req = await wp('/wp-json/wplfb/forms/forms')
    const data = await req.json()

    // Filter any forms that don't have fields set
    return data.filter(form => form.fields !== '')
  } catch(e) {
    return e
  }
}

export async function getFields() {
  try {
    const request = await wp('/wp-json/wplfb/fields')
    const response = await request.json()

    if (request.ok && response.fields) {
      const fields = Object.entries(response.fields).reduce((acc, [key, obj]) => {
        const { attributes, element, children } = obj.dom

        acc[key] = {
          key,
          tagName: element,
          attributes,
          fieldChildren: children, // FIX THIS
        }

        console.log('getFields broken')

        return acc
      }, {})

      return fields
    } else {
      return new TypeError('Request response was invalid')
    }
  } catch(e) {
    return e
  }
}

export default wp
