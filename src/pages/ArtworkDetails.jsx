import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArtworkDisplay from '../components/ArtworkDisplay';

const ArtworkDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { art } = location.state;

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                Back
            </button>
            <ArtworkDisplay art={art} />
        </div>
    );
};

export default ArtworkDetails;
