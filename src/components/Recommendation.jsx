import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const fetchMoreArtworks = async (artistId, artworkId) => {
    const response = await axios.get(`${import.meta.env.VITE_APP_GET_ARTWORK_LIST}?artistId=${artistId}&current=${artworkId}`);
    return response.data.artworks;
};

const Recommendation = ({ artistId, artworkId }) => {
    const navigate = useNavigate();
    const { data: moreArtworks, error, isLoading } = useQuery(
        ['moreArtworks', artistId, artworkId],
        () => fetchMoreArtworks(artistId, artworkId),
        {
            enabled: !!artistId && !!artworkId,
        }
    );

    if (isLoading) return <div>Loading more artworks...</div>;
    if (error) return <div>Error fetching more artworks: {error.message}</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">More of</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.isArray(moreArtworks) && moreArtworks.length != 0 ? moreArtworks.map((artwork) => (
                    <div
                        key={artwork.artworkId}
                        className="border p-2 rounded cursor-pointer"
                        onClick={() => navigate(`/artwork/${artwork.artworkId}`)}>
                        <img src={artwork.url} alt={artwork.title} className="object-contain max-w-full max-h-48" />
                        <h3 className="text-lg font-semibold">{artwork.title}</h3>
                        <p className="text-sm">{artwork.description}</p>
                    </div>
                ))
                    :
                    <div>
                        No additional artworks found.
                    </div>
                }
            </div>
        </div>
    );
};

export default Recommendation;
