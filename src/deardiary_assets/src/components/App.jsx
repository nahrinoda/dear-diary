import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import LeftSidebar from './LeftSidebar';
import Diary from './Diary';



function App() {
    return (
        <div>
            <Header />
            <Diary />
            <Footer />
        </div>
    );
}

export default App;