import {
  CHOOSE_PLAYER,
  PLAYER_CHOICE_SET_INDEX
} from '../actions';

const initialState = {
  activeIndex: 10,
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
      const players = [...state.players];
      players.splice(playerIdx, 1, characterId);
      return {
        ...state,
        characterId,
        players
      };
    }
    default:
      return state;
  }
};

export default stepReducer;
