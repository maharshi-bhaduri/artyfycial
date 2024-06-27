import React from 'react';

const ArtworkDisplay = ({ art }) => {
    return (
        <div className="flex flex-col items-center">
            <img
                src={art.url}
                alt={art.title}
                className="object-contain max-w-full max-h-[400px]"
            />
            <h1 className="text-2xl font-bold mt-4">{art.title}</h1>
            <p className="mt-2">{art.description}</p>
        </div>
    );
};

export default ArtworkDisplay;
