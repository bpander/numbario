import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import persistState, { mergePersistedState } from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import thunk from 'redux-thunk';
import numbers from 'ducks/numbers';
import router from 'ducks/router';
import user from 'ducks/user';

const rootReducer = combineReducers({
  numbers,
  router,
  user,
});

const reducer = compose(mergePersistedState())(rootReducer);
const storage = adapter(window.localStorage);
const enhancer = compose(applyMiddleware(thunk), persistState(storage, 'le-nombre'));

export default function configureStore() {
  return createStore(reducer, enhancer);
}
