import {
  CHOOSE_MODE,
  RETURN_TO_START
} from '../actions';

const modeReducer = (state = null, action) => {
  switch(action.type) {
    case CHOOSE_MODE:
      return action.mode;
    case RETURN_TO_START:
      return null;
    default:
      return state;
  }
};

export default modeReducer;
