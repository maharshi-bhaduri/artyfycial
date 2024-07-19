import React from 'react';

const ActiveIndicator = ({ isPulsing }) => {
    return (
        <div
            className={`w-3 h-3 rounded-full ${isPulsing
                ? 'bg-green-500 animate-pulse'
                : 'bg-green-600'
                } ${isPulsing ? 'transition-all duration-500 ease-in-out' : ''}`}
        />
    );
};

export default ActiveIndicator;
