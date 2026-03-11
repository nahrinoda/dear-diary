import React, { useEffect, useState } from 'react';
import CreateDiary from './CreateDiary';
import Card from './Card';
import { createActor, canisterId } from '../../../declarations/deardiary';
import { useNavigate } from "react-router-dom";
import Header from './Header';
import AddButton from './AddButton';
import { useAuth } from '../AuthContext';
import { v4 as uuidv4 } from 'uuid';

function Create() {
    let navigate = useNavigate();
    const { agent } = useAuth();

    const [nftPrincipal, setNftPrincipal] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [createButtonShowing, setCreateButtonShowing] = useState(true);
    const [diaries, setDiaries] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const deardiary = createActor(canisterId, { agent });
            const diariesArray = await deardiary.readDiaries();
            setDiaries(diariesArray.map(d => ({ ...d, localId: uuidv4() })));
        } catch (err) {
            console.error('fetchData failed:', err);
        }
    };

    const handleAddingDiary = async (newDiary) => {
        const deardiary = createActor(canisterId, { agent });
        const { title, content } = newDiary;
        await deardiary.createDiary(title, content);
        setDiaries(prev => [{ ...newDiary, localId: uuidv4() }, ...prev]);
    };

    const handleDeleteDiary = async (localId) => {
        const idx = diaries.findIndex(d => d.localId === localId);
        if (idx === -1) return;
        const deardiary = createActor(canisterId, { agent });
        await deardiary.removeDiaries(idx);
        setDiaries(prev => prev.filter(d => d.localId !== localId));
    };

    const handleCloseDiary = () => {
        setCreateButtonShowing(true);
    };

    const handleCreateNewDiary = () => {
        setCreateButtonShowing(false);
    };

    // Called by CreateDiary after a successful mint
    const handleMintSuccess = (newNFTId) => {
        setNftPrincipal(newNFTId);
        setShowModal(true);
        setCreateButtonShowing(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openGalleryPage = () => {
        navigate('/collection');
    };

    return (
        <>
            <Header />
            {showModal && (
                <div className='minting-modal' onClick={closeModal}>
                    <button
                        onClick={closeModal}
                        style={{
                            position: 'absolute', top: 16, right: 20,
                            background: 'none', border: 'none', color: '#fff',
                            fontSize: 28, cursor: 'pointer', lineHeight: 1,
                        }}
                        aria-label="Close"
                    >×</button>
                    {nftPrincipal && (
                        <>
                            <h2 className="minted-success">MINTED!</h2>
                            <Card
                                id={nftPrincipal}
                                handleCardOnClick={openGalleryPage}
                                cardStyle={{ cursor: "pointer" }}
                            />
                            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); closeModal(); handleCreateNewDiary(); }}
                                    className="sell-confirm-button"
                                >Write another</button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); openGalleryPage(); }}
                                    className="sell-confirm-button"
                                >View collection</button>
                            </div>
                        </>
                    )}
                </div>
            )}
            <div className="content">
                {createButtonShowing ? (
                    <>
                        <AddButton handleClick={handleCreateNewDiary} buttonName="diary" />
                        {diaries.length > 0 && (
                            <p style={{ textAlign: 'center', color: '#8C8C8C', fontSize: 13, margin: '4px 0 12px' }}>
                                {diaries.length} {diaries.length === 1 ? 'diary' : 'diaries'} saved
                            </p>
                        )}
                        <div className='diaries-gallery'>
                            {diaries.map((diary) => (
                                <Card
                                    key={diary.localId}
                                    id={diary.localId}
                                    staticTitle={diary.title}
                                    staticContent={diary.content}
                                    onDelete={() => handleDeleteDiary(diary.localId)}
                                    isCardMinted={false}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <CreateDiary
                        handleCloseDiary={handleCloseDiary}
                        onMintSuccess={handleMintSuccess}
                    />
                )}
            </div>
        </>
    );
}

export default Create;
