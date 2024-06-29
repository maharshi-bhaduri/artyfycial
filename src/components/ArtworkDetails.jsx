import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import ArtworkDisplay from './ArtworkDisplay';
import axios from 'axios';

const ArtworkDetails = () => {
    const { artworkId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [isManageMenuOpen, setManageMenuOpen] = useState(false);
    const manageMenuRef = useRef(null);
    const [artistId, setArtistId] = useState('');
    const userId = useRef(localStorage.getItem('userId'));

    const artFromState = location.state?.art;

    const { data: art, error, isLoading } = useQuery(
        ['artworkDetails', artworkId],
        () => fetchArtworkDetails(artworkId),
        {
            enabled: !artFromState, // Only fetch if art is not passed from the previous page
            initialData: artFromState, // Set initial data if passed from the previous page
        }
    );

    useEffect(() => {
        if (artFromState) {
            setArtistId(artFromState.artistId.toString());
        }
    }, []);

    const fetchArtworkDetails = async (artworkId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_GET_ARTWORK_DETAILS}?artworkId=${artworkId}`);
            setArtistId(response.data.artistId.toString()); // Ensure artistId is stored as string
            return response.data;
        } catch (error) {
            console.error('Error fetching artwork details:', error);
            throw new Error('Failed to fetch artwork details');
        }
    };

    const handleClickOutside = (event) => {
        if (manageMenuRef.current && !manageMenuRef.current.contains(event.target)) {
            setManageMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // const handleEdit = () => {
    //     navigate(`/edit/${artworkId}`, {
    //         state: { art }
    //     });
    // };

    const handleDelete = async () => {
        try {
            await axios.post(import.meta.env.VITE_APP_DELETE_ARTWORK, { artworkId });
            navigate('/discover');
        } catch (error) {
            console.error('Error deleting artwork:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching artwork details: {error.message}</div>;

    return (
        <div className="w-full p-4 relative">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Back
                </button>
                {userId.current === artistId && (
                    <div className="relative" ref={manageMenuRef}>
                        <button
                            onClick={() => setManageMenuOpen(!isManageMenuOpen)}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Manage
                        </button>
                        {isManageMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md border border-gray-300 rounded-md z-20">
                                {/* <button
                                    onClick={handleEdit}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    Edit
                                </button> */}
                                <Link to="edit" className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    Edit
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ArtworkDisplay art={art} />
        </div>
    );
};

export default ArtworkDetails;
