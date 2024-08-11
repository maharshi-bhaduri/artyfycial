import React from 'react';
import useCachedImageUrl from '..hooks/useCachedImageUrl';

const CachedImage = ({ key }) => {
    const url = useCachedImageUrl(key);

    if (!url) {
        return <div>Loading...</div>;
    }

    return (
        <div className="image-container">
            <img src={url} alt={`Cached ${key}`} />
        </div>
    );
};

export default CachedImage;
