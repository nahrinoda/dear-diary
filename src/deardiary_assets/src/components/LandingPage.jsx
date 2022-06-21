import React from 'react';
import { Link } from 'react-router-dom';
import clouds from '../../assets/clouds.png';
import diaries from '../../assets/diaries.png';
import Footer from './Footer';


function LandingPage() {
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
                <h1 className="landing-page-header-title"><span className="header-background">Dear Diary</span></h1>
                <div className="landing-page-header-box">
                    <div className="landing-page-image-container">
                        <img className="diaries-image" src={diaries} alt="flying diaries" />
                        <img className="clouds-image" src={clouds} alt="clouds" />
                    </div>
                    <div className="landing-page-description-container">
                        <h2 className="landing-page-description-content">Your private diary decentralized on the Internet Computer.</h2>
                        <Link to="/create">
                            <div className="start-creating">
                                Start Creating
                                <span className="material-icons md-18">
                                    arrow_forward_ios
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default LandingPage;

