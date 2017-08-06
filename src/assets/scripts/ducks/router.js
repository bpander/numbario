import { Route } from 'config';
import createSkinnyReducer from 'lib/createSkinnyReducer';

export const Phase = {
  ENTERING: 'router/Phase/ENTERING',
  ENTERED: 'router/Phase/ENTERED',
  LEAVING: 'router/Phase/LEAVING',
};

const { reducer, update } = createSkinnyReducer('router/UPDATE', {
  route: Route.MAIN_GAME,
  progress: 0,
  phase: Phase.ENTERED,
});
export default reducer;

export const push = (route, leaveDuration = 0, enterDuration = 0) => dispatch => {
  return dispatch(update({ route }));
};
