import React from "react";
import classNames from "classnames";

const Button = ({
  className,
  children,
  onClick
}) => (
  <button onClick={onClick} className={classNames('Button', className)}>
  {children}
  </button>
);

Button.defaultProps = {
  className: ''
};

export default Button;
