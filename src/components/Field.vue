<script>
import draggable from 'vuedraggable';

export default {
  name: 'wplfb-field',
  components: { draggable },
  render: function (h) {
    const options = {
      group: {
        name: 'fields',
        put: true
      }
    };
    const children = this.takesChildren
      ? (
        <draggable
          class="wplfb-field__children"
          options={options}
          { ... { on: { move: this.moveHandler, end: this.endHandler } } }
        >
          {this.$slots.default}
        </draggable>
      )
      : false;

    // proposed: https://github.com/vuejs/Discussion/issues/292
    // const attributes = JSON.parse(JtakesChildrenthis.attributes));

    // Less hacky.
    const attributes = Object.keys(this.attributes).reduce((attrs, key) => {
      const value = this.attributes[key];
      return { ...attrs, [key]: value };
    }, {});

    const element = (
    <div class="wplfb-field"
      { ...{ on: { start: this.startHandler } } }>
      <header class="wplfb-field__header">
        <span class="wplfb-field__header--text">{this.name}</span>
        <div class="wplfb-field__header--tools">
          <button class="remove" { ...{ on: { click: this.removeHandler } } }>
            &times;
          </button>
        </div>
      </header>
    <div class="wplfb-field__fieldwrap">
      <this.element
        is={this.element}
        {...{attrs: attributes}}
      >
        {children}
      </this.element>
    </div>
      </div>
    );

    element.fieldData = { name: this.name, data: this.fieldData };
    console.log(element);

    return element;
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    fieldData: {
      type: Object,
      required: true,
    },
    element: {
      type: String,
      required: true,
    },
    takesChildren: {
      type: Boolean,
      required: true,
    },
    attributes: {
      type: Object,
      required: false,
    },
    removeHandler: {
      type: Function,
      required: true,
    },
    startHandler: {
      type: Function,
      required: true,
    },
    moveHandler: {
      type: Function,
      required: true,
    },
    endHandler: {
      type: Function,
      required: true,
    },
    cloneHandler: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style lang="stylus">
highlightColour = #0073aa;

.wplfb-field {

  header {
    background: highlightColour
    color: #fff
    padding: 0.3rem 0.5rem
    cursor: pointer
    display: flex
    flex-flow: row nowrap
    justify-content: space-between
    align-items: center
  }

  &__fieldwrap {
    padding: 0.5rem 1rem
    border: 0.0625rem solid #e5e5e5
    background: #fff
    border-top: 0
  }

  &__children {
    min-height: 2rem
  }
}
</style>
