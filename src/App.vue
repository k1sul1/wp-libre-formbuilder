<template>
  <div id="wplfb_buildarea">
    <img src="./assets/logo.png">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
};
</script>

<style lang="stylus">
#wplfb_buildarea {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.wplfb-field__children {
  outline: 1px solid red;
  min-height: 40px;
  width: 100%;
  margin-bottom: 10px;
}
</style>
