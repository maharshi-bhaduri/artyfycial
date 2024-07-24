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

const ArtworkSelectionModalContent = ({ onArtworkSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [selectedArtworks, setSelectedArtworks] = useState([]);
    const [removedArtworks, setRemovedArtworks] = useState([]);
    const [changesMade, setChangesMade] = useState(false);
    const queryClient = useQueryClient();
    const { auctionId } = useParams();

    const { data: artworks, isLoading, error } = useQuery(
        ['artworks', searchQuery],
        () => fetchArtworks(searchQuery),
        {
            enabled: true,
        }
    );

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

    const handleArtworkToggle = (artwork) => {
        console.log("artwork: ", artwork.artworkId)
        const isSelected = selectedArtworks.includes(artwork.artworkId);
        const isRemoved = removedArtworks.includes(artwork.artworkId);
        console.log("isSelected: ", isSelected)
        console.log("isRemoved: ", isRemoved)

        if (isSelected && !isRemoved) {
            setSelectedArtworks(selectedArtworks.filter(id => id !== artwork.artworkId));
            setRemovedArtworks([...removedArtworks, artwork.artworkId]);
        } else if (!isSelected && isRemoved) {
            setRemovedArtworks(removedArtworks.filter(id => id !== artwork.artworkId));
        } else {
            setSelectedArtworks([...selectedArtworks, artwork.artworkId]);
        }
        setChangesMade(true);
        console.log("selected list: ", selectedArtworks)
        console.log("removed list: ", removedArtworks)
    };
    console.log("selected list: ", selectedArtworks)
    console.log("removed list: ", removedArtworks)

    const mutation = useMutation(saveChangesToBackend, {
        onSuccess: () => {
            setChangesMade(false);
            setSelectedArtworks([]);
            setRemovedArtworks([]);
        },
        onError: (error) => {
            console.error('Error saving changes:', error);
        },
    });

    const handleArtworkAdd = (artworkId) => {
        if (removedArtworks.includes(artworkId)) {
            setRemovedArtworks(removedArtworks.filter(id => id !== artworkId));
        } else {
            setSelectedArtworks([...selectedArtworks, artworkId]);
        }
        // setChangesMade(true);
    };

    const handleArtworkRemove = (artworkId) => {
        if (selectedArtworks.includes(artworkId)) {
            setSelectedArtworks(selectedArtworks.filter(id => id !== artworkId));
        } else {
            setRemovedArtworks([...removedArtworks, artworkId]);
        }
        // setChangesMade(true);
    };

    const { mutate: updateAuctionArtworkMutation } = useMutation(
        () => saveChangesToBackend(auctionId, selectedArtworks, removedArtworks),
        {
            onSuccess: () => {
                console.log('artwork added')
            },
            onError: (error) => {
                console.error('Error deleting artwork:', error);
            },
        }
    );

    const handleSaveChanges = () => {
        const changes = {
            added: selectedArtworks,
            removed: removedArtworks,
        };
        updateAuctionArtworkMutation(changes);
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
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${changesMade ? 'mb-16' : ''}`}>
                {filteredArtworks.map((artwork) => (
                    <div key={artwork.artworkId} className={`border p-2 rounded-md ${selectedArtworks.includes(artwork.artworkId) ? 'border-blue-500' : removedArtworks.includes(artwork.artworkId) ? 'border-red-500' : ''}`}>
                        <div className="aspect-w-1 aspect-h-1">
                            <img src={artwork.url}
                                alt={artwork.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <strong>{artwork.title}</strong>
                            {selectedArtworks.includes(artwork.artworkId) ?
                                <button
                                    onClick={() => handleArtworkRemove(artwork.artworkId)}
                                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">
                                    Remove
                                </button>
                                :
                                <button
                                    onClick={() => handleArtworkAdd(artwork.artworkId)}
                                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">
                                    {/* {selectedArtworks.includes(artwork.artworkId) && !removedArtworks.includes(artwork.artworkId) ? 'Remove' : 'Add'} */}
                                    Add
                                </button>
                            }
                        </div>
                    </div>
                ))}
            </div>
            {(selectedArtworks.length > 0 || removedArtworks.length > 0) && (
                <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg">
                    <button
                        onClick={handleSaveChanges}
                        className="bg-green-500 text-white px-4 py-2 rounded">
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default ArtworkSelectionModalContent;
