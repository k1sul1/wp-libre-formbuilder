# Stack
 - redux
 - react-dnd

# Builder logic
Fields from the sidebar are *moved* to the actual builder when dragged into it, instead of being copied into it. Reasoning behind this is that the sidebar version of the field is going to need a new ID anyway, and React will rerender it (..?). It's easier to just render the sidebar again after a field drop instead of assigning new IDs manually. Browsers are getting fast at that stuff.

~Every *drop* (drake.on('drop', ..) will dispatch saveField and dropTargetState payloads~

# Field logic
Note that these are saved to the field state immediately.
If a field contains an element with the class wplfb-child-container, it can have children, and thus may become a drop target. Field data is saved instantly with the saveField payload in case of checkboxes, radio buttons, and selects, and in other input types with 300ms debounce.

# Payloads
#### saveField
 - element unique id
 - wplfb internal key for the element so that it can be recreated from the available fields that came from WP without storing unnecessary data in memory and database
 - field attribute values from field state

 This data will be used to store the field and it's data in the state.

#### dropTargetState
 - dropped element id
 - ~sibling element id, *if the dropped element was dropped **before** it*, false if dropped element wasn't placed before an element, as in it's the last item. (confirm that this is the way dragula behaves)~
 - sibling element ids

 The object is used to make the state aware of where the field is placed, because the builder will be rerendered from the state. React will lose its shit about the dom changes otherwise. It's also less error prone because if you break it, it will break instantly and not later on when 90% is done.
