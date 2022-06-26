import React, { useEffect, useState } from 'react';
import Card from './Card';
import Footer from './Footer';
import Header from './Header';
import { Principal } from "@dfinity/principal";


function Gallery({ ids }) {
    const [items, setItems] = useState();

    useEffect(() => {
        fetchNFTs();
    }, []);

    const fetchNFTs = () => {
        if (ids != undefined) {
            setItems(ids.map((NFTID) => <Card key={NFTID.toText()} id={NFTID} />));
        };
    };

    return (
        <>
            <Header />
            <div className="gallery-page-container">
                <h2 className="my-nft-title">My NFTs</h2>
                <div className="my-nft-collection">
                    {items}
                </div>
            </div>
        </>
    )
}

export default Gallery;