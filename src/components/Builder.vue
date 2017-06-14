<template>
  <div class="wplfb-sandbox">
    <draggable class="wplfb-sandbox__playfield" :options="{group: {name: 'fields', put: true }}">
      <p>Drag into me!</p>
    </draggable>

    <draggable class="wplfb-sandbox__tools" :options="{group: {name: 'fields', pull: 'clone', put: false }}">
      <p>Or me! </p>
      <div v-for="(value, key) in fields" class="wplfb-field">
        <header>{{ key }}</header>
        <pre>{{ value }}</pre>
        <wplfb-field v-bind:element="value.element" v-bind:attributes="value.attributes" v-bind:takes_children="value.takes_children">Hello</wplfb-field>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'builder',
  components: {
    draggable
  },
  data () {
    return {
      fields: {
        'text': {
          element: 'input',
          attributes: {
            type: 'text',
            placeholder: 'Test',
            name: 'test'
          },
          takes_children: false
        },

        'wrapper': {
          element: 'div',
          attributes: {
            className: 'fc-row'
          },
          takes_children: true
        }
      }
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.wplfb-sandbox {
  text-align: left;
  display: flex;

  &__playfield {
    width: 70%;
    outline: 1px solid black;
  }

  &__tools {
    width: 30%;
    outline: 1px solid gray;
  }
}

</style>
