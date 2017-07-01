<script>
export default {
  name: 'wplfb-notification',
  components: { },
  props: {
    type: {
      type: String,
      required: true,
    },
    msg: {
      type: String,
      required: true,
    },
  },
  render: function (h) {
    return (
      <div class={this.type}>
        {this.msg}
      </div>
    );
  },
};
</script>

<style lang="stylus" scoped>
notification() {
  opacity: 0.7
  position: absolute
  top: 2%
  right: 2%
  width: 15rem
  padding: 1rem 0.5rem
  color: #fff
}

.error {
  notification()
  background: red
}

.success {
  background: green
  notification()
}
</style>
