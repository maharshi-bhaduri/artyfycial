import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import ArtworkDisplay from './ArtworkDisplay';
import axios from 'axios';
import PopupMenu from './PopupMenu';
import Recommendation from './Recommendation';

const ArtworkDetails = () => {
    const { artworkId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [artistId, setArtistId] = useState('');
    const userId = useRef(localStorage.getItem('userId'));

    const artFromState = location.state?.art;

    const fetchArtworkDetails = async (artworkId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_GET_ARTWORK_DETAILS}?artworkId=${artworkId}`);
            setArtistId(response.data.artistId.toString());
            return response.data;
        } catch (error) {
            console.error('Error fetching artwork details:', error);
            throw new Error('Failed to fetch artwork details');
        }
    };

    const { data: art, error, isLoading } = useQuery(
        ['artworkDetails', artworkId],
        () => fetchArtworkDetails(artworkId),
        {
            enabled: !artFromState,
            initialData: artFromState,
        }
    );

    useEffect(() => {
        if (artFromState) {
            setArtistId(artFromState.artistId.toString());
        }
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching artwork details: {error.message}</div>;

    const manageOptions = [
        { option: 'Edit', path: 'edit' }
    ];

    return (
        <div className="w-full p-4">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => navigate('/discover')}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Back
                </button>
                {userId.current === artistId && (
                    <PopupMenu options={manageOptions} />
                )}
            </div>

            <ArtworkDisplay art={art} />

            <Recommendation artistId={artistId} artworkId={art.artworkId} />
        </div>
    );
};

export default ArtworkDetails;
