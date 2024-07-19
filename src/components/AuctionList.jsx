import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import ActiveIndicator from '../components/ActiveIndicator';
import { Link, useNavigate } from 'react-router-dom';

const fetchAuctions = async () => {
    const response = await axios.get(`${import.meta.env.VITE_APP_GET_AUCTION_LIST}`);
    return response.data;
};

const AuctionList = () => {
    const [isLive, setIsLive] = useState(true);
    const navigate = useNavigate();
    const { data: auctions, error, isLoading } = useQuery('auctions', fetchAuctions);

    const handleSwitch = () => {
        setIsLive(!isLive);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching auctions: {error.message}</div>;

    const truncateText = (text, maxLength = 200) => {
        if (text.length <= maxLength) {
            return text;
        }

        const truncated = text.substr(0, text.lastIndexOf(' ', maxLength));
        return `${truncated} ...`;
    };

    const fromToDate = (startTime, endTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start > now) {
            return "Begins: " + start.toLocaleString();
        } else if (end > now) {
            return "Ends: " + end.toLocaleString();
        } else {
            return "Closed: " + end.toLocaleString();
        }
    };

    return (
        <div className="">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{isLive ? 'Live Auctions' : 'Upcoming Auctions'}</h1>
                <button
                    onClick={handleSwitch}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Switch to {isLive ? 'Upcoming' : 'Live'}
                </button>
                <Link to={`/auctions/create`}>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Create
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {Array.isArray(auctions) && auctions.length !== 0 && auctions.map((auction) => (
                    <div
                        key={auction.auctionId}
                        className="p-4 border rounded-lg shadow-md cursor-pointer"
                        onClick={() => navigate(`/auctions/${auction.auctionId}`)} // Use absolute path
                    >
                        <div className='flex items-center mb-2'>
                            <ActiveIndicator isPulsing={true} />
                            <h2 className="text-xl font-bold px-2">{auction.auctionName}</h2>
                        </div>
                        <p className='mb-2'>{truncateText(auction.auctionDescription)}</p>
                        <p className="text-xs font-bold text-gray-500 italic">
                            {fromToDate(auction.startTime, auction.endTime)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuctionList;
