<template>
  <div class="wplfb-sandbox">
    <draggable
      class="wplfb-sandbox__playfield"
      :options="{group: {name: 'fields', put: true }}"
      :list="formList"
      @move="moveHandler"
    >
      <p>Drag fields into me!</p>
      <template v-for="(value, key) in store.state.tree">
        <!-- <header>{{ key }}</header> -->
        <!-- <pre>{{ value.attributes }}</pre> -->
        <wplfb-field
          :name="key"
          :fieldData="value"
          :element="value.element"
          :attributes="value.attributes"
          :takesChildren="value.takesChildren"
          :removeHandler="removeHandler"
          :moveHandler="moveHandler"
          :startHandler="startHandler"
          :endHandler="endHandler"
          :cloneHandler="cloneHandler"
        >
          <!-- Children will be placed here -->
        </wplfb-field>
      </template>
    </draggable>

    <draggable
      class="wplfb-sandbox__tools"
      :options="{group: {name: 'fields', pull: 'clone', put: false }}"
      @move="moveHandler"
      @end="endHandler"
      @clone="cloneHandler"
    >
      <template v-for="(value, key) in fields">
        <!-- <header>{{ key }}</header> -->
        <!-- <pre>{{ value.attributes }}</pre> -->
        <wplfb-field
          :name="key"
          :fieldData="value"
          :element="value.element"
          :attributes="value.attributes"
          :takesChildren="value.takesChildren"
          :removeHandler="removeHandler"
          :moveHandler="moveHandler"
          :startHandler="startHandler"
          :endHandler="endHandler"
          :cloneHandler="cloneHandler"
        >
          <!-- Children will be placed here -->
        </wplfb-field>
      </template>
    </draggable>
  </div>
</template>

<script>
import field from './Field';
import draggable from 'vuedraggable';

let formList = [];
window.formList = formList;

const store = {
  debug: true,
  state: {
    tree: {

    },
    currentMove: {

    }
  },

  updateTree(newTree) {
    this.debug && console.log('Update tree', newTree);
    this.state.tree = newTree;
  },

  updateMove(fieldData) {
    this.debug && console.log('Update move', fieldData);
    this.state.currentMove = fieldData;
  }
};

export default {
  name: 'builder',
  components: {
    draggable,
    'wplfb-field': field
  },

  beforeMount() {
    let base;
    if (window.location.port !== 80 || window.location.port !== 443) {
      base = window.REST_URL; // Defined in index.html
    } else {
      base = '';
    }

    fetch(`${base}/wp-json/wplfb/forms/form`)
      .then(r => r.json())
      .then(r => {
        const { fields } = r;
        store.updateTree(JSON.parse(fields));
      })
      .catch(err => {
        throw err;
      });
  },

  methods: {
    preventDrag(e) {
      console.log(e);
      return false;
    },

    removeHandler() {
      console.log('Remove!');
    },

    startHandler() {
      store.updateMove(this.fieldData);
      console.log('Start!');
    },

    moveHandler(event) {
      const { draggedContext, relatedContext } = event;

      console.log('Move!', draggedContext, relatedContext);
    },

    endHandler(event) {
      console.log(event);
      store.updateTree();
    },

    cloneHandler() {
      console.log(this);
      console.log('Clone!');
    },

    changeHandler(added, removed, moved) {

    }
  },
  data () {
    return {
      fields: {
        'Text': {
          element: 'input',
          attributes: {
            type: 'text',
            placeholder: 'Test',
            class: 'test',
            name: 'test',
          },
          takesChildren: false
        },

        'Wrapper': {
          element: 'div',
          attributes: {
            class: ['b', 'c'],
          },
          takesChildren: true
        }
      },

      store,
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
