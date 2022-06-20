import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Diary from './Diary';
import Discover from './Discover';
import Gallery from './Gallery';
import LandingPage from './LandingPage';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact="true" path="/" element={<LandingPage />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/create" element={<Diary />} />
                <Route path="/collection" element={<Gallery />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;