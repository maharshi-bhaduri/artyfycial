import React, { useState, useEffect } from 'react';

const extractImageId = (url) => {
    const match = url.match(/images\/([^\/?]+)\.jpeg/);
    return match ? match[1] : null;
};

const getCachedData = (imageId) => {
    return JSON.parse(localStorage.getItem(imageId));
};

const setCachedData = (imageId, data) => {
    localStorage.setItem(imageId, JSON.stringify(data));
};

const CachedImage = ({ src, ...props }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const imageId = extractImageId(src);
    console.log("loading image from cached image.")

    useEffect(() => {
        if (imageId) {
            const cachedData = getCachedData(imageId);
            if (cachedData) {
                setImageUrl(cachedData.currentUrl);
            } else {
                // If no cached data, store the initial src as the current URL
                setImageUrl(src);
                setCachedData(imageId, { currentUrl: src, fallbackUrl: src });
            }
        }
    }, [src, imageId]);

    const handleError = () => {
        const cachedData = getCachedData(imageId);
        if (cachedData && cachedData.fallbackUrl) {
            // Copy fallbackUrl to currentUrl
            cachedData.currentUrl = cachedData.fallbackUrl;
            setCachedData(imageId, cachedData);
            // Update the image source to use the fallback URL
            setImageUrl(cachedData.currentUrl);
        }
    };

    useEffect(() => {
        const cachedData = getCachedData(imageId);
        if (cachedData && cachedData.currentUrl !== src) {
            // Update fallback URL only if the src is different from current cached URL
            cachedData.fallbackUrl = src;
            setCachedData(imageId, cachedData);
        }
    }, [src, imageId]);

    return <img src={imageUrl} onError={handleError} {...props} />;
};

export default CachedImage;
