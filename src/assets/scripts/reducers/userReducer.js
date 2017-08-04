import { Difficulty } from 'config';

const initialState = {
  difficulty: Difficulty.EASY,
  streak: 0,
  bests: [],
  isFirstTime: true,
};

export default function userReducer(state = initialState, action = {}) {
  return state;
}
