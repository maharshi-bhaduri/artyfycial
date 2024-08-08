import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import MarketPlaceItem from "../components/MarketPlaceItem";

const getMarketPlace = async function () {
  //first get the list of items on the marketplace, then get their corresponding photos
  const response = await axios.get(import.meta.env.VITE_APP_GET_MARKET_PLACE);
  const marketPlaceData = response["data"];

  if (Array.isArray(marketPlaceData)) {
    return marketPlaceData;
  } else {
    throw new Error("API response is not an array");
  }
};

const Marketplace = () => {
  const {
    data: marketPlaceData,
    error,
    isLoading,
  } = useQuery("marketplace", getMarketPlace, {
    staleTime: 0,
    retry: false,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error found {error.message}</div>;
  }
  return (
    <div className="flex flex-col justify-center w-full">
      <h1 className="text-2xl font-bold mb-4">Art Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {marketPlaceData.map((marketPlaceItem) => (
          <MarketPlaceItem
            key={marketPlaceItem.artworkId}
            art={marketPlaceItem}
          />
        ))}
      </div>
    </div>
  );
};
export default Marketplace;
