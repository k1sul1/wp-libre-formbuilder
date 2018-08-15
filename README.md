# WP Libre Formbuilder

Work in progress, watch this space

## Wrapper fields
Sometimes you want to nest fields, or group them in logical sections. Wrapper fields allow you to do just that. They're normal fields but they don't contain any inputs themselves, usually.

```
<div>
  <p>Elements before inputs</p>
  <div class="wplfb-child-container">
    <!-- Children can be put here! -->
  </div
  <p>Elements after inputs</p>
</div>
```

The class `wplfb-child-container` is mandatory.

## Templates
In addition to having just plain old <input> (and relatives) elements, you can provide a template that wraps your field.

```
<div>
  <h3>This is a very important heading</h3>

  <div class="wplfb-field-container">
    <!-- This element will be replaced with the input element! -->
  </div>
</div>
```

The class `wplfb-field-container` is mandatory.

### Hold up. Templates and wrappers look like the same to me?
Indeed they do, but they're not. Templates can't contain multiple fields, as in, they can't have children. When you use templates, the tag you used for the template is discarded and a field takes it's place, but when you use wrapper fields, you can put any field inside it and the wrapping element is preserved.
