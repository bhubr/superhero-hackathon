import React from "react";
import classNames from "classnames";

const Card = ({
  className,
  children
}) => (
  <div className={classNames('box Card', className)}>
  {children}
  </div>
);

Card.defaultProps = {
  className: ''
};

export default Card;
