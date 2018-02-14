import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReactGA from 'react-ga';
import App from 'App';
import configureStore from 'configureStore';

const store = configureStore();
const node = document.getElementById('js-app');
node.innerHTML = '';

if (process.env.ANALYTICS_TRACKING_ID) {
  ReactGA.initialize(process.env.ANALYTICS_TRACKING_ID);
  ReactGA.pageview('/');
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  node,
);

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  navigator.serviceWorker.register('sw.js', { scope: '.' });
}
