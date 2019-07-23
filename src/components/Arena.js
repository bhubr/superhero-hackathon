import React, { Component, createRef } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import ProgressBar from "./ProgressBar";
import Point from "./Point";
import WinnerModal from "./WinnerModal";
import "./Arena.css";

const TIME_INCR = 200;
const SPEED_DECR_X = 0.3;
const SPEED_DECR_Y = 1.5;
const STRIKE_POINTS = 10;

const PlayerStats = ({
  player: {
    powerstats: { durability: origLife }
  },
  currentLife
}) => (
  <div className="PlayerStats">
    <ProgressBar progress={(100 * currentLife) / origLife} inverted />
    <p>{currentLife}</p>
  </div>
);

class Arena extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.player1Ref = createRef();
    this.player2Ref = createRef();
    this.chargeInterval = null;
    this.missileInterval = null;
    this.showStrike = this.showStrike.bind(this);
    this.hideStrike = this.hideStrike.bind(this);
    this.onKeyPressStart = this.onKeyPressStart.bind(this);
    this.onKeyPressStop = this.onKeyPressStop.bind(this);
    this.chargeUp = this.chargeUp.bind(this);
    this.switchPlayer = this.switchPlayer.bind(this);
    this.showWinner = this.showWinner.bind(this);
    this.replay = this.replay.bind(this);
    this.checkTurnOver = this.checkTurnOver.bind(this);
    this.clearTurnAndSwitch = this.clearTurnAndSwitch.bind(this);
  }

  componentDidMount() {
    this.initializeTransitions(0);
    this.initializeTransitions(1);
    document.addEventListener("mousedown", this.onKeyPressStart);
    document.addEventListener("mouseup", this.onKeyPressStop);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.onKeyPressStart);
    document.removeEventListener("mouseup", this.onKeyPressStop);
  }

  componentDidUpdate(prevProps, prevState) {
    const { strike, otherPlayerDies } = this.state;
    if (strike && strike !== prevState.strike) {
      this.showStrike();
      setTimeout(this.hideStrike, 1000);
    }
    if (otherPlayerDies !== false && otherPlayerDies !== prevState.otherPlayerDies) {
      this.showWinner();
    }
  }

  getInitialState() {
    return {
      playerIdx: 0,
      degrees: [0, 0],
      playerIndex: 0,
      charge: 0,
      firing: true,
      target: {
        x: 0,
        y: 0
      },
      speedX: 0,
      speedY: 0,
      posX: 0,
      posY: 0,
      missileVisible: false,
      playersLife: [
        this.props.player1.powerstats.durability,
        this.props.player2.powerstats.durability
      ],
      strike: false,
      otherPlayerDies: false,
      showWinner: false,
      turnOver: false
    };
  }

  replay() {
    console.log(this.getInitialState());
    this.setState(this.getInitialState());
  }

  showStrike() {
    this.setState({ showStrike: true });
  }

  hideStrike() {
    this.setState({ showStrike: false });
  }

  showWinner() {
    this.setState({ showWinner: true });
  }

  onKeyPressStart(e) {
    const { showWinner } = this.state;
    if (this.chargeInterval || showWinner) return;
    const { clientX: targetX, clientY: targetY } = e;
    const { playerIdx } = this.state;
    const playerRef = playerIdx === 0 ? this.player1Ref : this.player2Ref;
    const playerRect = playerRef.current.getBoundingClientRect();
    const playerX = playerRect.left + (playerRect.right - playerRect.left) / 2;
    const playerY = playerRect.top - (playerRect.top - playerRect.bottom) / 2;
    this.setState({
      targetX,
      targetY,
      playerX,
      playerY,
      posX: playerX,
      posY: playerY
    });
    this.chargeInterval = setInterval(this.chargeUp, 100);
  }

  onKeyPressStop(e) {
    const { showWinner } = this.state;
    if (!this.chargeInterval || showWinner) return;
    clearInterval(this.chargeInterval);
    this.chargeInterval = null;
    this.fire();
  }

  chargeUp() {
    this.setState(({ charge }) => ({ charge: Math.min(charge + 5, 100) }));
  }

  startTrajectory() {
    this.missileInterval = setInterval(
      () =>
        this.setState(
          ({
            speedX,
            speedY,
            posX,
            posY,
            playerIdx,
            playersLife,
            turnOver
          }) => {
            console.log('traj')
            const otherPlayerRef =
              playerIdx === 0 ? this.player2Ref : this.player1Ref;
            const newPlayersLife = [...playersLife];
            const opRect = otherPlayerRef.current.getBoundingClientRect();
            const newSpeedY = speedY - SPEED_DECR_Y;
            const newSpeedX = speedX - SPEED_DECR_X;
            const newPosX = posX + speedX;
            const newPosY = posY - speedY;
            let missileVisible = true;
            let strike = false;
            let otherPlayerDies = false;
            let newTurnOver = false;
            let damage;
            if (
              newPosX >= opRect.left &&
              newPosX <= opRect.right &&
              newPosY >= opRect.top &&
              newPosY <= opRect.bottom
            ) {
              const otherPlayerIdx = (playerIdx + 1) % 2;
              const { player1, player2 } = this.props;
              const player = playerIdx === 0 ? player1 : player2;
              damage =
                STRIKE_POINTS +
                player.powerstats.combat / 4 +
                Math.floor(3 * Math.random());
              newPlayersLife[otherPlayerIdx] -= damage;
              if (newPlayersLife[otherPlayerIdx] < 0) newPlayersLife[otherPlayerIdx] = 0;
              otherPlayerDies =
                newPlayersLife[otherPlayerIdx] <= 0 ? otherPlayerIdx : false;
              console.log(newPlayersLife[otherPlayerIdx], otherPlayerDies);
              strike = true;
              newTurnOver = true;
            }
            if (
              (newPosX < 0 || newPosX > window.innerWidth) &&
              (newPosY < 0 || newPosY > window.innerHeight)
            ) {
              missileVisible = false;
              newTurnOver = true;
            }
            return {
              speedX: newSpeedX,
              speedY: newSpeedY,
              posX: newPosX,
              posY: newPosY,
              missileVisible,
              strike,
              playersLife: newPlayersLife,
              otherPlayerDies,
              turnOver: newTurnOver,
              damage
            };
          },
          this.checkTurnOver
        ),
      50
    );
  }

  checkTurnOver() {
    const { turnOver } = this.state;
    if (turnOver) {
      setTimeout(this.clearTurnAndSwitch, 40);
    }
  }

  clearTurnAndSwitch() {
    clearInterval(this.missileInterval);
    this.missileInterval = null;
    this.setState({
      turnOver: false,
      missileVisible: false
    });
    this.switchPlayer();
  }

  fire() {
    const {
      charge,
      playerIdx,
      targetX,
      targetY,
      playerX,
      playerY
    } = this.state;
    const diffX = targetX - playerX;
    const diffY = -targetY + playerY;
    const diagonal = Math.sqrt(diffX ** 2 + diffY ** 2);
    const cos = diffX / diagonal;
    const sin = diffY / diagonal;
    const speedX = charge * cos;
    const speedY = charge * sin;
    this.setState(
      {
        speedX,
        speedY,
        posX: playerX,
        posY: playerY,
        missileVisible: true,
        targetX: 0,
        targetY: 0
      },
      this.startTrajectory
    );

    setTimeout(() => this.setState({ charge: 0 }), 250);
  }

  switchPlayer() {
    this.setState(({ playerIdx }) => ({
      playerIdx: (playerIdx + 1) % 2
    }));
  }

  initializeTransitions(idx) {
    let time = Math.floor(TIME_INCR / 2 * Math.random());
    let deg = Math.sin(time);
    setInterval(() => {
      const rand = (1 + Math.random()) * 0.1;
      time = time + ((rand * Math.PI) % (2 * Math.PI));
      deg = (Math.sin(time) * 10).toFixed(1);
      this.setState(({ degrees: prevDegrees }) => {
        const degrees = [...prevDegrees];
        degrees.splice(idx, 1, deg);
        return { degrees };
      });
    }, TIME_INCR);
  }

  render() {
    const { player1, player2 } = this.props;
    const {
      degrees,
      charge,
      firing,
      playerIdx,
      posX,
      posY,
      speedX,
      speedY,
      targetX,
      targetY,
      playerX,
      playerY,
      missileVisible,
      showStrike,
      playersLife,
      otherPlayerDies,
      showWinner,
      damage
    } = this.state;
    const player = playerIdx ? player2 : player1;
    return (
      <div className="Arena">
        {showWinner && (
          <WinnerModal
            winner={otherPlayerDies === 1 ? player1 : player2}
            replay={this.replay}
          />
        )}
        <div className="Arena__title">
          Player {playerIdx + 1}{" "}
          <span className="Arena__playerName">{player.name}</span> plays!
        </div>
        <Point x={playerX || -10} y={playerY || -10} />
        <Point x={targetX || -10} y={targetY || -10} />
        <Point
          className={classNames("Arena__missile", {
            "Arena__missile--visible": missileVisible
          })}
          x={posX}
          y={posY}
          radius={10}
        />

        <ProgressBar progress={charge} />

        <div className="Arena__inner">
          <div
            ref={this.player1Ref}
            className="Arena__Player player1"
            style={{ transform: `rotate(${degrees[0]}deg)`, top: degrees[0] }}
          >
            <img className="Arena__character" src={player1.images.sm} />
          </div>

          <div
            ref={this.player2Ref}
            className="Arena__Player player2"
            style={{ transform: `rotate(${degrees[1]}deg)`, top: degrees[1] }}
          >
            <img className="Arena__character" src={player2.images.sm} />
          </div>
        </div>

        {
          showStrike && (
            <div className="Arena__strike">
              <h2>Strike</h2>
              <p>{damage} damage points!!!</p>
            </div>
          )
        }

        <div className="Arena__PlayerStats__wrapper">
          <PlayerStats player={player1} currentLife={playersLife[0]} />
          <PlayerStats player={player2} currentLife={playersLife[1]} />
        </div>
        {/*<div className="Arena__stats">
          speed {speedX},{speedY}
          post {posX},{posY}
        </div>*/}
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
