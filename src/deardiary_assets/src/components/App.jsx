import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import LeftSidebar from './LeftSidebar';
import Diary from './Diary';
import { deardiary } from '../../../declarations/deardiary';


function App() {
    const [diaris, setDiaries] = useState([]);

    const handleAddNewDiary = (newDiary) => {
        setDiaries(prevDiaries => {
            deardiary.createDiary(newDiary.title, newDiary.content)
        })
        console.log(" Add a new diary! ");
    };

    const saveDiary = (newDiary) => {
        setDiaries(prevDiaries => {
            return [...prevDiaries, newDiary]
        });
    };

    const deleteDiary = () => {
        setDiaries([]);
    };
    console.log(diaris)
    return (
        <div>
            <Header />
            <div className="content">
                <LeftSidebar handleAddNewDiary={handleAddNewDiary} />
                <Diary />
                {diaris.map((diary, index) => {
                    return (
                        <Diary
                            key={`${index}-${diary.label}`}
                            label={diary.label}
                            content={diary.content}
                            saveDiary={saveDiary}
                            deleteDiary={deleteDiary}
                        />
                    );
                })
                }
            </div>
            <Footer />
        </div>
    );
}

export default App;