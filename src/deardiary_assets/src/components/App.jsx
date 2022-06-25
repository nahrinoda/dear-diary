import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Diary from './Diary';
import Discover from './Discover';
import Gallery from './Gallery';
import LandingPage from './LandingPage';
import { Principal } from "@dfinity/principal";
import { deardiary } from '../../../declarations/deardiary';
import CURRENT_USER_ID from '../index';


function App() {
    const [userOwnedGallery, setUserOwnedGallery] = useState();

    const getNFTs = async () => {
        const userNFTIds = await deardiary.getOwnedNFTs(CURRENT_USER_ID);
        setUserOwnedGallery(<Gallery ids={userNFTIds} />);
    };

    useEffect(() => {
        getNFTs();
    }, []);

    return (
        <BrowserRouter getUserConfirmation={true}>
            <Routes>
                <Route exact="true" path="/" element={<LandingPage />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/create" element={<Diary />} />
                <Route path="/collection" element={userOwnedGallery} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;