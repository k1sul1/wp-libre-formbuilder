<template>
  <div class="wplfb-sandbox">
    <draggable
      class="wplfb-sandbox__playfield"
      :options="{group: {name: 'fields', put: true }}"
    >
      <p>Drag fields into me!</p>
    </draggable>

    <draggable
      class="wplfb-sandbox__tools"
      :options="{group: {name: 'fields', pull: 'clone', put: false }}"
    >
      <template v-for="field in fields">
        <template v-for="(value, key) in field">
          <!-- <header>{{ key }}</header> -->
          <pre>{{ value }}</pre>
          <wplfb-field
            v-bind:name="key"
            v-bind:element="value.element"
            :attributes="value.attributes"
            v-bind:takes_children="value.takes_children"
          >
          <!-- Children will be placed here -->
        </wplfb-field>
        </template>
      </template>
    </draggable>
  </div>
</template>

<script>
// import field from './Field';
import draggable from 'vuedraggable';

export default {
  name: 'builder',
  components: {
    draggable,
    // 'wplfb-field': field
  },
  /* computed: {
    tree: {
      get() {
        return this.$store.state.tree;
      },

      set(value) {
        this.$store.commit('updateTree', value);
      }
    }
  }, */
  data () {
    return {
      fields: [
        { 'Text2': {
          element: 'input',
          attributes: {
            type: 'text',
            placeholder: 'Test',
            class: 'test',
            name: 'test',
          },
          takes_children: false
        } },

        { 'Wrapper': {
          element: 'div',
          attributes: {
            class: ['b', 'c'],
          },
          takes_children: true
        } }
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.wplfb-sandbox {
  text-align: left
  display: flex
  flex-flow: row nowrap
  align-items: flex-start
  justify-content: space-between

  &__playfield {
    width: 65%
    min-height: 100vh
  }

  &__tools {
    width: 30%

    .wplfb-field {
      .remove {
        display: none
      }
    }
  }

  .wplfb-field {
    margin-bottom: 1rem

    &:last-child {
      margin-bottom: 0
    }
  }
}

</style>
