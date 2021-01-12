# dead plugin

This was a prototype which could've been a fully functional visual form builder. It was a bit too ambitiuous, and edge cases and the aholes at wp.org Plugin Review Team killed it.

If I were to start from the beginning, I'd build the components from React, and not HTML with hacks. Fields like select can get quite a bit more complex than just a few options. I might've forgotten the existence of optiongroup etc when building the prototype, and pretty much everything is based on the idea that you have elements which can take one children.

See limitations below if you're curious on why this isn't as easy as I thought it would be.

## Screenshots

![in move mode](/assets/screenshot-1.png)
![in preview mode](/assets/screenshot-2.png)
![in edit mode](/assets/screenshot-3.png)
![in field add screen](/assets/screenshot-4.png)

## How does it work
Think of it as a preprocessor for WP Libre Form. It provides some built-in building blocks, and lets you create block from any\* HTML. See Limitations.

All of the standard features should work just fine. Dynamic values? Check. Multilinguality support with Polylang? Check.

## Terminology
It's easy to get confused on what word means what. Hopefully this will help.

  - `field`: The content field in wplfb-field post type. If using `wplf()->plugins->Formbuilder->addField()`, it matches the array element with the same key.
  - `template`: The field template textarea in wplfb-field post type. Same applies for PHP API. Used to provide wrapping HTML for the customizable input.

## Limitations
Turns out that working with arbitrary HTML is pretty hard. Especially if it has to be user editable. The HTML spec doesn't make things any easier. Things like `<textarea>` accept a default input value as a child, in addition to supporting the value attribute. `<button>` doesn't accept the value attribute, and instead renders any HTML inside it.

These are the limitations at the moment. Some might be permanent, but most likely everything is fixable. It's just this limited amount of time, resources and motivation I have that limit my ability to fix said limitations.

Is something missing from this list? Add an issue or send a PR with it added.

### Nested HTML tags inside `field` do not work

Example:

```
<div class="wrapper" doge="cate">
  <div class="test">
    <div class="wplfb-child-container"></div>
  </div>
</div>
```

`div.test` just magically disappears. Fixing this probably requires recursion and there's already plenty of it in the codebase. [This will most likely be fixed in the future, if you've ideas on how, please contribute.](https://github.com/k1sul1/wp-libre-formbuilder/issues/9)

This is a real problem with things like `<select>` inputs.

*Workaround*: You tell me. Dynamic values feature of WPLF?

### Only the first HTML tag is customizable inside `field`
Related to the previous limitation, but is also a design decision.

```
<div class="wrapper" doge="cate">
  <div class="wplfb-child-container"></div>
</div>
```

You can edit the class and doge attributes, but you have no control over the element with the class wplfb-child-container.

This will probably stay like this forever, for a couple of reasons
1. It increases the cyclomatic complexity of the codebase by a fucking lot
2. It's an UI nightmare
3. It can be worked around

### Making changes to fields don't sync to forms
This is pretty much a design decision. When you've added a field to a form, it will render the same way every time, even if you make changes to the underlying field object.

Example:
1. Add wrapper field to form
2. Edit wrapper field and add a new attribute to it
3. Save the form

The wrapper field in the form will not contain the new attribute.

Possibly fixed in later versions by adding a sync button to forms or invidual fields.

This is to make sure that updates to this plugin can change the defaults and not break anything.

*Workaround*: Add a new field, select the same type, add the attributes, delete the old field.

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

## FAQ

### Why no drag & drop?
DnD interfaces are often tedious to use. Sure, they work great on desktop, when there's one level, but complex forms may have any number of levels. Using mobile devices with limited screen space makes it spectacularly easy to ~~ruin everything~~ misplace elements.

By not relying on DnD the code stays relatively simple, and works on every device. The current move controls should feel intuitive, and after adding keyboard shortcuts everything should be a breeze.

If there's demand, drag & drop controls might be implemented, there's nothing in the code preventing that from being done.
