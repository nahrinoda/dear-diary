import React from 'react';

function LeftSidebar({ 
    handleCreateNewDiary, 
    diaryContent, 
    createDate, 
    diariesListIsHidden,
    currentDiaryCount,
    diariesList,
    handleSelectedDiary 
}) {
    return (
        <div className='left-sidebar'>
            <div className='left-sidebar-controls'>
                <div>Left Sidebar</div>
                <div className='add-new-diary' onClick={handleCreateNewDiary}>Add</div>
            </div>
            <dl hidden={diariesListIsHidden}>
                <dt className='diary-created-container'>
                    <li className='diary-date'>{createDate}</li>
                    <span>{currentDiaryCount}</span>
                </dt>
                {diariesList.map((diary, index) => <dd id={diary.id} key={index} onClick={handleSelectedDiary}>{diary.id} {diaryContent}</dd>)}
            </dl>
        </div>
    );
}

export default LeftSidebar;