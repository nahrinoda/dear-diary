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
    const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(true);
    const [isDeleteBtnDisabled, setIsDeleteBtnDisabled] = useState(true);
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
        setIsSaveBtnDisabled(false);
        setIsDeleteBtnDisabled(false);
        setLabel(currentLabel);
    };

    const handleContentChange = (e) => {
        const currentContent = e.currentTarget.value;
        setIsSaveBtnDisabled(false);
        setIsDeleteBtnDisabled(false);
        setContent(currentContent);
    };

    const handleSaveDiary = (e) => {
        let currentDiary;

        if (!diariesList.length) {
            handleCreateNewDiary(e);
        };

        diariesList.map(diary => {
            if (diary.id === diaryId) {
                currentDiary = {
                    id: diaryId,
                    label,
                    content,
                    createdAt
                }
                const currentDiaryIndex = diariesList.findIndex(diary => diary.id === diaryId);
                diariesList.splice(currentDiaryIndex, 1, currentDiary);
                
            }
        }); 
        setDiariesList([...diariesList])
        setIsSaveBtnDisabled(true);
    };

    const handleDeleteDiary = (e) => {
        diariesList.map(diary => {
            if (diary.id === diaryId) {
                const currentDiaryIndex = diariesList.findIndex(diary => diary.id === diaryId);
                setSelectedIndex(currentDiaryIndex);
            }
        }); 

        // auto select next diary
        if (selectedIndex === 0) {
            setSelectedIndex(0);
            diariesList.splice(selectedIndex, 1);
        } else {
            setSelectedIndex(selectedIndex - 1);
        }

        if (!diariesList.length) {
            setContent('');
            setLabel('');
        };

        diariesList.splice(selectedIndex, 1);
        setDiariesList([...diariesList])
        setIsSaveBtnDisabled(true);
    };

    const handleCreateNewDiary = (e) => {
        const today = new Date();
        const date = (today.toLocaleString('en-us', { month: 'long' })) + ', ' + today.getFullYear();
        setCreatedAt(date);
        setDiaryId(diaryId + 1);
        setDiary({
            id: diaryId + 1,
            label: !label ? 'Diary Label' : label,
            content: !content ? 'New Diary...' : content,
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
        setIsDeleteBtnDisabled(false);
    };

    const saveButtonStyle = isSaveBtnDisabled ? 'button-inactive' : 'button';
    const deleteButtonStyle = isDeleteBtnDisabled ? 'button-inactive' : 'button';

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
                        <button id="save-button" className={`save-${saveButtonStyle}`} onClick={handleSaveDiary} disabled={isSaveBtnDisabled}>
                            <span className='material-icons md-18'>save</span>
                        </button>
                        <button id="delete-button" className={`delete-${deleteButtonStyle}`} onClick={handleDeleteDiary} disabled={isDeleteBtnDisabled}>
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