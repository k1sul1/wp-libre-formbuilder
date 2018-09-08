# WP Libre Formbuilder

Free WYSIWYG formbuilder for WP Libre Form. Anyone who is able to write HTML is able to create fields that act as building blocks for the forms, and the outputted forms are rather accessible.

The plugin is in rather early development, and new features and improvements are subject to be added based on user feedback.

## Installing
You need to have WP Libre Form installed before you can use this plugin.

The plugin has been submitted to the WordPress plugin directory, and once accepted, should appear there.
Until that happens, you can download the latest release on [the releases page](https://github.com/k1sul1/wp-libre-formbuilder/releases).

You can also use Composer:

```
composer require k1sul1/wp-libre-formbuilder
```

## Screenshots

![in move mode](/assets/screenshot-1.png)
![in preview mode](/assets/screenshot-2.png)
![in edit mode](/assets/screenshot-3.png)
![in field add screen](/assets/screenshot-4.png)

## How does it work
Think of it as a preprocessor for WP Libre Form. It generates HTML from the building blocks you create. Obviously there's some built-in building blocks as well.

That means that any of the usual features should work just fine. Dynamic values? Check. Multilinguality support with Polylang? Check.

## How to add fields
### The easy way
Using wp-admin: /wp-admin/post-new.php?post_type=wplfb-field

Follow the instructions in the Field metabox.

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

```html
<div>
  <p>Elements before inputs</p>
  <div class="wplfb-child-container">
    <!-- Children can be put here! -->
  </div>
  <p>Elements after inputs</p>
</div>
```

The class `wplfb-child-container` is mandatory.

## Templates
In addition to having wrapper fields, you can provide a template that wraps your field. Useful for adding boilerplate around the inputs allowing you to utilize the power of CSS frameworks like Bootstrap, Foundation, or Pure. Templates can't have configurable parameters. But you can probably use wrapper fields to achieve that and live.

```html
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
