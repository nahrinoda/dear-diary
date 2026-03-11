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
        const deardiary = createActor(canisterId, { agent });
        const diariesArray = await deardiary.readDiaries();
        // Attach a stable local ID to each diary so deletion is index-safe
        setDiaries(diariesArray.map(d => ({ ...d, localId: uuidv4() })));
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
                    {nftPrincipal && (
                        <>
                            <h2 className="minted-success">MINTED!</h2>
                            <Card
                                id={nftPrincipal}
                                handleCardOnClick={openGalleryPage}
                                cardStyle={{ cursor: "pointer" }}
                            />
                            <p style={{ color: '#fff', marginTop: 12, fontSize: 13 }}>Click the card to view your collection</p>
                        </>
                    )}
                </div>
            )}
            <div className="content">
                {createButtonShowing ? (
                    <>
                        <AddButton handleClick={handleCreateNewDiary} buttonName="diary" />
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
