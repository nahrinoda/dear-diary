import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { createActor, canisterId } from '../../../declarations/deardiary';
import { useAuth } from '../AuthContext';

async function generateCoverImage(title) {
    const prompt = encodeURIComponent(`${title}, diary journal cover art, painterly, warm tones, soft light`);
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&nologo=true`;

    // Pollinations can return 5xx on first attempt — retry up to 3 times
    for (let attempt = 1; attempt <= 3; attempt++) {
        const response = await fetch(url);
        if (response.ok) {
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            return { bytes: [...new Uint8Array(arrayBuffer)], objectUrl: URL.createObjectURL(blob) };
        }
        if (attempt === 3) throw new Error(`Image generation failed (${response.status})`);
        await new Promise(r => setTimeout(r, 1500 * attempt));
    }
}

function CreateDiary({ handleCloseDiary, onMintSuccess }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [coverImage, setCoverImage] = useState(null);
    const [status, setStatus] = useState('');  // '' | 'generating' | 'minting'
    const [mintError, setMintError] = useState('');
    const { agent } = useAuth();

    const isBusy = status !== '';

    async function onSubmit(data) {
        setMintError('');
        try {
            setStatus('generating');
            const { bytes, objectUrl } = await generateCoverImage(data.title);
            setCoverImage(objectUrl);

            setStatus('minting');
            const deardiary = createActor(canisterId, { agent });
            const newNFTId = await deardiary.mint(data.title, data.content, bytes);
            if (onMintSuccess) onMintSuccess(newNFTId);
        } catch (err) {
            console.error('Failed:', err);
            setMintError('Something went wrong. Please try again.');
        } finally {
            setStatus('');
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
                        disabled={isBusy}
                    />
                    {errors.title && <span style={{ color: '#DE5B5B', fontSize: '12px' }}>{errors.title.message}</span>}
                </div>
                <div className='buttons-container'>
                    <button
                        id="save-button"
                        className='save-button'
                        onClick={handleSubmit(onSubmit)}
                        disabled={isBusy}
                    >
                        {isBusy
                            ? <div className="lds-ellipsis" style={{ display: 'inline-block', width: 24, height: 24 }}><div></div><div></div><div></div><div></div></div>
                            : <span className='material-icons md-18'>save</span>
                        }
                    </button>
                    <button
                        id="delete-button"
                        className='delete-button'
                        onClick={handleCloseDiary}
                        disabled={isBusy}
                    >
                        <span className='material-icons md-18'>close</span>
                    </button>
                </div>
            </div>

            {mintError && <p style={{ color: '#DE5B5B', textAlign: 'center', margin: '8px 0' }}>{mintError}</p>}

            <div className='cover-image-input'>
                {status === 'generating' && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#8C8C8C' }}>
                        <div className="lds-ellipsis" style={{ margin: '0 auto 8px' }}><div></div><div></div><div></div><div></div></div>
                        <span style={{ fontSize: '13px' }}>Generating your cover art...</span>
                    </div>
                )}
                {status === 'minting' && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#8C8C8C' }}>
                        <div className="lds-ellipsis" style={{ margin: '0 auto 8px' }}><div></div><div></div><div></div><div></div></div>
                        <span style={{ fontSize: '13px' }}>Minting your diary on the blockchain...</span>
                    </div>
                )}
                {coverImage && status === '' && (
                    <img className="diary-cover-image" src={coverImage} alt="AI generated cover" />
                )}
                {!coverImage && status === '' && (
                    <div style={{ textAlign: 'center', color: '#8C8C8C', padding: '16px', fontSize: '13px' }}>
                        <span className="material-icons" style={{ fontSize: 32, display: 'block', marginBottom: 4 }}>auto_awesome</span>
                        AI will generate a cover image from your title &amp; content when you save
                    </div>
                )}
            </div>

            <textarea
                {...register("content", { required: true })}
                className='diary-content'
                placeholder='Start writing your thoughts here...'
                disabled={isBusy}
            />
        </div>
    );
}

export default CreateDiary;
