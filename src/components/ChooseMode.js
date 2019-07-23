import React from "react";
import Card from "./Card";
import { connect } from "react-redux";
import {
  chooseMode as chooseModeAction,
  changeStep as changeStepAction,
  showAdModal as showAdModalAction
} from "../actions";
import AdModal from './AdModal';
import steps from "../data/steps";

const ChooseMode = ({ chooseMode, changeStep, adModalShown, showAdModal }) => (
  <div className="ChooseMode">
    {
      adModalShown && <AdModal />
    }
    <h1 className="ChooseMode__title">Hero Bomb Fight</h1>
    <div className="row">
      <div className="col-xs-offset-2 col-md-4">
        <Card>
          <h2
            className="text-disabled"
            onClick={() => {
              // chooseMode(1);
              // changeStep(steps.CHOOSE_PLAYER1);
              showAdModal();
            }}
          >
            1 player vs computer
          </h2>
        </Card>
      </div>
      <div className="col-md-4">
        <Card>
          <h2
            onClick={() => {
              chooseMode(2);
              changeStep(steps.CHOOSE_PLAYER1);
            }}
          >
            2 players
          </h2>
        </Card>
      </div>
    </div>
  </div>
);

const mapStateToProps = state => ({
  adModalShown: state.adModal
});

const mapDispatchToProps = {
  showAdModal: showAdModalAction,
  chooseMode: chooseModeAction,
  changeStep: changeStepAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseMode);
