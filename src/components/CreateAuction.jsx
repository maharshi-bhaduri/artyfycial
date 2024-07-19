import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const createAuction = async (auctionData) => {
    const response = await axios.post(`${import.meta.env.VITE_APP_CREATE_AUCTION}`, auctionData, {
        headers: {
            'token': localStorage.getItem('token')
        }
    });

    return response.data;
};

const CreateAuction = () => {
    const navigate = useNavigate()
    const [auctionData, setAuctionData] = useState({
        auctionName: '',
        auctionDescription: '',
        startTime: '',
        endTime: '',
        anonAuction: false,
    });

    const { mutate: createAuctionMutate, isLoading, error } = useMutation(createAuction, {
        onSuccess: (data) => {
            navigate(`/auctions/${data.auctionId}`, { state: { auction: data } });
        },
        onError: (error) => {
            console.error('Error creating auction:', error);
        },
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAuctionData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createAuctionMutate(auctionData);
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create Auction</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="auctionName">
                        Auction Name
                    </label>
                    <input
                        type="text"
                        id="auctionName"
                        name="auctionName"
                        value={auctionData.auctionName}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="auctionDescription">
                        Auction Description
                    </label>
                    <textarea
                        id="auctionDescription"
                        name="auctionDescription"
                        value={auctionData.auctionDescription}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="startTime">
                        Start Time
                    </label>
                    <input
                        type="datetime-local"
                        id="startTime"
                        name="startTime"
                        value={auctionData.startTime}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="endTime">
                        End Time
                    </label>
                    <input
                        type="datetime-local"
                        id="endTime"
                        name="endTime"
                        value={auctionData.endTime}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                        <input
                            type="checkbox"
                            name="anonAuction"
                            checked={auctionData.anonAuction}
                            onChange={handleChange}
                            className="mr-2 leading-tight"
                        />
                        Anonymous Auction
                    </label>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Auction'}
                    </button>
                </div>
            </form>
            {error && <p className="text-red-500 text-xs italic mt-4">Error: {error.message}</p>}
        </div>
    );
};

export default CreateAuction;
