import React, { Component, createRef } from "react";
import classNames from "classnames";
import { connect } from "react-redux";

const TIME_INCR = 200;
const SPEED_DECR_X = 0.3;
const SPEED_DECR_Y = 1.5;

const Point = ({ className, x, y, radius }) => {
  const width = 2 * radius;
  const height = 2 * radius;
  return (
    <div
      className={className}
      style={{
        borderRadius: radius,
        top: `${y}px`,
        left: `${x}px`,
        position: "absolute",
        width,
        height,
        background: "#fca"
      }}
    />
  );
};

Point.defaultProps = {
  className: "",
  radius: 5
};

const getColor = charge => {
  if (charge < 5) {
    return "#B8C2BD";
  }
  if (charge < 10) {
    return "#97C3AB";
  }
  if (charge < 10) {
    return "#76C495";
  }
  if (charge < 20) {
    return "#3CC858";
  }
  if (charge < 30) {
    return "#2CD012";
  }
  if (charge < 40) {
    return "#93DC00";
  }
  if (charge < 50) {
    return "#EC9C00";
  }
  return "#FF0000";
};

const getProgressStyle = charge => ({
  width: `${charge}%`,
  backgroundColor: getColor(charge)
});

class Arena extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      missileVisible: false
    };
    this.player1Ref = createRef();
    this.player2Ref = createRef();
    this.onKeyPressStart = this.onKeyPressStart.bind(this);
    this.onKeyPressStop = this.onKeyPressStop.bind(this);
    this.chargeUp = this.chargeUp.bind(this);
    this.chargeInterval = null;
    this.missileInterval = null;
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

  onKeyPressStart(e) {
    if (this.chargeInterval) return;
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
    if (!this.chargeInterval) return;
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
        this.setState(({ speedX, speedY, posX, posY }) => {
          const newSpeedY = speedY - SPEED_DECR_Y;
          const newSpeedX = speedX - SPEED_DECR_X;
          const newPosX = posX + speedX;
          const newPosY = posY - speedY;
          let missileVisible = true;
          if (
            (newPosX < 0 || newPosX > window.innerWidth) &&
            (newPosY < 0 || newPosY > window.innerHeight)
          ) {
            missileVisible = false;
            clearInterval(this.missileInterval);
            this.missileInterval = null;
          }
          return {
            speedX: newSpeedX,
            speedY: newSpeedY,
            posX: newPosX,
            posY: newPosY,
            missileVisible
          };
        }),
      50
    );
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
      { speedX, speedY, posX: playerX, posY: playerY, missileVisible: true, targetX: 0, targetY: 0 },
      this.startTrajectory
    );

    setTimeout(() => this.setState({ charge: 0 }), 250);

    setTimeout(() => this.setState({ playerIdx: (playerIdx + 1) % 2 }), 1000);
  }

  initializeTransitions(idx) {
    let time = Math.floor(TIME_INCR * Math.random());
    let deg = Math.sin(time);
    setInterval(() => {
      time += 0.125 * Math.PI;
      deg = (Math.sin(time) * 5).toFixed(1);
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
      missileVisible
    } = this.state;
    const player = playerIdx ? player2 : player1;
    return (
      <div className="Arena">
        <div className="Arena__title">Player {playerIdx + 1} <strong>{player.name}</strong> plays!</div>
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
        <div className="Arena__ProgressBar">
          <div
            className="Arena__ProgressBar__inner"
            style={getProgressStyle(charge)}
          />
        </div>

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

        {/*<div className="Arena__stats">
          speed {speedX},{speedY}
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
