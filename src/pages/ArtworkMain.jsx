import React from 'react';
import { Routes, Route } from "react-router-dom";
import ArtworkDetails from '../components/ArtworkDetails';
import ArtworkUpdate from '../components/ArtworkUpdate';

const ArtworkMain = () => {
    return (
        <>
            <Routes>
                <Route path={`/`} element={<ArtworkDetails />} />
                <Route path={`/edit`} element={<ArtworkUpdate />} />
            </Routes>
        </>
    );
};

export default ArtworkMain;
