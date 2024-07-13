import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const updateUserData = async (userData) => {
    const response = await axios.post(`${import.meta.env.VITE_APP_UPDATE_USER_DATA}`, userData);
    return response.data;
};

const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${import.meta.env.VITE_APP_GET_USER_DATA}`, {
        headers: {
            token: token
        }
    });
    return response.data;
};

const AccountUpdate = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: user, isLoading, error } = useQuery('user', fetchUserData);
    const [formData, setFormData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        about: '',
        socials: '',
        phoneNumber: '',
        location: '',
        isPublic: false,
        artistFlag: false
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    const updateUserMutation = useMutation(updateUserData, {
        onSuccess: () => {
            queryClient.invalidateQueries('user');
        },
    });

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
        <form onSubmit={handleSubmit} className="space-y-4 p-10">
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
                    onClick={() => navigate(-1)}
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
    );
};

export default AccountUpdate;
