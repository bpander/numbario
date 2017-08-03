import { combineReducers } from 'redux';
import numbersReducer from 'reducers/numbersReducer';
import userReducer from 'reducers/userReducer';


export default combineReducers({
  numbers: numbersReducer,
  user: userReducer,
});
