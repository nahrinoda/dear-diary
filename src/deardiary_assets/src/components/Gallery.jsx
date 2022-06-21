import React from 'react';
import Card from './Card';
import Footer from './Footer';
import Header from './Header';


function Gallery() {
    return (
        <>
            <Header />
            <div className="gallery-page-container">
                <h2 className="my-nft-title">My NFTs</h2>
                <div className="my-nft-collection">
                    <Card />
                    <Card />
                    <Card />
                </div>
            </div>
        </>
    )
}

export default Gallery;