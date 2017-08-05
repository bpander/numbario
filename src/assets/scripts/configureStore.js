import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import numbers from 'ducks/numbers';
import user from 'ducks/user';

const reducers = combineReducers({
  numbers,
  user,
});

export default function configureStore() {
  return createStore(reducers, applyMiddleware(thunk));
}
