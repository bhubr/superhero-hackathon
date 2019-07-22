import { combineReducers } from 'redux';
import mode from './mode';
import step from './step';
import player from './player';

export default combineReducers({
  mode,
  player,
  step
});
