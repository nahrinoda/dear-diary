import React, { useEffect, useState } from 'react';
import LeftSidebar from './LeftSidebar';
import { deardiary } from '../../../declarations/deardiary';


function Diary() {
    const [label, setLabel] = useState('');
    const [content, setContent] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [diaryId, setDiaryId] = useState(0);
    const [diary, setDiary] = useState({});
    const [diariesList, setDiariesList] = useState([]);
    const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(true);
    const [isDeleteBtnDisabled, setIsDeleteBtnDisabled] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const diariesList = await deardiary.readDiaries();
        setDiaryId(diariesList.length)
        setDiariesList(diariesList);
    };

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
        if (!diariesList.length) {
            handleCreateNewDiary(e);
        } else {
            setDiariesList(previousDiariesList => {
                const currentDiaryId = Number(previousDiariesList[selectedIndex].id);
                const today = new Date();
                const date = (today.toLocaleString('en-us', { month: 'long' })) + ', ' + today.getFullYear();

                let newDiary = {
                    id: currentDiaryId,
                    label: !label ? 'Diary Label' : label,
                    content: !content ? 'New Diary...' : content,
                    createdAt: date
                };
                setCreatedAt(date);
                setDiaryId(currentDiaryId);
                setDiary(newDiary);
                setSelectedIndex(selectedIndex);
                deardiary.removeDiaries(selectedIndex);
                deardiary.createDiary(newDiary.id, newDiary.label, newDiary.content, newDiary.createdAt);
                previousDiariesList.splice(selectedIndex, 1);
                return [newDiary, ...previousDiariesList];
            });
        };

        setIsSaveBtnDisabled(true);
    };

    const handleDeleteDiary = (e) => {
        deardiary.removeDiaries(selectedIndex);
        setDiariesList(previousDiariesList => {
            previousDiariesList.splice(selectedIndex, 1);
            return previousDiariesList.filter((diary, index) => {
                return previousDiariesList[index] !== selectedIndex
            });
        }
        );

        if (!diariesList.length) {
            setContent('');
            setLabel('');
        };

        const currentIndex = selectedIndex > 0 ? selectedIndex - 1 : 0;
        setSelectedIndex(currentIndex)
        setIsSaveBtnDisabled(true);
    };

    const handleCreateNewDiary = (e) => {
        const today = new Date();
        const date = (today.toLocaleString('en-us', { month: 'long' })) + ', ' + today.getFullYear();
        const currentDiaryId = Number(diaryId + 1);
        let newDiary = {
            id: currentDiaryId,
            label: !label ? 'Diary Label' : label,
            content: !content ? 'New Diary...' : content,
            createdAt: date
        };

        setCreatedAt(date);
        setDiaryId(currentDiaryId);
        setDiary(newDiary);

        setDiariesList(previousDiariesList => {
            deardiary.createDiary(newDiary.id, newDiary.label, newDiary.content, newDiary.createdAt);
            return [newDiary, ...previousDiariesList];
        });
    };

    const selectDiary = (e) => {
        const targetId = Number(e.currentTarget.id);
        const selectedIndex = diariesList.findIndex((diary) => Number(diary.id) === targetId);

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
                diariesList={diariesList || []}
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