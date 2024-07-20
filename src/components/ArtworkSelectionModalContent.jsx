import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { artworks } from '../test/artworks';

const fetchArtworks = async (ownedBy) => {
    console.log("artworks ", artworks);
    console.log("ownedBy ", ownedBy);
    console.log(artworks[ownedBy]);
    return artworks[ownedBy];
};

const ArtworkSelectionModalContent = ({ onArtworkSelect }) => {
    const [tab, setTab] = useState('ownedByUser');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: artworks, isLoading, error } = useQuery(
        ['artworks', tab, searchQuery],
        () => fetchArtworks(tab === 'ownedByUser' ? 'user' : 'others'),
        {
            enabled: true,
        }
    );

    const handleTabChange = (newTab) => {
        setTab(newTab);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    if (isLoading) return <div>Loading artworks...</div>;
    if (error) return <div>Error fetching artworks: {error.message}</div>;

    const filteredArtworks = artworks.filter(artwork => artwork.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className='w-full'>
            <div className="flex mb-4 w-full">
                <button
                    onClick={() => handleTabChange('ownedByUser')}
                    className={`flex-1 rounded-l-md px-4 py-2 ${tab === 'ownedByUser' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                    Yours
                </button>
                <button
                    onClick={() => handleTabChange('ownedByOthers')}
                    className={`flex-1 px-4 py-2 ${tab === 'ownedByOthers' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                    Others
                </button>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="flex-1 rounded-r-md border px-4 py-2"
                    placeholder="Search artworks"
                />
            </div>
            <div>
                {filteredArtworks.map((artwork) => (
                    <div key={artwork.artworkId} className="border p-2 mb-2 flex items-center justify-between rounded">
                        <div><strong>{artwork.title}</strong> by {artwork.artistName}</div>
                        <button
                            onClick={() => onArtworkSelect(artwork)}
                            className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">
                            Add
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArtworkSelectionModalContent;
