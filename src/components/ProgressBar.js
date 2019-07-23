import React from 'react';
import './ProgressBar.css';

const getColor = (progress, inverted) => {
  const percent = !inverted ? progress : (100 - progress);
  if (percent < 5) {
    return "#C4FDCF";
  }
  if (percent < 10) {
    return "#97FBA5";
  }
  if (percent < 20) {
    return "#4FF249";
  }
  if (percent < 40) {
    return "#5AE413";
  }
  if (percent < 60) {
    return "#A6CD00";
  }
  if (percent < 80) {
    return "#AC6600";
  }
  return "#870000";
};

const getProgressStyle = (progress, inverted) => ({
  width: `${progress}%`,
  backgroundColor: getColor(progress, inverted)
});

const ProgressBar = ({ progress, inverted }) => (
  <div className="ProgressBar">
    <div
      className="ProgressBar__inner"
      style={getProgressStyle(progress, inverted)}
    />
  </div>
);

ProgressBar.defaultProps = {
  inverted: false
};

export default ProgressBar;
