import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
const root = document.getElementById('root');

ReactDOM.render(<App />, root);
registerServiceWorker();

// Doesn't really work when working with React state, switch to redux first.
// if (module.hot) {
  // module.hot.accept('./App', () => {
    // ReactDOM.render(
      // <App />,
      // root
    // );
  // });
// }
