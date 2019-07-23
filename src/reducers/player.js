import {
  CHOOSE_PLAYER,
  PLAYER_CHOICE_SET_INDEX,
  RETURN_TO_START
} from '../actions';
import heroes from '../data/heroes.json';

const initialState = {
  activeIndex: Math.floor(heroes.length * Math.random()),
  characterId: 0,
  players: [
    null,
    null
  ]
};

const stepReducer = (state = initialState, action) => {
  switch(action.type) {
    case PLAYER_CHOICE_SET_INDEX:
      return {
        ...state,
        activeIndex: action.playerIdx
      };
    case CHOOSE_PLAYER: {
      const { playerIdx, characterId } = action;
      const { activeIndex } = state;
      const newActiveIndex = activeIndex < heroes.length - 1 ? activeIndex + 1 : 0; 
      const players = [...state.players];
      players.splice(playerIdx, 1, characterId);
      return {
        activeIndex: newActiveIndex,
        characterId,
        players
      };
    }
    case RETURN_TO_START:
      return {
        ...initialState,
        activeIndex: action.activeIndex
      };
    default:
      return state;
  }
};

export default stepReducer;
