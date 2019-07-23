import React from 'react';

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

export default Point;
