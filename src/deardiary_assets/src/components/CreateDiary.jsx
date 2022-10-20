import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import Card from './Card';

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
        content: '' || editContent,
        image: ''
    });

    const handleDiaryInputChange = async (e) => {
        const { name, value, files } = e.target;
        setDiary((previousDiary) => {
            return {
                ...previousDiary,
                [name]: name == 'image' ? files[0] : value,
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
                        required={true}
                    />
                </div>
                <div className='cover-image-input'>
                    <input 
                        className='upload-file' 
                        name="image" 
                        type="file" 
                        onChange={handleDiaryInputChange}
                        accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp" 
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
            <img src={diary.image} width="150px" height="150px" />
            <textarea
                className='diary-content'
                name='content'
                placeholder='Start writting your thoughts here...'
                value={diary.content}
                onChange={handleDiaryInputChange}
                required={true}
            />
        </div>
    );
}

export default CreateDiary;