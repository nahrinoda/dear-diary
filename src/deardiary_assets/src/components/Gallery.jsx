import React from 'react';
import Card from './Card';
import Footer from './Footer';
import Header from './Header';


function Gallery() {

    const NFTID = 'r7inp-6aaaa-aaaaa-aaabq-cai';

    return (
        <>
            <Header />
            <div className="gallery-page-container">
                <h2 className="my-nft-title">My NFTs</h2>
                <div className="my-nft-collection">
                    <Card id={NFTID} />
                </div>
            </div>
        </>
    )
}

export default Gallery;