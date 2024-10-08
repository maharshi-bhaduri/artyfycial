import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const MarketPlaceItem = ({ art }) => {
  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <Link
      to={`/marketplace/${art.marketplaceItemId}`}
      state={{ art }}
      className="m-2"
    >
      <div className="border border-gray-300 rounded-xl p-4 w-full">
        {isLoading && <Loader />}
        <img
          src={art.url}
          alt={art.title}
          className={`w-full h-60 object-cover rounded-lg mb-2 ${
            isLoading ? "hidden" : "block"
          }`}
          onLoad={handleImageLoad}
        />
        {!isLoading && (
          <div>
            <h3 className="text-lg font-semibold">{art.title}</h3>
            <p>{`${art.firstName} ${art.lastName}`}</p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default MarketPlaceItem;
