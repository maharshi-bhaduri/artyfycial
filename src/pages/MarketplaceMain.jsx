import React from "react";
import { Routes, Route } from "react-router-dom";
import Marketplace from "../components/Marketplace";
import MarketplaceItemDetails from "../components/MarketplaceItemDetails";

const MarketplaceMain = () => {
  return (
    <>
      <Routes>
        <Route path={`/`} element={<Marketplace />} />
        <Route
          path={`/:marketplaceItemId`}
          element={<MarketplaceItemDetails />}
        />
      </Routes>
    </>
  );
};

export default MarketplaceMain;
