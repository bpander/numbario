import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from 'App';
import configureStore from 'configureStore';

const store = configureStore();
const node = document.getElementById('js-app');
node.innerHTML = '';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  node,
);

window.store = store;
