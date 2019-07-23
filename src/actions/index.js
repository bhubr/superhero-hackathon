import heroes from '../data/heroes.json';

export const CHOOSE_MODE = 'CHOOSE_MODE';
export const CHANGE_STEP = 'CHANGE_STEP';
export const CHOOSE_PLAYER = 'CHOOSE_PLAYER';
export const PLAYER_CHOICE_SET_INDEX = 'PLAYER_CHOICE_SET_INDEX';
export const RETURN_TO_START = 'RETURN_TO_START';
export const SHOW_AD_MODAL = 'SHOW_AD_MODAL';
export const HIDE_AD_MODAL = 'HIDE_AD_MODAL';

export const chooseMode = mode => ({
  type: CHOOSE_MODE,
  mode
});

export const changeStep = step => ({
  type: CHANGE_STEP,
  step
});

export const choosePlayer = (playerIdx, characterId) => ({
  type: CHOOSE_PLAYER,
  playerIdx,
  characterId
});


export const playerChoiceSetIndex = playerIdx => ({
  type: PLAYER_CHOICE_SET_INDEX,
  playerIdx
});

export const returnToStart = () => ({
  type: RETURN_TO_START,
  activeIndex: Math.floor(heroes.length * Math.random())
});

export const hideAdModal = () => ({
  type: HIDE_AD_MODAL
});

export const showAdModal = () => ({
  type: SHOW_AD_MODAL
});
