import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';


const fetchArtistPortfolio = async (userName) => {
    const response = await axios.get(`${import.meta.env.VITE_APP_GET_PORTFOLIO}?userName=${userName}`);
    return response.data;
};

const Artist = () => {
    const { userName } = useParams();
    const currentUserId = localStorage.getItem('userId');
    const { data, error, isLoading } = useQuery(
        ['artistDetails', userName],
        () => fetchArtistPortfolio(userName)
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching artist details: {error.message}</div>;

    const { userId, firstName, lastName, about, socials, phoneNumber, location, joinDate, profilePicturePath } = data.artist;
    const artworks = data.artworks;

    const iscurrentUserArtist = currentUserId && currentUserId == userId;

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
            {iscurrentUserArtist && (
                <div className="mt-4">
                    <Link to={`/account/edit`} className="text-blue-500 hover:underline">
                        Edit Details
                    </Link>
                </div>
            )}
            <div className="mt-6">
                <h2 className="text-xl font-bold">Artworks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {artworks.map(artwork => (
                        <Link to={`/artwork/${artwork.artworkId}`} key={artwork.artworkId}>
                            <div className="border p-4 rounded-lg">
                                <img src={artwork.url} alt={artwork.title} className="w-full h-48 object-cover rounded-lg mb-2" />
                                <h3 className="text-lg font-bold">{artwork.title}</h3>
                                <p className="text-sm text-gray-500">Uploaded on: {new Date(artwork.uploadDate).toLocaleDateString()}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Artist;
