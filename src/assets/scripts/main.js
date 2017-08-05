import 'babel-polyfill';
import Inferno from 'inferno';
import { Provider } from 'inferno-redux';
import App from 'App';
import configureStore from 'configureStore';

const store = configureStore();
const node = document.getElementById('js-app');
node.innerHTML = '';

Inferno.render(
  <Provider store={store}>
    <App />
  </Provider>,
  node,
);

window.store = store;
