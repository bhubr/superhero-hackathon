import React from 'react';
import { connect } from 'react-redux';
import Button from './Button';
import { hideAdModal as hideAdModalAction } from '../actions';

const AdModal = ({ close, returnToStart }) => {
  return (
    <div
      className="Modal"
    >
      <div
        className="Modal__inner"
      >
        <h2 className="Modal__title AdModal__title">Only in the <strong>paid</strong> version</h2>
        <div className="WinnerModal__buttons">
          <img className="PayPalLogo" src="https://i1.wp.com/fwab.org/wp-content/uploads/Paypal-logo-1.png" alt="Paypal" />
          <Button onClick={close}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  close: hideAdModalAction  
};

export default connect(null, mapDispatchToProps)(AdModal);
