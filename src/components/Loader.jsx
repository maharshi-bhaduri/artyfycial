// Loader.jsx
import React from 'react';

const Loader = () => {
    return (
        <div className="flex flex-col items-center m-8">
            <div className="loader border-t-4 border-gray-500 rounded-full w-12 h-12 mb-4 animate-spin"></div>
        </div>
    );
};

export default Loader;
