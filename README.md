# WP Libre Formbuilder

Work in progress, watch this space.

It works, but it's in alpha.

![screenshot](https://i.imgur.com/j6xrCZT.png)

## How does it work
Think of it as a preprocessor for WP Libre Form. It generates HTML from the building blocks you create. Obviously there's some built-in building blocks as well.

That means that any of the usual features should work just fine. Dynamic values? Check. Multilinguality support with Polylang? Check.

## How to add fields
### The easy way
Using wp-admin: /wp-admin/post-new.php?post_type=wplfb-field

1. Put the input element in the standard content field. Every\* attribute you define at the root node is customizable, meaning you can spesify id, class, name, or custom attributes from the builder.
2. If you wish to have a label (which you certainly should have!), add the label to the *Field label* field in the metabox below the content.
3. If you wish to wrap the input element with more HTML, add the wrapping HTML to the *Field template*  field in the metabox below the content. See `Templates` down below.

### Using PHP
This assumes that you're running the latest version of WP Libre Form.

```php
wplf()->plugins->Formbuilder->addField([
  'key' => 'U0', // Used to differentiate fields from others, especially when two fields share the same name
  'name' => 'Range', // Name shown to the end user
  'field' => '<input type="range" name="range" value="3" min="1" max="5">', // HTML fragment. Attributes will be editable.
  'template' => '<div class="wrapper-div"><div class="wplfb-field-container"></div></div>', // HTML fragment for wrapping field with
  'label' => 'On a scale of 1 to 5, how did we do?', // Default label for input, leave empty to disable
]);
```

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
In addition to having wrapper fields, you can provide a template that wraps your field. Useful for adding boilerplate around the inputs allowing you to utilize the power of CSS frameworks like Bootstrap, Foundation, or Pure. Templates can't have configurable parameters. But you can probably use wrapper fields to achieve that and live.

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
