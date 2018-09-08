=== WP Libre Formbuilder ===
Contributors: k1sul1
Tags: wp libre form, formbuilder, form builder, contact form, contact, custom form, forms, form, custom forms, responsive, polylang, multilingual, wysiwyg, accessible, a11y
Requires at least: 4.7
Tested up to: 7.1
Requires PHP: 5.6
Stable tag: trunk
License: GPLv2
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Totally free WYSIWYG formbuilder for WP Libre Form. Works as a bridge between HTML impaired users and WP Libre Form.

== Description ==
WP Libre Formbuilder is a free WYSIWYG formbuilder for WP Libre Form. Anyone who is able to write HTML is able to create fields that act as building blocks for the forms, and the outputted forms are rather accessible.

The plugin is in rather early development, and new features and improvements are subject to be added based on user feedback.

## How to add fields
### The easy way
Using wp-admin: /wp-admin/post-new.php?post_type=wplfb-field

Follow the instructions in the Field metabox.

### Using PHP
This assumes that you\'re running the latest version of WP Libre Form.

```php
wplf()->plugins->Formbuilder->addField([
  \'key\' => \'U0\', // Used to differentiate fields from others, especially when two fields share the same name
  \'name\' => \'Range\', // Name shown to the end user
  \'field\' => \'
\"3\"
\', // HTML fragment. Attributes will be editable.
  \'template\' => \'
\', // HTML fragment for wrapping field with
  \'label\' => \'On a scale of 1 to 5, how did we do?\', // Default label for input, leave empty to disable
]);
```

## Wrapper fields
Sometimes you want to nest fields, or group them in logical sections. Wrapper fields allow you to do just that. They\'re normal fields but they don\'t contain any inputs themselves, usually.

```html


Elements before inputs



  Elements after inputs


```

The class `wplfb-child-container` is mandatory.

## Templates
In addition to having wrapper fields, you can provide a template that wraps your field. Useful for adding boilerplate around the inputs allowing you to utilize the power of CSS frameworks like Bootstrap, Foundation, or Pure. Templates can\'t have configurable parameters. But you can probably use wrapper fields to achieve that and live.

```html


This is a very important heading






```

The class `wplfb-field-container` is mandatory.

### Hold up. Templates and wrappers look like the same to me?
Indeed they do, but they\'re not. Templates can\'t contain multiple fields, as in, they can\'t have children. When you use templates, the tag you used for the template is discarded and a field takes it\'s place, but when you use wrapper fields, you can put any field inside it and the wrapping element is preserved.


== Installation ==
Install as any WordPress plugin. Requires WP Libre Form to work.

== Screenshots ==
1. Formbuilder in move mode
2. Formbuilder in preview mode
3. Formbuilder in edit mode
4. Field add / edit screen
