// src/components/ArtFeed.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArtFeedItem from './ArtFeedItem';

const ArtFeed = () => {
    const [artfeed, setArtfeed] = useState([]);

    useEffect(() => {
        const fetchArtfeed = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_APP_GET_FEED);
                const artworkList = response.data['artworks'];
                if (Array.isArray(artworkList)) {
                    setArtfeed(artworkList);
                } else {
                    console.error('API response is not an array:', artworkList);
                }
            } catch (error) {
                console.error('Error fetching artfeed:', error);
            }
        };

        fetchArtfeed();
    }, []);

    return (
        <div className='flex justify-center'>
            <div className='w-2/3'>
                <h1>Artfeed Feed</h1>
                <ul>
                    {artfeed.map((art) => (
                        <ArtFeedItem key={art.artworkId} art={art} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ArtFeed;
