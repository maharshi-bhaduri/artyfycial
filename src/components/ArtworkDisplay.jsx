import React, { useState } from 'react';
import Loader from './Loader';

const ArtworkDisplay = ({ art }) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {isLoading && <Loader />}
            <img
                src={art.url}
                alt={art.title}
                className={`object-contain max-w-full min-w-[200px] max-h-[400px] ${isLoading ? 'hidden' : 'block'}`}
                onLoad={handleImageLoad}
            />
        </div>
    );
};

export default ArtworkDisplay;
