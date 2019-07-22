import React, { Component } from "react";
import classNames from "classnames";
import { connect } from "react-redux";

const TIME_INCR = 500;

class Arena extends Component {
  constructor(props) {
    super(props);
    this.state = {
      degrees: [0, 0]
    }
  }

  componentDidMount() {
    this.initializeTransitions(0);
    this.initializeTransitions(1);
  }

  initializeTransitions(idx) {
    let time = Math.floor(TIME_INCR * Math.random());
    let deg = Math.sin();
    setInterval(
      () => {
        time += (TIME_INCR / 250);
        deg = Math.sin(time) * 5;
        this.setState(
          ({ degrees: prevDegrees }) => {
            console.log(deg);
            const degrees = [...prevDegrees];
            degrees.splice(idx, 1, deg);
            console.log(degrees);
            return { degrees };
          }
        )
      },
      TIME_INCR
    )
  }

  render() {
    const { player1, player2 } = this.props;
    const { degrees } = this.state;
    return (
      <div className="Arena">
        <div className="Arena__Player" style={{ transform: `rotate(${degrees[0]}deg)` }}>
          <h3>{player1.name}</h3>
          <img className="Arena__character" src={player1.images.md} />
        </div>

        <div className="Arena__Player" style={{ transform: `rotate(${degrees[1]}deg)` }}>
          <h3>{player2.name}</h3>
          <img className="Arena__character" src={player2.images.md} />
        </div>
      </div>
    );
  }
}

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
  mapStateToProps
  // mapDispatchToProps
)(Arena);
