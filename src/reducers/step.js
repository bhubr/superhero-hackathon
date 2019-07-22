import {
  CHANGE_STEP
} from '../actions';

const stepReducer = (state = 0, action) => {
  switch(action.type) {
    case CHANGE_STEP:
      return action.step;
    default:
      return state;
  }
};

export default stepReducer;
