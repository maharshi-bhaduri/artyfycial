import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${import.meta.env.VITE_APP_GET_USER_DATA}`, {
        headers: {
            token: localStorage.getItem('token')
        }
    });
    return response.data;
};

const updateUserData = async (userData) => {
    const response = await axios.post(`${import.meta.env.VITE_APP_UPDATE_USER_DATA}`, userData);
    return response.data;
};

const Account = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: user, isLoading, error } = useQuery('user', fetchUserData);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const updateUserMutation = useMutation(updateUserData, {
        onSuccess: () => {
            queryClient.invalidateQueries('user');
            setIsEditing(false);
        },
    });

    const handleEditClick = () => {
        setFormData(user);
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserMutation.mutate(formData);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading user data</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Account Details</h1>
            {!isEditing ? (
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
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">About</label>
                        <textarea
                            name="about"
                            value={formData.about || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Socials</label>
                        <input
                            type="text"
                            name="socials"
                            value={formData.socials || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Public Profile</label>
                        <input
                            type="checkbox"
                            name="isPublic"
                            checked={formData.isPublic || false}
                            onChange={(e) =>
                                setFormData((prevData) => ({
                                    ...prevData,
                                    isPublic: e.target.checked,
                                }))
                            }
                            className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Artist</label>
                        <input
                            type="checkbox"
                            name="artistFlag"
                            checked={formData.artistFlag || false}
                            onChange={(e) =>
                                setFormData((prevData) => ({
                                    ...prevData,
                                    artistFlag: e.target.checked,
                                }))
                            }
                            className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            disabled={updateUserMutation.isLoading}
                        >
                            {updateUserMutation.isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Account;
