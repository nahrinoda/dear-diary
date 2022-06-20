import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';


function Discover() {
    return (
        <>
            <div className="landing-page-topbar">
                <Link to="/discover">
                    <div className="landing-page-links">Discover</div>
                </Link>
                <Link to="/create">
                    <div className="landing-page-links">Create</div>
                </Link>
                <Link to="/collection">
                    <div className="landing-page-links">My NFTs</div>
                </Link>
            </div>
            <div className="landing-page-container">
                <h1>Discover</h1>
            </div>
            <Footer />
        </>
    )
}

export default Discover;