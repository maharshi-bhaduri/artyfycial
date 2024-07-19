import React from 'react';
import { Routes, Route } from "react-router-dom";
import AuctionList from '../components/AuctionList';
import CreateAuction from '../components/CreateAuction';
import AuctionDetails from '../components/AuctionDetails';


const AuctionMain = () => {

    return (
        <>
            <Routes>
                <Route path={`/`} element={<AuctionList />} />
                <Route path={`/create`} element={<CreateAuction />} />
                <Route path={`/:auctionId`} element={<AuctionDetails />} />
            </Routes>
        </>
    );
};

export default AuctionMain;
