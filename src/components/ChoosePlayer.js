import React from "react";
import Card from "./Card";
import Button from "./Button";
import { connect } from "react-redux";
import {
  choosePlayer as choosePlayerAction,
  changeStep as changeStepAction,
  playerChoiceSetIndex as playerChoiceSetIndexAction
} from "../actions";
import steps from "../data/steps";
import heroes from "../data/heroes.json";
console.log(heroes.length);
const fn = () => {};

const getStyle = index => {
  const idxFromCenter = Math.abs(index - 1);
  const width = 100 - 20 * idxFromCenter;
  const opacity = 1 - 0.5 * idxFromCenter;
  return {
    width: `${width}%`,
    height: `${width}%`,
    opacity
  };
};

const ChoosePlayer = ({ mode, step, changeStep, choosePlayer, activeIndex, playerChoiceSetIndex }) => {
  const firstIndex = activeIndex >= 1 ? activeIndex - 1 : heroes.length - 1;
  const lastIndex = activeIndex < heroes.length - 1 ? activeIndex + 1 : 0;
  const choices = [heroes[firstIndex], heroes[activeIndex], heroes[lastIndex]];
  const indices = [firstIndex, activeIndex, lastIndex];
  const playerIndex = mode === 1 || step === steps.CHOOSE_PLAYER1
    ? 0
    : 1;

  return (
    <div className="ChoosePlayer">
      <div className="ChoosePlayer__inner">
        {choices.map(({ id, name, images }, index) => (
          <div key={id} className="ChoosePlayer__character">
            <img
              key={id}
              src={images.lg}
              alt={name}
              style={getStyle(index)}
              onClick={() => playerChoiceSetIndex(indices[index])}
            />
          </div>
        ))}
      </div>
      <Button className="ChoosePlayer__btn" onClick={() => {
        const nextStep = (mode === 1 || step === steps.CHOOSE_PLAYER2) ? steps.PLAY : steps.CHOOSE_PLAYER2;
        changeStep(nextStep);
        choosePlayer(playerIndex, heroes[activeIndex]);
      }}>
        Choose!
      </Button>
    </div>
  );
};

const mapStateToProps = state => ({
  mode: state.mode,
  step: state.step,
  activeIndex: state.player.activeIndex
});

const mapDispatchToProps = {
  choosePlayer: choosePlayerAction,
  changeStep: changeStepAction,
  playerChoiceSetIndex: playerChoiceSetIndexAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChoosePlayer);
