import React from 'react';

const ProgressBar = ({ progress, color = 'from-purple-500 to-pink-500', height = 'h-2' }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full ${height}`}>
      <div 
        className={`bg-gradient-to-r ${color} ${height} rounded-full transition-all duration-500`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;