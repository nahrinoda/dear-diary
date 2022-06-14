import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import LeftSidebar from './LeftSidebar';
import Diary from './Diary';



function App() {
    const [diaris, setDiaries] = useState([]);

    const handleAddNewDiary = (newDiary) => {
        // setDiaries(prevDiaries => {
        //     deardiary.createDiary(newDiary.title, newDiary.content)
        // })
        var date = new Date().toLocaleDateString()
      
        console.log(" Add a new diary! ", date);
    };

    const saveDiary = (newDiary) => {
        setDiaries(prevDiaries => {
            return [...prevDiaries, newDiary]
        });
    };

    const deleteDiary = () => {
        setDiaries([]);
    };

    return (
        <div>
            <Header />
            <Diary />
            <Footer />
        </div>
    );
}

export default App;