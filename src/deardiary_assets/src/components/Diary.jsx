import React, { useState } from 'react';

function Diary({ saveDiary, deleteDiary }) {
    const [diary, setDiary] = useState({
        label: 'Diary Label',
        content: 'Start writting your thoughts here...'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDiary(prevDiary => {
            return {
                ...prevDiary,
                [name]: value
            };
        });
    };

    const handleSaveDiary = (e) => {
        saveDiary(diary);
    };

    const handleDeleteDiary = (e) => {
        deleteDiary(diary);
    }

    return (
        <div className="diary">
            <div className='diary-controls'>
                {/* <div
                    className='label'
                    type="text"
                    name="label"
                    placeholder="Diary Label"
                    value={diary.label}
                    onChange={handleChange}
                /> */}
                <div
                    className='label'
                    contentEditable={true}
                >
                    {diary.label}
                </div>
                <div>
                    <button onClick={handleSaveDiary}>Save</button>
                    <button onClick={handleDeleteDiary}>Delete</button>
                </div>
            </div>
            {/* <textarea
                className='content'
                name="content"
                placeholder="Start writting your thoughts here..."
                value={diary.content}
                onChange={handleChange}
            /> */}
            <div 
                className='diary-content'
                contentEditable={true}>
                {diary.content}
            </div>
        </div>
    );
}

export default Diary;