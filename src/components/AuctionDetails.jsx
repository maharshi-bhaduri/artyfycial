import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import GenericModal from './GenericModal';
import ArtworkSelectionModalContent from './ArtworkSelectionModalContent';

const fetchAuctionDetails = async (auctionId) => {
    const response = await axios.get(`${import.meta.env.VITE_APP_GET_AUCTION_DETAILS}?auctionId=${auctionId}`);
    return response.data;
};

const AuctionDetails = () => {
    const { auctionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const auctionFromState = location.state?.auction;

    const { data: auction, error, isLoading } = useQuery(
        ['auctionDetails', auctionId],
        () => fetchAuctionDetails(auctionId),
        {
            enabled: !auctionFromState,
            initialData: auctionFromState,
        }
    );

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddArtworkClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleArtworkSelect = (artwork) => {
        // Handle adding the selected artwork to the auction
        console.log('Selected artwork:', artwork);
        setIsModalOpen(false);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching auction details: {error.message}</div>;

    return (
        <div className="">
            <h1 className="text-2xl font-bold mb-4">{auction.auctionName}</h1>
            <p className="mb-2">{auction.auctionDescription}</p>
            <p className="mb-2"><strong>Start Time:</strong> {new Date(auction.startTime).toLocaleString()}</p>
            <p className="mb-2"><strong>End Time:</strong> {new Date(auction.endTime).toLocaleString()}</p>
            <p className="mb-2"><strong>Auctioneer ID:</strong> {auction.auctioneerId}</p>
            <p className="mb-2"><strong>Anonymous Auction:</strong> {auction.anonAuction ? 'Yes' : 'No'}</p>
            <p className="mb-2"><strong>Artworks </strong>
                <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
                    onClick={handleAddArtworkClick}
                >
                    Add
                </button>
            </p>
            {Array.isArray(auction.artworks) && auction.artworks.length > 0 ? (
                <div>
                    <h2 className="text-xl font-bold mt-4">Artworks</h2>
                    <ul className="list-disc pl-5">
                        {auction.artworks.map((artwork) => (
                            <li key={artwork.artworkId}>
                                <strong>{artwork.title}</strong> by {artwork.artistName}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No artwork added to the auction. You may add an artwork from the artwork page.</p>
            )}
            <button
                onClick={() => navigate('/auctions')}
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
            >
                Back to Auctions
            </button>
            <GenericModal
                isOpen={isModalOpen}
                onRequestClose={handleModalClose}
                title="Select Artworks"
            >
                <ArtworkSelectionModalContent onArtworkSelect={handleArtworkSelect} />
            </GenericModal>
        </div>
    );
};

export default AuctionDetails;
