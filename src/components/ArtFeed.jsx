import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import ArtFeedItem from './ArtFeedItem';

const fetchArtfeed = async () => {
    const response = await axios.get(import.meta.env.VITE_APP_GET_FEED);
    const artworkList = response.data['artworks'];
    if (Array.isArray(artworkList)) {
        return artworkList;
    } else {
        throw new Error('API response is not an array');
    }
};

const ArtFeed = () => {
    const { data: artfeed, error, isLoading } = useQuery('artfeed', fetchArtfeed,
        {
            staleTime: 1000 * 60 * 5
        }
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching artfeed: {error.message}</div>;

    return (
        <div className='flex justify-center'>
            <div className='w-2/3'>
                <h1>Artfeed</h1>
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
