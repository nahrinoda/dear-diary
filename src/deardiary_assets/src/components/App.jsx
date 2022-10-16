import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Create from './Create';
import Discover from './Discover';
import Gallery from './Gallery';
import LandingPage from './LandingPage';
import { Principal } from "@dfinity/principal";
import { deardiary } from '../../../declarations/deardiary';
import CURRENT_USER_ID from '../index';


function App() {
    const [userOwnedGallery, setUserOwnedGallery] = useState();
    const [listingGallery, setListingGallery] = useState();

    const getNFTs = async () => {
        const userNFTIds = await deardiary.getOwnedNFTs(CURRENT_USER_ID);
        setUserOwnedGallery(<Gallery title="My NFTs" ids={userNFTIds} role="collection" />);

        const listedNFTIds = await deardiary.getListedNFTs();
        console.log(listedNFTIds)
        setListingGallery(<Gallery title="Discover" ids={listedNFTIds} role="discover" />)
    };

    useEffect(() => {
        getNFTs();
    }, []);

    return (
        <BrowserRouter getUserConfirmation={true}>
            <Routes>
                <Route exact="true" path="/" element={<LandingPage />} />
                <Route path="/discover" element={listingGallery} />
                <Route path="/create" element={<Create />} />
                <Route path="/collection" element={userOwnedGallery} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;