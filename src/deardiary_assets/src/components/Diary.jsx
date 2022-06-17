import React, { useEffect, useState } from 'react';
import LeftSidebar from './LeftSidebar';
import { deardiary } from '../../../declarations/deardiary';

const DUMMY_LIST = [
    {
        id: 1,
        label: 'Heart and Souls',
        content: 'I wanted to express my sinsere appologies...',
        createdAt: 'July, 2021'
    },
    {
        id: 2,
        label: 'Bridges and Freedoms',
        content: 'I wanted to express my freedoms and things...',
        createdAt: 'July, 2021'
    }
]

function Diary() {
    const [label, setLabel] = useState('');
    const [content, setContent] = useState('');
    const [createdAt, setCreatedAt] = useState();
    const [diaryId, setDiaryId] = useState(0);
    const [diariesList, setDiariesList] = useState([]);
    const [diary, setDiary] = useState({});
    const [isDisabled, setIsDisabled] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);


    useEffect(() => {
        const diaryIsCreated = Object.keys(diary).length;
        if (diaryIsCreated > 0) {
            setDiariesList(previousDiariesList => [diary, ...previousDiariesList]);
        };
    }, [diary])

    useEffect(() => {
        if (diariesList.length > 0) {
            setLabel(diariesList[selectedIndex].label);
            setContent(diariesList[selectedIndex].content);
        }
    }, [selectedIndex])

    const handleLabelChange = (e) => {
        const currentLabel = e.currentTarget.value;
        setIsDisabled(false);
        setLabel(currentLabel);
    };

    const handleContentChange = (e) => {
        const currentContent = e.currentTarget.value;
        setIsDisabled(false);
        setContent(currentContent);
    };

    const handleNewDiary = (diaryId) => {
        const today = new Date();
        const date = (today.toLocaleString('en-us', { month: 'long' })) + ', ' + today.getFullYear();
        let currentDiary = diariesList.find(diary => diary.id === diaryId);
        const included = diariesList.includes(currentDiary);
        if (diary.id === undefined || !included) {
            setCreatedAt(date);
            setDiaryId(diaryId + 1);
            setDiary({
                id: diaryId + 1,
                label,
                content,
                createdAt: date
            });
        }
    };

    const handleSaveDiary = (e) => {
        let currentDiary;
        diariesList.map(diary => {
            if (diary.id === diaryId) {
                currentDiary = {
                    id: diaryId,
                    label,
                    content,
                    createdAt
                }
            }
        });
        const currentDiaryIndex = diariesList.findIndex(diary => diary.id === diaryId);
        diariesList.splice(currentDiaryIndex, 1, currentDiary);
        setDiariesList([...diariesList])
        // setDiariesList(previousDiariesList => [...previousDiariesList, currentDiary]);
        // debugger
    };

    const handleDeleteDiary = (e) => {
        console.log('delete diary')
    };

    const handleCreateNewDiary = (e) => {
        const today = new Date();
        const date = (today.toLocaleString('en-us', { month: 'long' })) + ', ' + today.getFullYear();
        setCreatedAt(date);
        setDiaryId(diaryId + 1);
        setDiary({
            id: diaryId + 1,
            label: 'Diary Label',
            content: 'New Diary...',
            createdAt: date
        });
    };

    const selectDiary = (e) => {
        const targetId = Number(e.currentTarget.id);
        const selectedIndex = diariesList.findIndex((diary) => diary.id === targetId);
        setSelectedIndex(selectedIndex);
        setLabel(diariesList[selectedIndex].label);
        setContent(diariesList[selectedIndex].content);
        setDiaryId(targetId);
    };

    const buttonStyle = isDisabled ? 'button-inactive' : 'button';

    return (
        <div className="content">
            <LeftSidebar
                handleCreateNewDiary={handleCreateNewDiary}
                diariesList={diariesList}
                selectDiary={selectDiary}
                selectedIndex={selectedIndex}
            />
            <div className="diary">
                <div className='diary-controls'>
                    <div className='diary-label-container'>
                        <input
                            className='label'
                            name='label'
                            placeholder='Diary Label'
                            value={label}
                            onChange={handleLabelChange}
                        />
                        {/* <span className='material-icons md-18 arrow-down-icon' onClick={handleTitleOptions} hidden={true}>keyboard_arrow_down</span> */}
                    </div>
                    <div className='buttons-container'>
                        <button className={`save-${buttonStyle}`} onClick={handleSaveDiary} disabled={isDisabled}>
                            <span className='material-icons md-18'>save</span>
                        </button>
                        <button className={`delete-${buttonStyle}`} onClick={handleDeleteDiary} disabled={isDisabled}>
                            <span className='material-icons md-18'>delete_outline</span>
                        </button>
                    </div>
                </div>
                <textarea
                    className='diary-content'
                    name='content'
                    placeholder='Start writting your thoughts here...'
                    value={content}
                    onChange={handleContentChange}
                />
            </div>
        </div>
    );
}

export default Diary;