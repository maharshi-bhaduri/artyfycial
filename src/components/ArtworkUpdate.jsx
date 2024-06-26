import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal';  // Import the modal component


const fetchArtworkDetails = async (artworkId) => {
    const response = await axios.get(`${import.meta.env.VITE_APP_GET_ARTWORK_DETAILS}?artworkId=${artworkId}`);
    return response.data;
};

const updateArtworkDetails = async (artworkId, updatedDetails) => {
    const response = await axios.post(import.meta.env.VITE_APP_UPDATE_ARTWORK, {
        artworkId,
        ...updatedDetails,
    });
    return response.data;
};

const deleteArtwork = async (artworkId) => {
    const response = await axios.post(import.meta.env.VITE_APP_DELETE_ARTWORK,
        { artworkId },
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
    return response.data;
};

const ArtworkUpdate = () => {
    const { artworkId } = useParams();
    const navigate = useNavigate();
    const { data: artworkDetails, error, isLoading } = useQuery(
        ['artworkDetails', artworkId],
        () => fetchArtworkDetails(artworkId),
        {
            staleTime: 1000 * 60 * 5
        }
    );
    const [formData, setFormData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && artworkDetails && !formData) {
            setFormData({
                url: artworkDetails.url || '',
                title: artworkDetails.title || '',
                description: artworkDetails.description || '',
                isActive: artworkDetails.isActive || false,
                isPublic: artworkDetails.isPublic || false,
            });
        }
    }, [isLoading, artworkDetails, formData]);

    const { mutate: updateArtwork, isLoading: isUpdating } = useMutation(
        (updatedDetails) => updateArtworkDetails(artworkId, updatedDetails),
        {
            onSuccess: () => {
                console.log('Artwork details updated successfully');
            },
            onError: (error) => {
                console.error('Error updating artwork details:', error);
            },
        }
    );

    const { mutate: deleteArtworkMutation, isLoading: isDeleting } = useMutation(
        () => deleteArtwork(artworkId),
        {
            onSuccess: () => {
                navigate('/discover');
            },
            onError: (error) => {
                console.error('Error deleting artwork:', error);
            },
        }
    );

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateArtwork(formData);
    };

    const handleDelete = () => {
        deleteArtworkMutation();
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching artwork details: {error.message}</div>;

    return (
        <div className="w-full p-4">
            <form onSubmit={handleSubmit}>
                <div className="flex">
                    <div className="w-1/2">
                        <img src={artworkDetails.url} alt="Artwork" className="max-w-full h-auto" />
                    </div>
                    <div className="w-1/2 px-4">
                        <input
                            type="text"
                            name="title"
                            value={formData?.title || ''}
                            onChange={handleChange}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Title"
                            required
                        />
                        <textarea
                            name="description"
                            value={formData?.description || ''}
                            onChange={handleChange}
                            className="block w-full mt-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            rows="4"
                            placeholder="Description"
                        />
                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData?.isActive || false}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                Active
                            </label>
                        </div>
                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                name="isPublic"
                                checked={formData?.isPublic || false}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                                Public
                            </label>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Updating...' : 'Update Artwork'}
                            </button>
                            <button
                                type="button"
                                onClick={openModal}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                Delete Artwork
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <ConfirmationModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default ArtworkUpdate;
