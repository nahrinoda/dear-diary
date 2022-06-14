import React, { useEffect, useState } from 'react';
import LeftSidebar from './LeftSidebar';
import { deardiary } from '../../../declarations/deardiary';

function Diary() {
    const [label, setLabel] = useState('');
    const [content, setContent] = useState('');
    const [createdAt, setCreatedAt] = useState();
    const [diaryId, setDiaryId] = useState(0);
    const [diariesList, setDiariesList] = useState([]);
    const [diary, setDiary] = useState({});
    const [sidebarDiaryCotent, setSidebarDiaryContent] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);


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

    const handleSaveDiary = (e) => {
        var today = new Date();
        var date = (today.toLocaleString('en-us', { month: 'long' })) + ', ' + today.getFullYear();
        setDiaryId(diaryId + 1);
        setCreatedAt(date);
        setIsDisabled(true);

        if (diary.id === undefined) {
            setDiary({
                id: diaryId + 1,
                label,
                content,
                createdAt: date
            });
        } else {
            diariesList[diary.id - 1] = {
                id: diary.id,
                label,
                content,
                createdAt
            }
        };

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
        var today = new Date();
        var date = (today.toLocaleString('en-us', { month: 'long' })) + ', ' + today.getFullYear();
        setDiaryId(diaryId + 1);
        setCreatedAt(date);
        setSidebarDiaryContent('New Diary');
        setDiary({
            id: diaryId + 1,
            label,
            content,
            createdAt: date
        });
        console.log('diaryId: ', diaryId)
    };

    const handleSelectedDiary = (e) => {
        const currentItemId = Number(e.target.id);
        diariesList.some(diary => {
            if (diary.id === currentItemId) {
                console.log('select diary: ', diary)
                return true
            } else {
                return false
            }
        });
    };

    return (
        <div className="content">
            <LeftSidebar
                handleCreateNewDiary={handleCreateNewDiary}
                diaryContent={sidebarDiaryCotent}
                createDate={createdAt}
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
                        <button onClick={handleSaveDiary} disabled={isDisabled}>Save</button>
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