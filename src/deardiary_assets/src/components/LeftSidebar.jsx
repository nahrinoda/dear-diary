import React, { useEffect, useState } from 'react';

function LeftSidebar({
    handleCreateNewDiary,
    diariesList
}) {
    const [diariesGroupedByCreatedBy, setDiariesGroupedByCreatedBy] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const currentDiariesGroupedByCreatedBy = diariesList.reduce((previousDiary, currentDiary) => {
            previousDiary[currentDiary.createdAt] = previousDiary[currentDiary.createdAt] || [];
            previousDiary[currentDiary.createdAt].push(currentDiary);
            return previousDiary;
        }, Object.create(null));

        setDiariesGroupedByCreatedBy(currentDiariesGroupedByCreatedBy);
    }, [diariesList]);

    const selectDiary = (e) => {
        const targetId = Number(e.currentTarget.id);
        const currentDiaryList = Object.entries(diariesGroupedByCreatedBy).map(item => item[1]);
        const findSelectedIndex = currentDiaryList[0].findIndex((diary) => diary.id === targetId);
        setSelectedIndex(findSelectedIndex);
    };
    
    return (
        <div className='left-sidebar'>
            <div className='left-sidebar-controls' onClick={handleCreateNewDiary}>
                <div className='add-new-diary'>
                    <span className='material-icons md-18 add-margin'>add</span>
                    New Diary
                </div>
            </div>
            {Object.entries(diariesGroupedByCreatedBy).map((item, index) => (
                <dl key={index}>
                    <dt className='diary-created-container'>
                        <li className='diary-date'>{item[0]}</li>
                        <span>{`(${item[1].length})`}</span>
                    </dt>
                    {item[1].map((diary, index) => (
                        <dd 
                            className={'left-sidebar-item'} 
                            key={index} 
                            id={diary.id} 
                            onClick={selectDiary}
                            style={{background: item[1].indexOf(diary) === selectedIndex ? '#8c8c8c3e' : null}}
                        >
                            <div className='left-sidebar-content-id'>{diary.id}</div>
                            <div className='left-sidebar-content'>{diary.content}</div>
                        </dd>
                    )) }
                </dl>
            ))}
        </div>
    );
}

export default LeftSidebar;