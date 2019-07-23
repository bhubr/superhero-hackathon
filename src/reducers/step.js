import {
  CHANGE_STEP,
  RETURN_TO_START
} from '../actions';

const stepReducer = (state = 0, action) => {
  switch(action.type) {
    case CHANGE_STEP:
      return action.step;
    case RETURN_TO_START:
      return 0;
    default:
      return state;
  }
};

export default stepReducer;
