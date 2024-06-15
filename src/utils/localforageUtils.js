import localforage from 'localforage';

let initialized = false;

export const initializeLocalForage = () => {
    if (!initialized) {
        localforage.config({
            name: 'artyfycial',
            storeName: 'artyfycialStore'
        });
        initialized = true;
    }
};
