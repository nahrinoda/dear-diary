import React, { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';

function LeftSidebar({
    handleCreateNewDiary,
    diariesList,
    selectDiary,
    selectedIndex,
    mintIsHidden,
    handleMintDiaryOnClick
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

    return (
        <div className='left-sidebar'>
            <div className='left-sidebar-controls' onClick={handleCreateNewDiary}>
                <div className='add-new-diary'>
                    <span className='material-icons md-18 add-margin'>add</span>
                    New Diary
                </div>
            </div>
            {Object.entries(diariesGroupedByCreatedBy).map((item, index) => (
                <dl className='dl-container' key={index}>
                    <dt className='diary-created-container'>
                        <li className='diary-date'>{item[0]}</li>
                        <span>{`(${item[1].length})`}</span>
                    </dt>
                    {item[1].map((diary, index) => (
                        <dd
                            className="left-sidebar-item"
                            key={index}
                            id={Number(diary.id)}
                            style={{ background: item[1].indexOf(diary) === selectedIndex ? '#8c8c8c3e' : null }}
                        >
                            <div className='left-sidebar-content-id'>{Number(diary.id)}</div>
                            <div
                                id={Number(diary.id)}
                                className='left-sidebar-content'
                                onClick={selectDiary}
                            >{diary.content}</div>
                            <div className='left-sidebar-content-mint' onClick={handleMintDiaryOnClick} hidden={mintIsHidden}>M</div>
                        </dd>
                    ))}
                </dl>
            ))}
        </div>
    );
}

export default LeftSidebar;