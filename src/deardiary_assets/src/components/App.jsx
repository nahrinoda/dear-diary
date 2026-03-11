import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Create from './Create';
import Gallery from './Gallery';
import LandingPage from './LandingPage';
import { AuthContext } from '../AuthContext';

function App({ identity, principal, agent }) {
    return (
        <AuthContext.Provider value={{ identity, principal, agent }}>
            <BrowserRouter basename={process.env.PUBLIC_BASENAME || "/"}>
                <Routes>
                    <Route exact="true" path="/" element={<LandingPage />} />
                    <Route path="/discover" element={<Gallery title="Discover" role="discover" />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/collection" element={<Gallery title="My Collection" role="collection" />} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
