import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import persistState, { mergePersistedState } from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import filter from 'redux-localstorage-filter';
import thunk from 'redux-thunk';
import layout from 'ducks/layout';
import numbers from 'ducks/numbers';
import router from 'ducks/router';
import user from 'ducks/user';

const rootReducer = enableBatching(combineReducers({
  layout,
  numbers,
  router,
  user,
}));

const reducer = compose(mergePersistedState())(rootReducer);
const storage = compose(filter([ 'numbers', 'user' ]))(adapter(window.localStorage));
const enhancer = compose(applyMiddleware(thunk), persistState(storage, 'le-nombre'));

export default function configureStore() {
  return createStore(reducer, enhancer);
}
