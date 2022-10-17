import React, { useState } from 'react';
import debounce from 'lodash/debounce';

function CreateDiary({
    onAdd,
    handleCloseDiary,
    editTitle,
    editContent,
    isDiaryEddited
}) {

    const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(true);

    const [diary, setDiary] = useState({
        title: '' || editTitle,
        content: '' || editContent
    });

    const handleDiaryInputChange = (e) => {
        const { name, value } = e.target;
        setDiary((previousDiary) => {
            return {
                ...previousDiary,
                [name]: value
            }
        });
        setIsSaveBtnDisabled(false);
    };

    const submitDiary = (e) => {
        onAdd(diary);
        setIsSaveBtnDisabled(true);
        e.preventDefault();
    };

    const saveButtonStyle = isSaveBtnDisabled ? 'button-inactive' : 'button';
    const saveButtonTitle = isDiaryEddited ? 'edit' : 'save';

    return (
        <div className="diary">
            <div className='diary-controls'>
                <div className='diary-label-container'>
                    <input
                        className='label'
                        name='title'
                        placeholder='Diary Label'
                        value={diary.title}
                        onChange={handleDiaryInputChange}
                    />
                </div>
                <div className='buttons-container'>
                    <button
                        id="save-button"
                        className={`save-${saveButtonStyle}`}
                        onClick={submitDiary}
                        disabled={isSaveBtnDisabled}
                    >
                        <span className='material-icons md-18'>{saveButtonTitle}</span>
                    </button>
                    <button
                        id="delete-button"
                        className={'delete-button'}
                        onClick={handleCloseDiary}
                    >
                        <span className='material-icons md-18'>close</span>
                    </button>
                </div>
            </div>
            <textarea
                className='diary-content'
                name='content'
                placeholder='Start writting your thoughts here...'
                value={diary.content}
                onChange={handleDiaryInputChange}
            />
        </div>
    );
}

export default CreateDiary;