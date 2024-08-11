import localforage from 'localforage';

let initialized = false;
let artyfycialStore;
let imageCache;

export const initializeLocalForage = () => {
    if (!initialized) {
        artyfycialStore = localforage.createInstance({
            name: 'artyfycial',
            storeName: 'artyfycialStore'
        });

        imageCache = localforage.createInstance({
            name: 'imageCache',
            storeName: 'images'
        });

        initialized = true;
    }
};

export const getCachedUrl = async (key) => {
    if (!imageCache) throw new Error("ImageCache is not initialized");

    const data = await imageCache.getItem(key);
    let result = null;

    if (data && data.expiry > Date.now()) {
        result = data.url;
    }

    return result;
};


export const setCachedUrl = async (urlData) => {
    if (!imageCache) throw new Error("ImageCache is not initialized");

    for (const [key, { url, expiry }] of Object.entries(urlData)) {
        await imageCache.setItem(key, { url, expiry });
    }
};
