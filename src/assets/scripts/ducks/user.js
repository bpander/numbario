import { Difficulty } from 'config';

// Actions
const UPDATE_USER = 'user/UPDATE_USER';

// Reducer
const initialState = {
  difficulty: Difficulty.EASY,
  streak: 0,
  bests: [],
  isFirstTime: true,
};

export default function userReducer(state = initialState, { type, payload } = {}) {
  switch (type) {
    case UPDATE_USER: {
      const sanitizedUpdates = {};
      Object.keys(payload)
        .filter(key => state.hasOwnProperty(key))
        .forEach(key => { sanitizedUpdates[key] = payload[key]; });

      return { ...state, ...sanitizedUpdates };
    }
  }
  return state;
}

// Action Creators
export const updateUser = updates => ({ type: UPDATE_USER, payload: updates });
