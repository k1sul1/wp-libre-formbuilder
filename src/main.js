// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// import Vuex from 'vuex';
import App from './App';
import router from './router';
import draggable from 'vuedraggable';

Vue.config.productionTip = false;
Vue.component('wplfb-field', {
  components: { draggable },
  render: function (h) {
    const options = {
      group: {
        name: 'fields',
        put: true
      }
    };
    const children = <draggable class="wplfb-field__children" options={options}>
      {this.$slots.default}
    </draggable>;
    const maybeChildren = this.takes_children ? children : false;

    return <this.element is={this.element} {...this.attributes}>
      {maybeChildren}
    </this.element>;
  },
  props: {
    element: {
      type: String,
      required: true
    },

    attributes: {
      type: Object,
      required: false
    },

    takes_children: {
      type: Boolean,
      required: true
    }
  }
});
// Vue.use(Vuex);

/* eslint-disable no-new */
/* const store = new Vuex.Store({
  state: {
    tree: {}
  },

  mutations: {
    updateTree (state) {

    }
  }
}); */

new Vue({
  el: '#wplfb_buildarea',
  router,
  // store,
  template: '<App/>',
  components: { App }
});

const runAppInAdmin = () => {
  document.querySelector('#postdivrich').style.display = 'none';
};

if (window.wplfb && window.wplfb.active) {
  runAppInAdmin();
} else if (document.body.classList.contains('post-type-wplf-form')) {
  const bar = document.querySelector('#wp-content-editor-tools');
  const publishBtn = document.querySelector('#publish');
  const formbuilderBtn = publishBtn.cloneNode(true);

  formbuilderBtn.type = 'button';
  formbuilderBtn.value = 'Use formbuilder';
  formbuilderBtn.style.float = 'right';
  formbuilderBtn.style.transform = 'translateY(-5px)';
  bar.appendChild(formbuilderBtn);

  formbuilderBtn.addEventListener('click', runAppInAdmin);
}
