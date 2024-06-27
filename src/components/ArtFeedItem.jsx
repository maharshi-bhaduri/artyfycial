import React from 'react';
import { Link } from 'react-router-dom';

const ArtFeedItem = ({ art }) => {
    return (
        <Link to={`/artwork/${art.artworkId}`} state={{ art }}>
            <li className="flex items-start border border-gray-300 rounded-xl p-4 mb-6">
                <img
                    src={art.url}
                    alt={art.title}
                    className="w-2/3 h-96 object-cover rounded-lg mr-4"
                />
                <div>
                    <h3 className="text-lg font-semibold">{art.title}</h3>
                    <p className="mt-2">{art.description}</p>
                </div>
            </li>
        </Link>
    );
};

export default ArtFeedItem;
