
export const NEW_GAME = Symbol('NEW_GAME');
export const newGame = difficulty => ({ type: NEW_GAME, difficulty });
