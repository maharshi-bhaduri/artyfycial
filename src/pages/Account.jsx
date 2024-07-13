import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AccountUpdate from './AccountUpdate';

const fetchUserData = async () => {
    const response = await axios.get(`${import.meta.env.VITE_APP_GET_USER_DATA}`, {
        headers: {
            token: localStorage.getItem('token')
        }
    });
    return response.data;
};

const Account = () => {
    const navigate = useNavigate();
    const { data: user, isLoading, error } = useQuery('user', fetchUserData);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading user data</div>;

    const handleEditClick = () => {
        navigate('/account/edit')
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Account Details</h1>
            <div>
                <div className="mb-2"><strong>Username:</strong> {user.userName}</div>
                <div className="mb-2"><strong>Full Name:</strong> {user.firstName} {user.lastName}</div>
                <div className="mb-2"><strong>About:</strong> {user.about}</div>
                <div className="mb-2"><strong>Socials:</strong> {user.socials}</div>
                <div className="mb-2"><strong>Phone Number:</strong> {user.phoneNumber}</div>
                <div className="mb-2"><strong>Location:</strong> {user.location}</div>
                <div className="mb-2"><strong>Join Date:</strong> {user.joinDate}</div>
                <div className="mb-2"><strong>Last Login Date:</strong> {user.lastLoginDate}</div>
                <div className="mb-2"><strong>Public Profile:</strong> {user.isPublic ? 'Yes' : 'No'}</div>
                <div className="mb-2"><strong>Artist:</strong> {user.artistFlag ? 'Yes' : 'No'}</div>
                <button
                    onClick={handleEditClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default Account;
