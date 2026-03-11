import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Create from './Create';
import Discover from './Discover';
import Gallery from './Gallery';
import LandingPage from './LandingPage';
import { createActor, canisterId } from '../../../declarations/deardiary';
import { AuthContext } from '../AuthContext';

function App({ identity, principal, agent }) {
    const [userOwnedGallery, setUserOwnedGallery] = useState();
    const [listingGallery, setListingGallery] = useState();

    const getNFTs = async () => {
        // Use the authenticated agent so canister calls are signed with the
        // real user identity — not the anonymous principal.
        const deardiary = createActor(canisterId, { agent });

        const userNFTIds = await deardiary.getOwnedNFTs(principal);
        setUserOwnedGallery(<Gallery title="My NFTs" ids={userNFTIds} role="collection" />);

        const listedNFTIds = await deardiary.getListedNFTs();
        setListingGallery(<Gallery title="Discover" ids={listedNFTIds} role="discover" />);
    };

    useEffect(() => {
        getNFTs();
    }, []);

    return (
        <AuthContext.Provider value={{ identity, principal, agent }}>
            <BrowserRouter>
                <Routes>
                    <Route exact="true" path="/" element={<LandingPage />} />
                    <Route path="/discover" element={listingGallery} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/collection" element={userOwnedGallery} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
