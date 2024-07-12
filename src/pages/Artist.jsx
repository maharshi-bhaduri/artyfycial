import React from 'react';
import { useQuery } from 'react-query';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const fetchArtistPortfolio = async (userName) => {
    const response = await axios.get(`${import.meta.env.VITE_APP_GET_PORTFOLIO}?userName=${userName}`);
    return response.data;
};

const Artist = ({ artistId }) => {
    const path = useLocation();
    const { userName } = useParams();
    const artistFromState = path.state?.artist;
    const { data, error, isLoading } = useQuery(
        ['artistDetails', artistId],
        () => fetchArtistPortfolio(userName),
        {
            enabled: !artistFromState,
            initialData: artistFromState,
        }
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching artist details: {error.message}</div>;

    const { firstName, lastName, about, socials, phoneNumber, location, joinDate, profilePicturePath } = data.artist;

    return (
        <div className="p-4">
            <div className="flex items-center">
                {profilePicturePath && <img src={profilePicturePath} alt="Profile" className="w-16 h-16 rounded-full mr-4" />}
                <div>
                    <h1 className="text-2xl font-bold">{`${firstName} ${lastName}`}</h1>
                    <p className="text-sm text-gray-600">{location}</p>
                </div>
            </div>
            <div className="mt-4">
                <p>{about}</p>
                <div className="mt-2">
                    {socials && <p>Socials: {socials}</p>}
                    {phoneNumber && <p>Phone: {phoneNumber}</p>}
                </div>
                <p className="text-sm text-gray-500">Joined on: {new Date(joinDate).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default Artist;
