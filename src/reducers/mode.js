import {
  CHOOSE_MODE
} from '../actions';

const modeReducer = (state = null, action) => {
  switch(action.type) {
    case CHOOSE_MODE:
      return action.mode;
    default:
      return state;
  }
};

export default modeReducer;
