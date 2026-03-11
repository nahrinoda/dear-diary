import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { createActor, canisterId } from '../../../declarations/deardiary';
import { useAuth } from '../AuthContext';

function CreateDiary({ handleCloseDiary, onMintSuccess }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [currentImage, setCurrentImage] = useState('');
    const [isMinting, setIsMinting] = useState(false);
    const [mintError, setMintError] = useState('');
    const { agent } = useAuth();

    async function onSubmit(data) {
        setIsMinting(true);
        setMintError('');
        try {
            const deardiary = createActor(canisterId, { agent });
            const title = data.title;
            const content = data.content;
            const image = data.image[0];
            const imageByteData = [...new Uint8Array(await image.arrayBuffer())];
            setCurrentImage(URL.createObjectURL(image));
            const newNFTId = await deardiary.mint(title, content, imageByteData);
            if (onMintSuccess) onMintSuccess(newNFTId);
        } catch (err) {
            console.error('Mint failed:', err);
            setMintError('Something went wrong. Please try again.');
        } finally {
            setIsMinting(false);
        }
    }

    return (
        <div className="diary">
            <div className='diary-controls'>
                <div className='diary-label-container'>
                    <input
                        {...register("title", { required: "Title is required" })}
                        type="text"
                        className='label'
                        placeholder='Diary Label'
                        disabled={isMinting}
                    />
                    {errors.title && <span style={{ color: '#DE5B5B', fontSize: '12px' }}>{errors.title.message}</span>}
                </div>
                <div className='buttons-container'>
                    <button
                        id="save-button"
                        className={'save-button'}
                        onClick={handleSubmit(onSubmit)}
                        disabled={isMinting}
                    >
                        {isMinting
                            ? <div className="lds-ellipsis" style={{ display: 'inline-block', width: 24, height: 24 }}><div></div><div></div><div></div><div></div></div>
                            : <span className='material-icons md-18'>save</span>
                        }
                    </button>
                    <button
                        id="delete-button"
                        className={'delete-button'}
                        onClick={handleCloseDiary}
                        disabled={isMinting}
                    >
                        <span className='material-icons md-18'>close</span>
                    </button>
                </div>
            </div>
            {mintError && <p style={{ color: '#DE5B5B', textAlign: 'center', margin: '8px 0' }}>{mintError}</p>}
            <div className='cover-image-input'>
                <label htmlFor="inputTag">
                    <input
                        {...register("image", { required: "Cover image is required" })}
                        id="inputTag"
                        className='upload-file'
                        type="file"
                        accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
                        disabled={isMinting}
                    />
                    {currentImage.length === 0 && <span className="material-icons add-photo-icon">add_photo_alternate</span>}
                </label>
                {currentImage.length > 0 && <img className="diary-cover-image" src={currentImage} alt="cover preview" />}
                {errors.image && <span style={{ color: '#DE5B5B', fontSize: '12px' }}>{errors.image.message}</span>}
            </div>
            <textarea
                {...register("content", { required: true })}
                className='diary-content'
                placeholder='Start writing your thoughts here...'
                disabled={isMinting}
            />
        </div>
    );
}

export default CreateDiary;
