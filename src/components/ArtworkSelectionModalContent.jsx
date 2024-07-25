import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import axios from 'axios';
import Loader from './Loader';
import { useParams } from 'react-router-dom';

const fetchArtworks = async (searchQuery) => {
    const params = {
        artistId: localStorage.getItem('userId'),
        searchQuery: searchQuery ? encodeURIComponent(searchQuery) : ''
        // limit: 10,
    };

    const response = await axios.get(`${import.meta.env.VITE_APP_GET_ARTWORK_LIST}`, { params });
    return response.data.artworks;
};

const saveChangesToBackend = async (auctionId, addedArtworks, removedArtworks) => {
    const response = await axios.post(`${import.meta.env.VITE_APP_UPDATE_AUCTION_ARTWORK_LIST}`, { auctionId, addedArtworks, removedArtworks });
    return response.data;
};

const ArtworkSelectionModalContent = ({ onArtworkSelect, initialSelected, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [selectedArtworks, setSelectedArtworks] = useState([]);
    const [removedArtworks, setRemovedArtworks] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const queryClient = useQueryClient();
    const { auctionId } = useParams();

    const { data: artworks, isLoading, error } = useQuery(
        ['artworks', searchQuery],
        () => fetchArtworks(searchQuery),
        {
            enabled: true,
        }
    );

    console.log('selectedArtworks ', selectedArtworks)
    console.log('removedArtworks ', removedArtworks)
    console.log('initialSelected ', initialSelected)

    useEffect(() => {
        queryClient.invalidateQueries(['artworks', '']);
    }, [queryClient]);

    const handleSearchChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setSearchQuery(inputValue);
        }
    };

    const handleArtworkAdd = (artworkId) => {
        if (removedArtworks.includes(artworkId)) {
            setRemovedArtworks(removedArtworks.filter(id => id !== artworkId));
        } else {
            setSelectedArtworks([...selectedArtworks, artworkId]);
        }
    };

    const handleArtworkRemove = (artworkId) => {
        if (selectedArtworks.includes(artworkId)) {
            setSelectedArtworks(selectedArtworks.filter(id => id !== artworkId));
        } else {
            setRemovedArtworks([...removedArtworks, artworkId]);
        }
    };

    const { mutate: updateAuctionArtworkMutation } = useMutation(
        () => saveChangesToBackend(auctionId, selectedArtworks, removedArtworks),
        {
            onSuccess: () => {
                console.log('Artworks updated successfully');
                setIsSaving(false);
                setRemovedArtworks([]);
                setSelectedArtworks([]);
                queryClient.invalidateQueries(['auctionDetails', auctionId]);
                onClose();
            },
            onError: (error) => {
                console.error('Error updating artworks:', error);
                setIsSaving(false);
            },
        }
    );

    const handleSaveChanges = () => {
        setIsSaving(true);
        updateAuctionArtworkMutation();
    };

    if (isLoading) return <div className='flex justify-center items-center h-full'><Loader /></div>;
    if (error) return <div>Error fetching artworks: {error.message}</div>;

    const filteredArtworks = artworks?.filter(artwork => artwork.title.toLowerCase().includes(searchQuery.toLowerCase())) || [];

    return (
        <div>
            <div className="flex mb-4 w-full">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1 rounded-md border px-4 py-2"
                    placeholder="Search artworks"
                />
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${(selectedArtworks.length > 0 || removedArtworks.length > 0) ? 'mb-16' : ''}`}>
                {filteredArtworks.map((artwork) => (
                    <div key={artwork.artworkId} className={`border p-2 rounded-md ${(selectedArtworks.includes(artwork.artworkId) || (initialSelected.includes(artwork.artworkId) && !removedArtworks.includes(artwork.artworkId))) ? 'border-blue-500' : removedArtworks.includes(artwork.artworkId) ? 'border-red-500' : ''}`}>
                        <div className="aspect-w-1 aspect-h-1">
                            <img src={artwork.url}
                                alt={artwork.title}
                                className="object-cover w-full h-full rounded"
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <strong>{artwork.title}</strong>
                            {(selectedArtworks.includes(artwork.artworkId) ||
                                (initialSelected.includes(artwork.artworkId) && !removedArtworks.includes(artwork.artworkId))) ?
                                <button
                                    onClick={() => handleArtworkRemove(artwork.artworkId)}
                                    className="bg-red-500 text-white px-4 py-2 ml-2 rounded">
                                    Remove
                                </button>
                                :
                                <button
                                    onClick={() => handleArtworkAdd(artwork.artworkId)}
                                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">
                                    Add
                                </button>
                            }
                        </div>
                    </div>
                ))}
            </div>
            {(selectedArtworks.length > 0 || removedArtworks.length > 0) && (
                <div className="fixed bottom-0 left-0 w-full p-4 rounded-md shadow-2xl flex justify-center">
                    <button
                        onClick={handleSaveChanges}
                        className={`bg-blue-500 text-white px-4 py-2 rounded ${isSaving && 'bg-gray-500'}`}
                        disabled={isSaving}>
                        {isSaving ? 'Saving changes...' : 'Save Changes'}
                    </button>
                </div>
            )
            }
        </div >
    );
};

export default ArtworkSelectionModalContent;
