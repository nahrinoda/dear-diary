import React from 'react';
import { Link } from 'react-router-dom';


function Header() {
    return (
        <header>
            <h1 className='header-title'>
                <Link exact="true" to="/">
                    <span className='header-background'>Dear Diary</span>
                </Link>
            </h1>
            <div className='header-line'></div>
        </header>
    )
}

export default Header;

