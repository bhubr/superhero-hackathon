import React from 'react';
import { connect } from 'react-redux';
import Button from './Button';
import { returnToStart as returnToStartAction } from '../actions';
import './WinnerModal.css';

const WinnerModal = ({ winner, replay, returnToStart }) => {
  return (
    <div
      className="Modal"
    >
      <div
        className="Modal__inner"
      >
        <h2 className="Modal__title">{winner.name} wins!!</h2>
        <div className="WinnerModal__buttons">
          <Button onClick={replay}>
            Play again with same opponents
          </Button>
          <Button onClick={returnToStart}>
            Play again with other opponents
          </Button>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  returnToStart: returnToStartAction
};

export default connect(null, mapDispatchToProps)(WinnerModal);
