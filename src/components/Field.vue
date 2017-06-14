<script>
import draggable from 'vuedraggable';

const removeField = (event) => {
  console.log('test');
  console.log(event.target);
};

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
    const children = this.takes_children
      ? (
        <draggable class="wplfb-field__children" options={options}>
          {this.$slots.default}
        </draggable>
      )
      : false;

    /* Tried, no luck:
        Object.keys(this.attributes).map(key => {
          const value = this.attributes[key];
          return `${key}=${value}`;
        })
    */

    return (
      <div class="wplfb-field">
        <header class="wplfb-field__header">
          <span class="wplfb-field__header--text">{this.name}</span>
          <div class="wplfb-field__header--tools">
            <button class="remove" onclick={() => removeField()}>
              &times;
            </button>
          </div>
        </header>
        <div class="wplfb-field__fieldwrap">
          <this.element
            is={this.element}
            placeholder={this.attributes.placeholder}
            type={this.attributes.type}
            name={this.attributes.name}
            {...this.attributes /* No idea why this doesn't work. */}
          >
            {children}
          </this.element>
        </div>
      </div>
    );
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    element: {
      type: String,
      required: true,
    },
    takes_children: {
      type: Boolean,
      required: true,
    },
    attributes: {
      type: Object,
      required: false,
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
    border-top: 0
  }

  &__children {
    min-height: 2rem
  }
}
</style>
