import {
  SHOW_AD_MODAL,
  HIDE_AD_MODAL,
} from '../actions';

const showAdModalReducer = (state = false, action) => {
  switch(action.type) {
    case SHOW_AD_MODAL:
      return true;
    case HIDE_AD_MODAL:
      return false;
    default:
      return state;
  }
};

export default showAdModalReducer;
