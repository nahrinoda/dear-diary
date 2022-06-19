import React from 'react';
import clouds from '../../assets/clouds.png';
import diaries from '../../assets/diaries.png';
import Footer from './Footer';


function LandingPage() {
    return (
        <>
            <div className="landing-page-container">
                <h1 className="landing-page-header-title"><span className="header-background">Dear Diary</span></h1>
                <div className="landing-page-header-box">
                    <div className="landing-page-image-container">
                        <img className="diaries-image" src={diaries} alt="flying diaries" />
                        <img className="clouds-image" src={clouds} alt="clouds" />
                    </div>
                    <div className="landing-page-description-container">
                        <h2 className="landing-page-description-content">Your private diary decentralized on the Internet Computer.</h2>
                        <div className="start-creating">
                            Start Creating
                            <span class="material-icons md-18">
                                arrow_forward_ios
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default LandingPage;

