import React from 'react';
import dearDiary from '../../assets/dear-diary.png';


function LandingPage() {
    return (
        <div className="landing-page-container">
            <h1 className="landing-page-header-title"><span className="header-background">Dear Diary</span></h1>
            <div className="landing-page-header-box">
            <img className="diary-image" src={dearDiary} alt="clouds and flying diaries" />
                {/* <div>
                <div>Dear Diary text comes here</div>
                <button>Start Creating</button>
                </div> */}
            </div>
        </div>
    )
}

export default LandingPage;

