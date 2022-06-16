import React, { useEffect, useState } from 'react';

function LeftSidebar({
    handleCreateNewDiary,
    selectedIndex,
    diariesList,
    handleSelectedDiary
}) {
    const [diariesGroupedByCreatedBy, setDiariesGroupedByCreatedBy] = useState([]);

    useEffect(() => {
        const currentDiariesGroupedByCreatedBy = diariesList.reduce((previousDiary, currentDiary) => {
            previousDiary[currentDiary.createdAt] = previousDiary[currentDiary.createdAt] || [];
            previousDiary[currentDiary.createdAt].push(currentDiary);
            return previousDiary;
        }, Object.create(null));

        setDiariesGroupedByCreatedBy(currentDiariesGroupedByCreatedBy);
    }, [diariesList]);
console.log('Object.entries(diariesGroupedByCreatedBy): ', Object.entries(diariesGroupedByCreatedBy))
    return (
        <div className='left-sidebar'>
            <div className='left-sidebar-controls'>
                <div>Left Sidebar</div>
                <div className='add-new-diary' onClick={handleCreateNewDiary}>Add</div>
            </div>
            {Object.entries(diariesGroupedByCreatedBy).map((item, index) => (
                <dl key={index}>
                    <dt className='diary-created-container'>
                        <li className='diary-date'>{item[0]}</li>
                        <span>{`(${item[1].length})`}</span>
                    </dt>
                    {item[1].map((diary, index) => (
                        <dd key={index} id={diary.id} onClick={handleSelectedDiary}>
                        <span>{diary.id}</span>
                        {diary.content}
                    </dd>
                    )) }
                </dl>
            ))}
        </div>
    );
}

export default LeftSidebar;