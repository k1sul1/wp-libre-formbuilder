import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
// import { createStore } from 'redux'
// import todoApp from './reducers'

import './index.css';
import store from './store';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
// import registerServiceWorker from './registerServiceWorker';
const root = document.getElementById('wplfb_buildarea');

/* let store = createStore(
  todoApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
) */


render(
  <Provider store={store}>
    <ErrorBoundary message="The whole thing crashed. Thanks k1sul1!">
      <App />
    </ErrorBoundary>
  </Provider>,
  root
)

// registerServiceWorker();

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

// Doesn't really work when working with React state, switch to redux first.
// if (module.hot) {
  // module.hot.accept('./App', () => {
    // ReactDOM.render(
      // <App />,
      // root
    // );
  // });
// }
