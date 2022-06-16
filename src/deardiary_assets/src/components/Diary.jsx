import React, { useEffect, useState } from 'react';
import LeftSidebar from './LeftSidebar';
import { deardiary } from '../../../declarations/deardiary';

function Diary() {
    const [label, setLabel] = useState('');
    const [content, setContent] = useState('');
    const [createdAt, setCreatedAt] = useState();
    const [diaryId, setDiaryId] = useState(0);
    const [diariesList, setDiariesList] = useState([
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
    ]);
    const [diary, setDiary] = useState({});
    const [sidebarDiaryCotent, setSidebarDiaryContent] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedDiary, setSelectedDiary] = useState({});


    useEffect(() => {
        const diaryIsCreated = Object.keys(diary).length;
        if (diaryIsCreated > 0) {
            setDiariesList(previousDiariesList => [diary, ...previousDiariesList]);
        };
    }, [diary])

    const handleLabelChange = (e) => {
        const currentLabel = e.target.value;
        setIsDisabled(false);
        setLabel(currentLabel);
    };

    const handleContentChange = (e) => {
        const currentContent = e.target.value;
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
        const { id } = e.target;
        const idToNumber = Number(id);
        setIsDisabled(true);
        handleNewDiary(idToNumber);
        const selectedDiary = diariesList.findIndex(diary => diary.id === idToNumber);
        if (selectedDiary > -1) {
            // we remove this diary from diarylist
            diariesList.splice(selectedDiary,1)
            // replace it with selected diary
            setDiariesList(previousDiariesList => [diary, ...previousDiariesList]);
        }

        if (content === '') {
            setSidebarDiaryContent('New Diary');
        } else {
            setSidebarDiaryContent(content);
        };
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

    const handleSelectedDiary = (e) => {
        const currentItemId = Number(e.target.id);
        setDiaryId(currentItemId);
    };

    const groupBy = (objectArray, property) => {
        return objectArray.reduce((acc, obj) => {
            let key = obj[property]
            if (!acc[key]) {
                acc[key] = []
            }
            acc[key].push(obj)
            return acc
        }, {})
    }
    let groupedPeople = groupBy(diariesList, 'createdAt')

    const currentDiary = diariesList.filter(diary => diary.id === diaryId);

    return (
        <div className="content">
            <LeftSidebar
                handleCreateNewDiary={handleCreateNewDiary}
                diaryContent={currentDiary && diary.content}
                createDate={diary.createdAt}
                diariesListIsHidden={diariesList.length === 0}
                currentDiaryCount={`(${diariesList.length})`}
                diariesList={diariesList}
                handleSelectedDiary={handleSelectedDiary}
            />
            <div className="diary">
                <div className='diary-controls'>
                    <input
                        className='label'
                        name='label'
                        placeholder='Diary Label'
                        value={label}
                        onChange={handleLabelChange}
                    />
                    <div>
                        <button id={diaryId} onClick={handleSaveDiary} disabled={isDisabled}>Save</button>
                        <button onClick={handleDeleteDiary}>Delete</button>
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