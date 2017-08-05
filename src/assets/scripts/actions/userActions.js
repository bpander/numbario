
export const UPDATE_USER = Symbol('UPDATE_USER');
export const updateUser = updates => ({ type: UPDATE_USER, payload: updates });
