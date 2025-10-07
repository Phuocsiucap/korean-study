import React from 'react';

const ModeSelector = ({ mode, onSelectMode }) => {
  return (
    <div 
      onClick={() => onSelectMode(mode)}
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
    >
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${mode.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
        {mode.icon}
      </div>
      <h4 className="font-bold text-lg text-gray-800 mb-2">{mode.name}</h4>
      <p className="text-gray-600 text-sm">{mode.description}</p>
    </div>
  );
};

export default ModeSelector;