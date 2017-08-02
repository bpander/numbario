import 'babel-polyfill';
import Inferno from 'inferno';
import { Provider } from 'inferno-redux';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import App from 'App';
import reducer from 'reducers/reducer';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
const node = document.getElementById('js-app');
node.innerHTML = '';

Inferno.render(
  <Provider store={store}>
    <App />
  </Provider>,
  node,
);
