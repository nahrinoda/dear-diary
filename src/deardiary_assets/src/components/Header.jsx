import React from 'react';
import { Link } from 'react-router-dom';


function Header() {
    return (
        <header>
            <h1 className='header-title'>
                <Link exact="true" to="/">
                    <span className='header-background'>Dear Diary</span>
                </Link>
                <div className="right-side-header">
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
            </h1>
            <div className='header-line'></div>
        </header>
    )
}

export default Header;

