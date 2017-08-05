import { Difficulty } from 'config';
import * as userActions from 'actions/userActions';

const initialState = {
  difficulty: Difficulty.EASY,
  streak: 0,
  bests: [],
  isFirstTime: true,
};

export default function userReducer(state = initialState, { type, payload } = {}) {
  switch (type) {
    case userActions.UPDATE_USER: {
      const sanitizedUpdates = {};
      Object.keys(payload)
        .filter(key => state.hasOwnProperty(key))
        .forEach(key => { sanitizedUpdates[key] = payload[key]; });

      return { ...state, ...sanitizedUpdates };
    }
  }
  return state;
}
