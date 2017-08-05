
export const NEW_GAME = Symbol('NEW_GAME');
export const newGame = difficulty => ({ type: NEW_GAME, payload: { difficulty } });

export const STREAM_PUSH = Symbol('STREAM_PUSH');
export const streamPush = token => ({ type: STREAM_PUSH, payload: { token } });
