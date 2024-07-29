import React, { useState } from "react";
import GenericModal from "./GenericModal";

const MarketplaceModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [marketplaceData, setMarketplaceData] = useState({
    valuation: "",
    minIncrement: "",
  });

  const handleMarketPlaceDataChange = (event) => {
    const { name, value } = event.target;
    setMarketplaceData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = () => {
    onSubmit(marketplaceData);
    onRequestClose();
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title="Add to Marketplace"
    >
      <div className="p-4">
        <div className="flex items-center mb-4">
          <label
            htmlFor="valuation"
            className="block text-sm font-bold mr-2 w-1/4"
          >
            Starting Price
          </label>
          <input
            type="number"
            name="valuation"
            value={marketplaceData.valuation}
            onChange={handleMarketPlaceDataChange}
            className="w-3/4 px-3 py-2 border rounded"
          />
        </div>
        <div className="flex items-center mb-4">
          <label
            htmlFor="minIncrement"
            className="block text-sm font-bold mr-2 w-1/4"
          >
            Bid increment
          </label>
          <input
            type="number"
            name="minIncrement"
            value={marketplaceData.minIncrement}
            onChange={handleMarketPlaceDataChange}
            className="w-3/4 px-3 py-2 border rounded "
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </GenericModal>
  );
};

export default MarketplaceModal;
