import options from './options';

export async function wp(url, opts) {
  return fetch(options.wpURL + url, {
    credentials: 'same-origin',
    ...opts
  });
}

export async function getFields() {
  const request = await wp('/wp-json/wplfb/fields');
  const response = await request.json();

  if (request.ok && response.fields) {
    const fields = Object.entries(response.fields).reduce((acc, [key, obj]) => {
      const { attributes, element, children } = obj.dom;

      acc[key] = {
        key,
        tagName: element,
        attributes,
        fieldChildren: children,
      };

      return acc;
    }, {});

    return fields;
  } else {
    throw new TypeError('Request response was invalid');
  }
}

export default wp;
