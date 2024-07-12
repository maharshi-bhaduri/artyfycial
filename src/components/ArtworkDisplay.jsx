import React from 'react';

const ArtworkDisplay = ({ art }) => {
    return (
        <div className="flex flex-col items-center">
            <img
                src={art.url}
                alt={art.title}
                className="object-contain max-w-full max-h-[400px]"
            />
        </div>
    );
};

export default ArtworkDisplay;
