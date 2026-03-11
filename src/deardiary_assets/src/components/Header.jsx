import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Header() {
    return (
        <header>
            <h1 className='header-title'>
                <Link to="/">
                    <span className='header-background'>Dear Diary</span>
                </Link>
                <div className="right-side-header">
                    <NavLink to="/discover" className={({ isActive }) => isActive ? 'landing-page-links nav-active' : 'landing-page-links'}>
                        Discover
                    </NavLink>
                    <NavLink to="/create" className={({ isActive }) => isActive ? 'landing-page-links nav-active' : 'landing-page-links'}>
                        Create
                    </NavLink>
                    <NavLink to="/collection" className={({ isActive }) => isActive ? 'landing-page-links nav-active' : 'landing-page-links'}>
                        My NFTs
                    </NavLink>
                </div>
            </h1>
            <div className='header-line'></div>
        </header>
    );
}

export default Header;
