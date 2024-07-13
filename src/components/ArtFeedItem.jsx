import React from 'react';
import { Link } from 'react-router-dom';

const ArtFeedItem = ({ art }) => {
    return (
        <Link to={`/artwork/${art.artworkId}`} state={{ art }}
            className='m-2'>
            <div className="border border-gray-300 rounded-xl p-4 w-full">
                <img
                    src={art.url}
                    alt={art.title}
                    className="w-full h-96 object-cover rounded-lg mb-2"
                />
                <div>
                    <h3 className="text-lg font-semibold">{art.title}</h3>
                    <p className="">{`${art.firstName} ${art.lastName}`}</p>
                </div>
            </div>
        </Link>
    );
};

export default ArtFeedItem;
