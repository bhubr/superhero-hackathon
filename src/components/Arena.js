import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";

const Arena = ({
  player1,
  player2
}) => (
  <div className="Arena">
    <div className="">
      <h3>{player1.name}</h3>
      <img className="Arena__character" src={player1.images.lg} />
    </div>


    <div className="">
      <h3>{player2.name}</h3>
      <img className="Arena__character" src={player2.images.lg} />
    </div>

  </div>
);



const mapStateToProps = state => ({
  player1: state.player.players[0],
  player2: state.player.players[1]
});

// const mapDispatchToProps = {
//   choosePlayer: choosePlayerAction,
//   changeStep: changeStepAction,
//   playerChoiceSetIndex: playerChoiceSetIndexAction
// };

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(Arena);

