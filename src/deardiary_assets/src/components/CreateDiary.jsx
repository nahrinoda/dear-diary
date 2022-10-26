import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { deardiary } from '../../../declarations/deardiary';
import { Principal } from '@dfinity/principal';

function CreateDiary({ handleCloseDiary }) {
    const { register, handleSubmit } = useForm();
    const [currentImage, setCurrentImage] = useState('');

    async function onSubmit(data) {
        const title = data.title;
        const content = data.content;
        const image = data.image[0];
        const imageByteData = [...new Uint8Array(await image.arrayBuffer())];
        setCurrentImage(URL.createObjectURL(image));
        const newNFTId = await deardiary.mint(title, content, imageByteData);
        console.log(newNFTId.toText())
    };

    // const saveButtonStyle = isSaveBtnDisabled ? 'button-inactive' : 'button';
    // const saveButtonTitle = isDiaryEddited ? 'edit' : 'save';
    return (
        <div className="diary">
            <div className='diary-controls'>
                <div className='diary-label-container'>
                    <input
                        {...register("title", { required: true })}
                        type="text"
                        className='label'
                        placeholder='Diary Label'
                    />
                </div>
                <div className='buttons-container'>
                    <button
                        id="save-button"
                        className={'save-button'}
                        onClick={handleSubmit(onSubmit)}
                    // disabled={isSaveBtnDisabled}
                    >
                        <span className='material-icons md-18'>save</span>
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
            {/* <div className='cover-image-input'> */}
                {/* <label htmlFor="inputTag"> */}
                    <input
                        {...register("image", { required: true })}
                        id="inputTag"
                        className='upload-file'
                        type="file"
                        accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
                    />
                    {/* {currentImage.length === 0 && <span className="material-icons add-photo-icon">add_photo_alternate</span>} */}
                {/* </label> */}
                {/* {currentImage.length > 0 && <img className="diary-cover-image" src={currentImage} />} */}
            {/* </div> */}
            <textarea
                {...register("content", { required: true })}
                className='diary-content'
                placeholder='Start writting your thoughts here...'
            />
        </div>
    );
}

export default CreateDiary;