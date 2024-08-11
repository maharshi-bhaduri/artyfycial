import { useEffect, useState } from 'react';
import { getCachedUrls, setCachedUrls } from '../utils/localforageUtils'; // Adjust the import path as needed

const useCachedImageUrl = (cacheKey, fallbackUrl) => {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        const fetchUrl = async () => {
            const cachedUrls = await getCachedUrls([cacheKey]);
            if (cachedUrls[cacheKey]) {
                setUrl(cachedUrls[cacheKey]);
            } else {
                setUrl(fallbackUrl);

                const expiry = Date.now() + 60 * 60 * 1000;
                await setCachedUrls({ [cacheKey]: { url: fallbackUrl, expiry } });
            }
        };
        fetchUrl();
    }, [cacheKey, fallbackUrl]);

    return url;
};

export default useCachedImageUrl;
